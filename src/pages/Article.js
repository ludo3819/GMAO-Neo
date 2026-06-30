import React, { useState, useEffect } from 'react';
import './Article.css';
import axios from 'axios';
import QRCode from 'react-qr-code';

function Article() {
  const [articles, setArticles] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    machineId: '',
    quantite: 1,
    prix: 0,
    fournisseur: ''
  });

  useEffect(() => {
    fetchArticles();
    fetchMachines();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/article');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
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
      await axios.post('http://localhost:5000/api/article', formData);
      fetchArticles();
      setFormData({
        nom: '',
        reference: '',
        machineId: '',
        quantite: 1,
        prix: 0,
        fournisseur: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/article/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="article">
      <div className="page-header">
        <h2>Articles & Pièces</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Ajouter Article
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
            placeholder="Référence"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />
          <select
            value={formData.machineId}
            onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
          >
            <option value="">Sélectionner Machine</option>
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantité"
            value={formData.quantite}
            onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Prix"
            value={formData.prix}
            onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Fournisseur"
            value={formData.fournisseur}
            onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
          />
          <button type="submit" className="btn-primary">Créer</button>
        </form>
      )}

      {selectedQR && (
        <div className="qr-modal">
          <div className="qr-content">
            <button className="btn-close" onClick={() => setSelectedQR(null)}>✕</button>
            <h3>QR Code Article</h3>
            <QRCode value={selectedQR} size={256} />
            <p>{selectedQR}</p>
          </div>
        </div>
      )}

      <div className="articles-grid">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <div className="qr-mini">
              <QRCode value={article.qrCode} size={80} />
            </div>
            <h3>{article.nom}</h3>
            <p><strong>Référence:</strong> {article.reference}</p>
            <p><strong>Quantité:</strong> {article.quantite}</p>
            <p><strong>Prix:</strong> {article.prix}€</p>
            <p><strong>Fournisseur:</strong> {article.fournisseur}</p>
            <div className="card-actions">
              <button className="btn-qr" onClick={() => setSelectedQR(article.qrCode)}>Voir QR</button>
              <button className="btn-danger" onClick={() => deleteArticle(article.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Article;
