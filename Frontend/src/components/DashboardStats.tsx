import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { IssueStats } from '../types';

interface DashboardStatsProps {
  stats: IssueStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Issues',
      value: stats.total,
      change: 12,
      trend: 'up' as const,
      icon: '📊',
      iconBg: '#f4ecff',
      iconColor: '#9b59b6',
    },
    {
      title: 'Open Issues',
      value: stats.open,
      change: 8,
      trend: 'up' as const,
      icon: '🔴',
      iconBg: '#fef5e7',
      iconColor: '#f39c12',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      change: -5,
      trend: 'down' as const,
      icon: '🔵',
      iconBg: '#e8f4fd',
      iconColor: '#3498db',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      change: 23,
      trend: 'up' as const,
      icon: '✅',
      iconBg: '#e8f8f5',
      iconColor: '#27ae60',
    },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral', change: number) => {
    if (change === 0) return <Minus size={14} />;
    if (trend === 'up') return <TrendingUp size={14} />;
    return <TrendingDown size={14} />;
  };

  return (
    <div className="dashboard-stats">
      {statCards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <div className="stat-title">{card.title}</div>
            <div 
              className="stat-icon" 
              style={{ 
                background: card.iconBg, 
                color: card.iconColor 
              }}
            >
              {card.icon}
            </div>
          </div>
          <div className="stat-number">{card.value}</div>
          <div className={`stat-change ${card.change < 0 ? 'negative' : 'positive'}`}>
            {getTrendIcon(card.trend, card.change)}
            {Math.abs(card.change)}% from last week
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
