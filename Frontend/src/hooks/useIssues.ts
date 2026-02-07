import { useCallback } from 'react';
import { useIssueStore } from '../stores/store';
import { apiService } from '../services/api';
import type { CreateIssueDTO   } from '../types';

export const useIssues = () => {
  const {
    issues,
    filteredIssues,
    filters,
    stats,
    isLoading,
    error,
    setIssues,
    addIssue,
    updateIssue,
    deleteIssue,
    setFilters,
    setLoading,
    setError,
  } = useIssueStore();

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllIssues();
      setIssues(response.issues);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch issues');
      console.error('Error fetching issues:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setIssues, setLoading, setError]);

  const createIssue = useCallback(async (issueData: CreateIssueDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newIssue = await apiService.createIssue(issueData);
      addIssue(newIssue);
      return newIssue;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create issue');
      console.error('Error creating issue:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addIssue, setLoading, setError]);

  const editIssue = useCallback(async (id: string, issueData: Partial<CreateIssueDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiService.updateIssue(id, issueData);
      updateIssue(id, updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update issue');
      console.error('Error updating issue:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateIssue, setLoading, setError]);

  const removeIssue = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteIssue(id);
      deleteIssue(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete issue');
      console.error('Error deleting issue:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteIssue, setLoading, setError]);

  const exportToCSV = useCallback(async () => {
    try {
      const blob = await apiService.exportIssuesCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `issues-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export issues');
      console.error('Error exporting issues:', err);
    }
  }, [filters, setError]);

  return {
    issues,
    filteredIssues,
    filters,
    stats,
    isLoading,
    error,
    fetchIssues,
    createIssue,
    editIssue,
    removeIssue,
    setFilters,
    exportToCSV,
  };
};