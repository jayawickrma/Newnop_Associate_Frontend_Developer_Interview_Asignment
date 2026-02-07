import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardStats from '../components/DashboardStats';
import IssuesTable from '../components/IssuesTable';
import IssueModal from '../components/IssueModal';
import ToastContainer from '../components/ToastContainer';
import LoadingOverlay from '../components/LoadingOverlay';
import { useIssues } from '../hooks/useIssues';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
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

  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [currentView, setCurrentView] = useState<IssueStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Initialize dashboard
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
          showError('Failed to load dashboard');
        }
      }
    };

    initializeDashboard();
  }, []);

  // Update filters
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
        setProcessingAction('Updating issue...');
        await editIssue(currentIssue.id, issueData);
        showSuccess('Issue updated successfully!');
      } else {
        setProcessingAction('Creating issue...');
        await createIssue(issueData);
        showSuccess('Issue created successfully!');
      }
      setShowModal(false);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to save issue');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        setProcessingAction('Deleting issue...');
        await removeIssue(id);
        showSuccess('Issue deleted successfully!');
      } catch (error: any) {
        showError(error.response?.data?.message || 'Failed to delete issue');
      } finally {
        setProcessingAction(null);
      }
    }
  };

  const handleResolveIssue = async (id: string) => {
    if (window.confirm('Mark this issue as resolved?')) {
      try {
        setProcessingAction('Resolving issue...');
        await editIssue(id, { status: 'resolved' });
        showSuccess('Issue marked as resolved!');
      } catch (error: any) {
        showError(error.response?.data?.message || 'Failed to resolve issue');
      } finally {
        setProcessingAction(null);
      }
    }
  };

  const handleLogout = () => {
    apiService.logout();
    logoutStore();
    navigate('/login');
  };

  const handleExportCSV = async () => {
    try {
      setProcessingAction('Exporting to CSV...');
      await exportToCSV();
      showSuccess('CSV exported successfully!');
    } catch (error: any) {
      showError(
          error?.response?.data?.message || 'Failed to export CSV'
      );
    } finally {
      setProcessingAction(null);
    }
  };


  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  return (
      <div className="app-container">
        {processingAction && <LoadingOverlay message={processingAction} />}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

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
              onExportCSV={handleExportCSV}
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