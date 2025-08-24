import React from 'react';
import { Users } from 'lucide-react';
import '../styles/EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <Users className="empty-state-icon" />
        <h3 className="empty-state-title">Select a Queue</h3>
        <p className="empty-state-text">Choose a queue from the left to manage tokens</p>
      </div>
    </div>
  );
};

export default EmptyState;
