import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    machines: 0,
    articles: 0,
    interventions: 0,
    planning: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [machinesRes, articlesRes, interventionsRes, planningRes] = await Promise.all([
        axios.get('http://localhost:5000/api/parc-machine'),
        axios.get('http://localhost:5000/api/article'),
        axios.get('http://localhost:5000/api/intervention'),
        axios.get('http://localhost:5000/api/planning')
      ]);

      setStats({
        machines: machinesRes.data.length,
        articles: articlesRes.data.length,
        interventions: interventionsRes.data.length,
        planning: planningRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Tableau de Bord</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-content">
            <h3>Machines</h3>
            <p className="stat-value">{stats.machines}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Articles</h3>
            <p className="stat-value">{stats.articles}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>Interventions</h3>
            <p className="stat-value">{stats.interventions}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Plannings</h3>
            <p className="stat-value">{stats.planning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
