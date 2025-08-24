import React from 'react';
import TokenItem from './TokenItem';
import { Plus, Play, Check } from 'lucide-react';
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
  onCancelToken,
  onCompleteToken
}) => {
  // Current token being served
  const currentServing = tokens.find(t => t.status === "serving");
  
  // Next token to be assigned (first waiting token)
  const nextToken = tokens.find(t => t.status === "waiting");

  return (
    <div className="card">
      <div className="card-header">
        <div className="token-header">
          <h2 className="card-title">{selectedQueue.name} - Token Management</h2>
          <div className="queue-count">{tokens.length} people in queue</div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="token-management">
          {/* Add Token */}
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

          {/* Assign & Complete Buttons at the top */}
          {tokens.length > 0 && (
            <div className="assign-section">
              <button 
                onClick={onAssignToken} 
                className="assign-button"
                disabled={!nextToken || currentServing}
              >
                <Play className="button-icon" />
                <span>
                  {nextToken 
                    ? `Assign Token #${nextToken.tokenNumber}` 
                    : "No Tokens Waiting"}
                </span>
              </button>

              <button 
                onClick={onCompleteToken} 
                className="complete-button" 
                disabled={!currentServing}
              >
                <Check className="button-icon" />
                <span>
                  {currentServing 
                    ? `Complete Token #${currentServing.tokenNumber}` 
                    : "No Token Serving"}
                </span>
              </button>
            </div>
          )}

          {/* Token List */}
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
