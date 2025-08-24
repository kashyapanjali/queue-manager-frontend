import React from 'react';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import '../styles/TokenItem.css';

const TokenItem = ({ token, index, onMoveUp, onMoveDown, onCancel, totalTokens }) => {
  return (
    <div className={`token-item ${index === 0 ? 'token-item-next' : ''}`}>
      <div className="token-left">
      <div className={`token-number ${index === 0 ? 'token-number-next' : ''}`}>
        #{token.tokenNumber}
      </div>
        <div className="token-info">
          <div className="token-name">{token.personName}</div>
          <div className="token-time">Added {new Date(token.createdAt).toLocaleTimeString()}</div>
        </div>
        {index === 0 && <div className="next-badge">NEXT</div>}
      </div>
      <div className="token-actions">
        <button onClick={() => onMoveUp(token._id)} disabled={index === 0} className="action-button">
          <ArrowUp className="action-icon" />
        </button>
        <button onClick={() => onMoveDown(token._id)} disabled={index === totalTokens - 1} className="action-button">
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
