import React from 'react';
import { Users } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ activeView, setActiveView, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Users className="header-icon" />
          <h1 className="header-title">Queue Management System</h1>
        </div>
        <div className="header-right">
          <button
            onClick={() => setActiveView('queues')}
            className={`nav-button ${activeView === 'queues' ? 'nav-button-active' : ''}`}
          >
            Queues
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`nav-button ${activeView === 'dashboard' ? 'nav-button-active' : ''}`}
          >
            Dashboard
          </button>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
