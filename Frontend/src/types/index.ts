export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueSeverity = 'minor' | 'major' | 'critical' | 'enhancement';

export interface CreateIssueDTO {
  title: string;
  description: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
}

export interface UpdateIssueDTO extends Partial<CreateIssueDTO> {
  id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface IssueFilters {
  search?: string;
  status?: IssueStatus | 'all';
  priority?: IssuePriority | 'all';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssuesResponse {
  issues: Issue[];
  meta: PaginationMeta;
}

export interface IssueStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}
