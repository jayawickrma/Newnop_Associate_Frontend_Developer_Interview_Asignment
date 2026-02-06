import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardStats from '../components/DashboardStats';
import IssuesTable from '../components/IssuesTable';
import IssueModal from '../components/IssueModal';
import { useIssues } from '../hooks/useIssues';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../stores/store';
import { apiService } from '../services/api';
import type { Issue, IssueStatus, IssuePriority, CreateIssueDTO } from '../types';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { user, setUser, logout: logoutStore } = useAuthStore();
  
  const {
    filteredIssues,
    stats,
    isLoading,
    error,
    fetchIssues,
    createIssue,
    editIssue,
    removeIssue,
    setFilters,
    exportToCSV,
  } = useIssues();

  const [currentView, setCurrentView] = useState<IssueStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search query to optimize API requests
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        handleLogout();
      }
    };
    fetchUser();
  }, [setUser]);

  // Fetch issues on mount and when filters change
  useEffect(() => {
    fetchIssues();
  }, []);

  // Update filters when search or filter values change
  useEffect(() => {
    setFilters({
      search: debouncedSearch,
      priority: filterPriority,
      status: filterStatus === 'all' ? currentView : filterStatus,
    });
    setCurrentPage(1); // Reset to first page when filters change
  }, [debouncedSearch, filterPriority, filterStatus, currentView, setFilters]);

  const handleViewChange = (view: IssueStatus | 'all') => {
    setCurrentView(view);
    setFilterStatus('all'); // Reset status filter when changing view
  };

  const handleCreateIssue = () => {
    setCurrentIssue(null);
    setShowModal(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setCurrentIssue(issue);
    setShowModal(true);
  };

  const handleSaveIssue = async (issueData: CreateIssueDTO) => {
    if (currentIssue) {
      await editIssue(currentIssue.id, issueData);
    } else {
      await createIssue(issueData);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await removeIssue(id);
    }
  };

  const handleResolveIssue = async (id: string) => {
    if (window.confirm('Mark this issue as resolved?')) {
      await editIssue(id, { status: 'resolved' });
    }
  };

  const handleLogout = () => {
    apiService.logout();
    logoutStore();
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleViewChange} 
        stats={stats} 
      />
      
      <main className="main-content">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onCreateIssue={handleCreateIssue}
          onExportCSV={exportToCSV}
          onLogout={handleLogout}
          userName={user?.name || user?.email || 'User'}
        />
        
        <div className="content-area">
          {error && (
            <div className="error-banner">
              <span>{error}</span>
            </div>
          )}
          
          <DashboardStats stats={stats} />
          
          {isLoading && !paginatedIssues.length ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading issues...</p>
            </div>
          ) : (
            <IssuesTable
              issues={paginatedIssues}
              onEdit={handleEditIssue}
              onDelete={handleDeleteIssue}
              onResolve={handleResolveIssue}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalIssues={filteredIssues.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </main>

      {showModal && (
        <IssueModal
          issue={currentIssue}
          onClose={() => setShowModal(false)}
          onSave={handleSaveIssue}
        />
      )}
    </div>
  );
};

export default Dashboard;
