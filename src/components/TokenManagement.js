import React from 'react';
import TokenItem from './TokenItem';
import { Plus, Play } from 'lucide-react';
import '../styles/TokenManagement.css';

const TokenManagement = ({ 
  selectedQueue, 
  tokens, 
  newPersonName, 
  setNewPersonName, 
  onAddToken, 
  onMoveUp, 
  onMoveDown, 
  onAssignToken, 
  onCancelToken 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="token-header">
          <h2 className="card-title">{selectedQueue.name} - Token Management</h2>
          <div className="queue-count">{tokens.length} people waiting</div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="token-management">
          <div className="token-form">
            <input
              type="text"
              placeholder="Person name"
              className="person-input"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <button onClick={onAddToken} className="add-person-button">
              <Plus className="button-icon" />
            </button>
          </div>

          {tokens.length > 0 && (
            <div className="assign-section">
              <button onClick={onAssignToken} className="assign-button">
                <Play className="button-icon" />
                <span>Assign Next Token</span>
              </button>
            </div>
          )}

          <div className="token-list">
            {tokens.map((token, index) => (
              <TokenItem
                key={token._id}
                token={token}
                index={index}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onCancel={onCancelToken}
                totalTokens={tokens.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenManagement;
