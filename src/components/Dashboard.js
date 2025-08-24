import React from 'react';
import AnalyticsCard from './AnalyticsCard';
import '../styles/Dashboard.css';

const Dashboard = ({ analytics, selectedQueue }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p className="dashboard-subtitle">
          {selectedQueue ? `Analytics for ${selectedQueue.name}` : 'Overall system analytics'}
        </p>
      </div>

      <div className="analytics-grid">
        <AnalyticsCard
          icon="Clock"
          iconColor="blue"
          label="Avg Wait Time"
          value={`${analytics.avgWaitTime} min`}
        />
        <AnalyticsCard
          icon="Users"
          iconColor="green"
          label="Tokens Served"
          value={analytics.totalTokensServed}
        />
        <AnalyticsCard
          icon="TrendingUp"
          iconColor="orange"
          label="Current Queue Length"
          value={analytics.currentQueueLength}
        />
        <AnalyticsCard
          icon="BarChart3"
          iconColor="purple"
          label="Total Queues"
          value={analytics.totalQueues}
        />
      </div>

      <div className="tips-card">
        <h3 className="tips-title">Queue Management Tips</h3>
        <div className="tips-grid">
          <div className="tip-item blue-tip">
            <h4 className="tip-title">Optimize Wait Times</h4>
            <p className="tip-text">
              Monitor average wait times and adjust service processes accordingly.
            </p>
          </div>
          <div className="tip-item green-tip">
            <h4 className="tip-title">Track Peak Hours</h4>
            <p className="tip-text">
              Identify busy periods to allocate resources effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
