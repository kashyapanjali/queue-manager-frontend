import React, { useEffect, useState } from 'react';
import AnalyticsCard from './AnalyticsCard';
import '../styles/Dashboard.css';

const Dashboard = ({ queues }) => {
  const [analytics, setAnalytics] = useState({
    avgWaitTime: 0,
    totalTokens: 0,
    tokensWaiting: 0,
    tokensServing: 0,
    tokensCompleted: 0,
    totalQueues: 0,
  });

  useEffect(() => {
    if (!queues || queues.length === 0) return;
  
    const totalQueues = queues.length;
  
    // Total tokens ever added
    const totalTokens = queues.reduce((acc, q) => acc + (q.tokens?.length || 0), 0);
  
    // Tokens currently waiting
    const tokensWaiting = queues.reduce(
      (acc, q) => acc + (q.tokens?.filter(t => t.status === 'waiting').length || 0),
      0
    );
  
    // Tokens currently being served
    const tokensServing = queues.reduce(
      (acc, q) => acc + (q.tokens?.filter(t => t.status === 'serving').length || 0),
      0
    );
  
    // Tokens completed
    const tokensCompleted = queues.reduce(
      (acc, q) => acc + (q.tokens?.filter(t => t.status === 'completed').length || 0),
      0
    );
  
    // Average wait time of completed tokens
    let totalWaitMinutes = 0;
    let completedCount = 0;
  
    queues.forEach(queue => {
      queue.tokens?.forEach(token => {
        if (token.status === 'completed' && token.createdAt) {
          const waitTimeMs = new Date() - new Date(token.createdAt);
          const waitMinutes = waitTimeMs / 1000 / 60;
          totalWaitMinutes += waitMinutes;
          completedCount++;
        }
      });
    });
  
    const avgWaitTime = completedCount > 0 ? (totalWaitMinutes / completedCount).toFixed(2) : 0;
  
    setAnalytics({
      avgWaitTime,
      totalTokens,
      tokensWaiting,
      tokensServing,
      tokensCompleted,
      totalQueues
    });
  }, [queues]);
  

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
      </div>

      <div className="analytics-grid">
        <AnalyticsCard icon="Clock" iconColor="blue" label="Avg Wait Time" value={`${analytics.avgWaitTime} min`} />
        <AnalyticsCard icon="Users" iconColor="green" label="Total Tokens" value={analytics.totalTokens} />
        <AnalyticsCard icon="TrendingUp" iconColor="orange" label="Tokens Waiting" value={analytics.tokensWaiting} />
        <AnalyticsCard icon="BarChart3" iconColor="purple" label="Total Queues" value={analytics.totalQueues} />
        <AnalyticsCard icon="Activity" iconColor="red" label="Tokens Served" value={analytics.tokensServing} />
      </div>
    </div>
  );
};

export default Dashboard;
