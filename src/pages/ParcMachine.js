import React, { useState, useEffect } from 'react';
import './ParcMachine.css';
import axios from 'axios';

function ParcMachine() {
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    marque: '',
    modele: '',
    numSerie: '',
    dateAcquisition: '',
    localisation: ''
  });

  useEffect(() => {
    fetchMachines();
  }, []);

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
      await axios.post('http://localhost:5000/api/parc-machine', formData);
      fetchMachines();
      setFormData({
        nom: '',
        type: '',
        marque: '',
        modele: '',
        numSerie: '',
        dateAcquisition: '',
        localisation: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating machine:', error);
    }
  };

  const deleteMachine = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/parc-machine/${id}`);
      fetchMachines();
    } catch (error) {
      console.error('Error deleting machine:', error);
    }
  };

  return (
    <div className="parc-machine">
      <div className="page-header">
        <h2>Parc Machine</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Ajouter Machine
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Marque"
            value={formData.marque}
            onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
          />
          <input
            type="text"
            placeholder="Modèle"
            value={formData.modele}
            onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
          />
          <input
            type="text"
            placeholder="Numéro de Série"
            value={formData.numSerie}
            onChange={(e) => setFormData({ ...formData, numSerie: e.target.value })}
          />
          <input
            type="date"
            value={formData.dateAcquisition}
            onChange={(e) => setFormData({ ...formData, dateAcquisition: e.target.value })}
          />
          <input
            type="text"
            placeholder="Localisation"
            value={formData.localisation}
            onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
          />
          <button type="submit" className="btn-primary">Créer</button>
        </form>
      )}

      <div className="machines-grid">
        {machines.map(machine => (
          <div key={machine.id} className="machine-card">
            <h3>{machine.nom}</h3>
            <p><strong>Type:</strong> {machine.type}</p>
            <p><strong>Marque:</strong> {machine.marque}</p>
            <p><strong>Modèle:</strong> {machine.modele}</p>
            <p><strong>Série:</strong> {machine.numSerie}</p>
            <p><strong>Localisation:</strong> {machine.localisation}</p>
            <button className="btn-danger" onClick={() => deleteMachine(machine.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParcMachine;
