import axios from 'axios';
import type  { AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Issue,
  CreateIssueDTO,
  IssueFilters,
  IssuesResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/login', credentials);
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/register', userData);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.api.get<User>('/auth/me');
    return data;
  }

  // Issues endpoints
  async getAllIssues(filters?: IssueFilters): Promise<IssuesResponse> {
    const { data } = await this.api.get<IssuesResponse>('/issues', { params: filters });
    return data;
  }

  async getIssue(id: string): Promise<Issue> {
    const { data} = await this.api.get<Issue>(`/issues/${id}`);
    return data;
  }

  async createIssue(issueData: CreateIssueDTO): Promise<Issue> {
    const { data } = await this.api.post<Issue>('/issues', issueData);
    return data;
  }

  async updateIssue(id: string, issueData: Partial<CreateIssueDTO>): Promise<Issue> {
    const { data } = await this.api.put<Issue>(`/issues/${id}`, issueData);
    return data;
  }

  async deleteIssue(id: string): Promise<void> {
    await this.api.delete(`/issues/${id}`);
  }

  async exportIssuesCSV(filters?: IssueFilters): Promise<Blob> {
    const { data } = await this.api.get('/issues/export/csv', {
      params: filters,
      responseType: 'blob',
    });
    return data;
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export const apiService = new ApiService();
