import React, { useState, useEffect } from 'react';
import './Planning.css';
import axios from 'axios';

function Planning() {
  const [planning, setPlanning] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    interventionId: '',
    machineId: '',
    dateDebut: '',
    dateFin: '',
    priorite: 'Normal',
    technicien: ''
  });

  useEffect(() => {
    fetchPlanning();
    fetchInterventions();
    fetchMachines();
  }, []);

  const fetchPlanning = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/planning');
      setPlanning(response.data);
    } catch (error) {
      console.error('Error fetching planning:', error);
    }
  };

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
      await axios.post('http://localhost:5000/api/planning', formData);
      fetchPlanning();
      setFormData({
        interventionId: '',
        machineId: '',
        dateDebut: '',
        dateFin: '',
        priorite: 'Normal',
        technicien: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating planning:', error);
    }
  };

  const deletePlanning = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/planning/${id}`);
      fetchPlanning();
    } catch (error) {
      console.error('Error deleting planning:', error);
    }
  };

  return (
    <div className="planning">
      <div className="page-header">
        <h2>Planning</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Ajouter au Planning
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <select
            value={formData.interventionId}
            onChange={(e) => setFormData({ ...formData, interventionId: e.target.value })}
            required
          >
            <option value="">Sélectionner Intervention</option>
            {interventions.map(i => (
              <option key={i.id} value={i.id}>{i.titre}</option>
            ))}
          </select>
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
          <input
            type="datetime-local"
            value={formData.dateDebut}
            onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={formData.dateFin}
            onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
          />
          <select
            value={formData.priorite}
            onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
          >
            <option>Basse</option>
            <option>Normal</option>
            <option>Haute</option>
            <option>Critique</option>
          </select>
          <input
            type="text"
            placeholder="Technicien"
            value={formData.technicien}
            onChange={(e) => setFormData({ ...formData, technicien: e.target.value })}
          />
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Créer</button>
        </form>
      )}

      <div className="planning-grid">
        {planning.map(plan => (
          <div key={plan.id} className="planning-card">
            <div className="planning-priority" style={{
              background: plan.priorite === 'Critique' ? '#ff0000' :
                         plan.priorite === 'Haute' ? '#ff9900' :
                         plan.priorite === 'Normal' ? 'var(--primary-cyan)' :
                         '#00ff00'
            }}>
              {plan.priorite}
            </div>
            <h3>{interventions.find(i => i.id === plan.interventionId)?.titre}</h3>
            <p><strong>Machine:</strong> {machines.find(m => m.id === plan.machineId)?.nom}</p>
            <p><strong>Début:</strong> {new Date(plan.dateDebut).toLocaleString('fr-FR')}</p>
            <p><strong>Fin:</strong> {plan.dateFin ? new Date(plan.dateFin).toLocaleString('fr-FR') : 'Non définie'}</p>
            <p><strong>Technicien:</strong> {plan.technicien}</p>
            <p><strong>Statut:</strong> {plan.statut}</p>
            <button className="btn-danger" onClick={() => deletePlanning(plan.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Planning;
