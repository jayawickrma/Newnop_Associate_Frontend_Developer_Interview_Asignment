import { create } from 'zustand';
import type { Issue, IssueFilters, User, IssueStats } from '../types';

interface IssueStore {
  issues: Issue[];
  filteredIssues: Issue[];
  filters: IssueFilters;
  stats: IssueStats;
  isLoading: boolean;
  error: string | null;
  
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updatedIssue: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  setFilters: (filters: IssueFilters) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  calculateStats: () => void;
  applyFilters: () => void;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  filteredIssues: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    page: 1,
    limit: 10,
  },
  stats: {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  },
  isLoading: false,
  error: null,

  setIssues: (issues) => {
    set({ issues });
    get().calculateStats();
    get().applyFilters();
  },

  addIssue: (issue) => {
    set((state) => ({ issues: [...state.issues, issue] }));
    get().calculateStats();
    get().applyFilters();
  },

  updateIssue: (id, updatedIssue) => {
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, ...updatedIssue } : issue
      ),
    }));
    get().calculateStats();
    get().applyFilters();
  },

  deleteIssue: (id) => {
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== id),
    }));
    get().calculateStats();
    get().applyFilters();
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().applyFilters();
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  calculateStats: () => {
    const { issues } = get();
    const stats: IssueStats = {
      total: issues.length,
      open: issues.filter((i) => i.status === 'open').length,
      inProgress: issues.filter((i) => i.status === 'in-progress').length,
      resolved: issues.filter((i) => i.status === 'resolved').length,
      closed: issues.filter((i) => i.status === 'closed').length,
    };
    set({ stats });
  },

  applyFilters: () => {
    const { issues, filters } = get();
    let filtered = [...issues];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower) ||
          issue.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((issue) => issue.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter((issue) => issue.priority === filters.priority);
    }

    set({ filteredIssues: filtered });
  },
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));
