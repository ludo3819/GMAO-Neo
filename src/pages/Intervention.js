import React, { useState, useEffect } from 'react';
import './Intervention.css';
import axios from 'axios';

function Intervention() {
  const [interventions, setInterventions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    machineId: '',
    type: 'Maintenance',
    datePlanifiee: '',
    technicien: '',
    observations: ''
  });

  useEffect(() => {
    fetchInterventions();
    fetchMachines();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/intervention');
      setInterventions(response.data);
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parc-machine');
      setMachines(response.data);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/intervention', {
        ...formData,
        articles: []
      });
      fetchInterventions();
      setFormData({
        titre: '',
        description: '',
        machineId: '',
        type: 'Maintenance',
        datePlanifiee: '',
        technicien: '',
        observations: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating intervention:', error);
    }
  };

  const deleteIntervention = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/intervention/${id}`);
      fetchInterventions();
    } catch (error) {
      console.error('Error deleting intervention:', error);
    }
  };

  return (
    <div className="intervention">
      <div className="page-header">
        <h2>Interventions</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Nouvelle Intervention
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            required
          />
          <select
            value={formData.machineId}
            onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
            required
          >
            <option value="">Sélectionner Machine</option>
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option>Maintenance</option>
            <option>Réparation</option>
            <option>Révision</option>
            <option>Installation</option>
          </select>
          <input
            type="datetime-local"
            value={formData.datePlanifiee}
            onChange={(e) => setFormData({ ...formData, datePlanifiee: e.target.value })}
          />
          <input
            type="text"
            placeholder="Technicien"
            value={formData.technicien}
            onChange={(e) => setFormData({ ...formData, technicien: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ gridColumn: 'span 2' }}
          />
          <textarea
            placeholder="Observations"
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            style={{ gridColumn: 'span 2' }}
          />
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Créer</button>
        </form>
      )}

      <div className="interventions-list">
        {interventions.map(intervention => (
          <div key={intervention.id} className="intervention-card">
            <div className="intervention-header">
              <h3>{intervention.titre}</h3>
              <span className={`status ${intervention.statut.toLowerCase()}`}>{intervention.statut}</span>
            </div>
            <p><strong>Type:</strong> {intervention.type}</p>
            <p><strong>Machine:</strong> {machines.find(m => m.id === intervention.machineId)?.nom}</p>
            <p><strong>Date:</strong> {new Date(intervention.datePlanifiee).toLocaleDateString('fr-FR')}</p>
            <p><strong>Technicien:</strong> {intervention.technicien}</p>
            <p><strong>Description:</strong> {intervention.description}</p>
            <button className="btn-danger" onClick={() => deleteIntervention(intervention.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Intervention;
