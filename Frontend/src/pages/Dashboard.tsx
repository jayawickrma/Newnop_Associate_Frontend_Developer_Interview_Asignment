import React, { useState, useEffect, useRef } from 'react';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, logout: logoutStore } = useAuthStore();
  const hasInitialized = useRef(false);

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

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Initialize dashboard - fetch user and issues ONCE
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeDashboard = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
        await fetchIssues();
      } catch (error: any) {
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          console.error('Error initializing dashboard:', error);
        }
      }
    };

    initializeDashboard();
  }, []);

  // Update CLIENT-SIDE filters when search or filter values change
  useEffect(() => {
    setFilters({
      search: debouncedSearch,
      priority: filterPriority,
      status: filterStatus === 'all' ? currentView : filterStatus,
    });
    setCurrentPage(1);
  }, [debouncedSearch, filterPriority, filterStatus, currentView, setFilters]);

  const handleViewChange = (view: IssueStatus | 'all') => {
    setCurrentView(view);
    setFilterStatus('all');
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
    try {
      if (currentIssue) {
        await editIssue(currentIssue.id, issueData);
      } else {
        await createIssue(issueData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving issue:', error);
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