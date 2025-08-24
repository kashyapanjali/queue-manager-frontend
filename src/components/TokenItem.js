import React from 'react';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import '../styles/TokenItem.css';

const TokenItem = ({ token, index, onMoveUp, onMoveDown, onCancel, totalTokens }) => {
  const isFirst = index === 0;
  const isLast = index === totalTokens - 1;
  
  const getStatusClass = () => {
    switch (token.status) {
      case 'serving':
        return 'token-item-serving';
      case 'completed':
        return 'token-item-completed';
      default:
        return 'token-item-waiting';
    }
  };

  return (
    <div className={`token-item ${getStatusClass()} ${isFirst ? 'token-item-next' : ''}`}>
      <div className="token-left">
        <div className={`token-number ${isFirst ? 'token-number-next' : ''}`}>
          #{token.tokenNumber}
        </div>
        <div className="token-info">
          <div className="token-name">{token.personName}</div>
          <div className="token-time">Added {new Date(token.createdAt).toLocaleTimeString()}</div>
          <div className="token-status">Status: {token.status}</div>
        </div>
        {isFirst && token.status === 'waiting' && <div className="next-badge">NEXT</div>}
        {token.status === 'serving' && <div className="serving-badge">SERVING</div>}
        {token.status === 'completed' && <div className="completed-badge">COMPLETED</div>}
      </div>
      <div className="token-actions">
        <button onClick={() => onMoveUp(token._id)} disabled={isFirst} className="action-button">
          <ArrowUp className="action-icon" />
        </button>
        <button onClick={() => onMoveDown(token._id)} disabled={isLast} className="action-button">
          <ArrowDown className="action-icon" />
        </button>
        <button onClick={() => onCancel(token._id)} className="action-button cancel-button">
          <X className="action-icon" />
        </button>
      </div>
    </div>
  );
};

export default TokenItem;
