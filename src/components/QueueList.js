import React from 'react';
import { Plus } from 'lucide-react';
import '../styles/QueueList.css';

const QueueList = ({ 
  queues, 
  selectedQueue, 
  onSelectQueue, 
  newQueueName, 
  setNewQueueName, 
  onCreateQueue 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Queues</h2>
      </div>
      <div className="card-content">
        <div className="queue-form">
          <input
            type="text"
            placeholder="Queue name"
            className="queue-input"
            value={newQueueName}
            onChange={(e) => setNewQueueName(e.target.value)}
          />
          <button onClick={onCreateQueue} className="add-button">
            <Plus className="button-icon" />
          </button>
        </div>
        <div className="queue-list">
          {queues.map((queue) => (
            <div
              key={queue._id}
              onClick={() => onSelectQueue(queue)}
              className={`queue-item ${selectedQueue?.id === queue.id ? 'queue-item-selected' : ''}`}
            >
              <div className="queue-name">{queue.name}</div>
              <div className="queue-date">
                Created {new Date(queue.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueList;
