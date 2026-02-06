import React from 'react';
import { Search, Download, Plus, User, LogOut } from 'lucide-react';
import type { IssuePriority, IssueStatus } from '../types';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: IssuePriority | 'all';
  setFilterPriority: (priority: IssuePriority | 'all') => void;
  filterStatus: IssueStatus | 'all';
  setFilterStatus: (status: IssueStatus | 'all') => void;
  onCreateIssue: () => void;
  onExportCSV: () => void;
  onLogout: () => void;
  userName?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  onCreateIssue,
  onExportCSV,
  onLogout,
  userName = 'User',
}) => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search issues by title, ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as IssuePriority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="btn-secondary" onClick={onExportCSV}>
          <Download size={16} />
          Export CSV
        </button>
        <button className="btn-primary" onClick={onCreateIssue}>
          <Plus size={16} />
          New Issue
        </button>
        <div className="user-menu">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-dropdown">
            <div className="user-name">{userName}</div>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
