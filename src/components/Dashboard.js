import React, { useEffect, useState } from 'react';
import AnalyticsCard from './AnalyticsCard';
import '../styles/Dashboard.css';

const Dashboard = ({ queues, selectedQueue }) => {
  const [analytics, setAnalytics] = useState({
    avgWaitTime: 0,
    totalTokensServed: 0,
    currentQueueLength: 0,
    totalQueues: 0,
  });

  useEffect(() => {
    if (!queues) return;

    // Calculate total queues
    const totalQueues = queues.length;

    // Calculate total tokens served across all queues
    const totalTokensServed = queues.reduce(
      (acc, q) => acc + (q.tokens?.filter(t => t.status === 'serving').length || 0),
      0
    );

    // Current queue length
    const currentQueueLength = selectedQueue?.tokens?.length || 0;

    // Average wait time (assuming each token has waitTime in minutes, else simulate)
    const waitTimes = selectedQueue?.tokens?.map(t => t.waitTime || 0) || [];
    const avgWaitTime =
      waitTimes.length > 0
        ? (waitTimes.reduce((acc, t) => acc + t, 0) / waitTimes.length).toFixed(2)
        : 0;

    setAnalytics({ avgWaitTime, totalTokensServed, currentQueueLength, totalQueues });
  }, [queues, selectedQueue]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p className="dashboard-subtitle">
          {selectedQueue ? `Analytics for ${selectedQueue.name}` : 'Overall system analytics'}
        </p>
      </div>

      <div className="analytics-grid">
        <AnalyticsCard icon="Clock" iconColor="blue" label="Avg Wait Time" value={`${analytics.avgWaitTime} min`} />
        <AnalyticsCard icon="Users" iconColor="green" label="Tokens Served" value={analytics.totalTokensServed} />
        <AnalyticsCard icon="TrendingUp" iconColor="orange" label="Current Queue Length" value={analytics.currentQueueLength} />
        <AnalyticsCard icon="BarChart3" iconColor="purple" label="Total Queues" value={analytics.totalQueues} />
      </div>
    </div>
  );
};

export default Dashboard;
