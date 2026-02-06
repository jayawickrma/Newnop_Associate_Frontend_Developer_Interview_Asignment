import React from 'react';
import { LayoutDashboard, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { IssueStatus, IssueStats } from '../types';

interface SidebarProps {
  currentView: IssueStatus | 'all';
  setCurrentView: (view: IssueStatus | 'all') => void;
  stats: IssueStats;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, stats }) => {
  const navItems = [
    { id: 'all' as const, label: 'All Issues', icon: LayoutDashboard, count: stats.total, color: '#9b59b6' },
    { id: 'open' as const, label: 'Open', icon: AlertCircle, count: stats.open, color: '#f39c12' },
    { id: 'in-progress' as const, label: 'In Progress', icon: Clock, count: stats.inProgress, color: '#3498db' },
    { id: 'resolved' as const, label: 'Resolved', icon: CheckCircle, count: stats.resolved, color: '#27ae60' },
    { id: 'closed' as const, label: 'Closed', icon: XCircle, count: stats.closed, color: '#95a5a6' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Issue Tracker</h1>
        <p>Dashboard</p>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Overview</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <div className="nav-item-left">
                  <Icon size={20} style={{ color: item.color }} />
                  <span>{item.label}</span>
                </div>
                <span className="badge">{item.count}</span>
              </div>
            );
          })}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Priority</div>
          <div className="nav-item">
            <div className="nav-item-left">
              <span className="priority-indicator high"></span>
              <span>High Priority</span>
            </div>
          </div>
          <div className="nav-item">
            <div className="nav-item-left">
              <span className="priority-indicator medium"></span>
              <span>Medium Priority</span>
            </div>
          </div>
          <div className="nav-item">
            <div className="nav-item-left">
              <span className="priority-indicator low"></span>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
