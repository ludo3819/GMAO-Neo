import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ParcMachine from './pages/ParcMachine';
import Article from './pages/Article';
import Intervention from './pages/Intervention';
import Planning from './pages/Planning';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'parc-machine':
        return <ParcMachine />;
      case 'article':
        return <Article />;
      case 'intervention':
        return <Intervention />;
      case 'planning':
        return <Planning />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <main className="main-content">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;
