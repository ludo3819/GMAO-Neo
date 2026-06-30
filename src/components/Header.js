import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">⚙️</div>
          <h1>GMAO Neo</h1>
        </div>
        <div className="header-info">
          <span className="status-indicator">●</span>
          <span>Système Local</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
