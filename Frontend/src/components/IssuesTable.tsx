import React from 'react';
import { Edit, Trash2, CheckCircle, List, Grid } from 'lucide-react';
import type { Issue } from '../types';

interface IssuesTableProps {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
  onResolve: (id: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalIssues: number;
  itemsPerPage: number;
}

const IssuesTable: React.FC<IssuesTableProps> = ({
  issues,
  onEdit,
  onDelete,
  onResolve,
  currentPage,
  totalPages,
  setCurrentPage,
  totalIssues,
  itemsPerPage,
}) => {
  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      open: 'open',
      'in-progress': 'in-progress',
      resolved: 'resolved',
      closed: 'closed',
    };
    return `status-badge ${statusMap[status] || 'open'}`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    const priorityMap: Record<string, string> = {
      high: 'high',
      medium: 'medium',
      low: 'low',
    };
    return `priority-badge ${priorityMap[priority] || 'medium'}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (issues.length === 0) {
    return (
      <div className="issues-section">
        <div className="section-header">
          <h2 className="section-title">Issues</h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No issues found</h3>
          <p className="empty-state-text">
            Try adjusting your filters or create a new issue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-section">
      <div className="section-header">
        <h2 className="section-title">Issues ({totalIssues})</h2>
        <div className="view-toggle">
          <button className="view-btn active">
            <List size={16} />
            Table
          </button>
          <button className="view-btn">
            <Grid size={16} />
            Board
          </button>
        </div>
      </div>

      <table className="issues-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Severity</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <span className="issue-id">{issue.id}</span>
              </td>
              <td className="issue-title-cell">
                <div className="issue-title">{issue.title}</div>
                <div className="issue-description">{issue.description}</div>
              </td>
              <td>
                <span className={getStatusBadgeClass(issue.status)}>
                  {issue.status === 'in-progress' ? 'In Progress' : issue.status}
                </span>
              </td>
              <td>
                <span className={getPriorityBadgeClass(issue.priority)}>
                  {issue.priority}
                </span>
              </td>
              <td>
                <span className="severity-badge">{issue.severity}</span>
              </td>
              <td>
                <div className="issue-date">{formatDate(issue.createdAt)}</div>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => onEdit(issue)}
                    title="Edit issue"
                  >
                    <Edit size={14} />
                  </button>
                  {issue.status !== 'resolved' && issue.status !== 'closed' && (
                    <button
                      className="action-btn"
                      onClick={() => onResolve(issue.id)}
                      title="Mark as resolved"
                    >
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(issue.id)}
                    title="Delete issue"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalIssues)} of {totalIssues} issues
          </div>
          <div className="pagination-buttons">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesTable;
