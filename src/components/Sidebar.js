import React from 'react';
import './Sidebar.css';

function Sidebar({ activeModule, setActiveModule }) {
  const modules = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: '📊' },
    { id: 'parc-machine', label: 'Parc Machine', icon: '🏭' },
    { id: 'article', label: 'Articles/Pièces', icon: '📦' },
    { id: 'intervention', label: 'Interventions', icon: '🔧' },
    { id: 'planning', label: 'Planning', icon: '📅' }
  ];

  return (
    <aside className="sidebar">
      <nav className="nav">
        {modules.map(module => (
          <button
            key={module.id}
            className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => setActiveModule(module.id)}
          >
            <span className="icon">{module.icon}</span>
            <span className="label">{module.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
