const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { v4: uuidv4 } = require('uuid');

// GET all articles
router.get('/', (req, res) => {
  try {
    const articles = db.prepare('SELECT * FROM article ORDER BY createdAt DESC').all();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single article
router.get('/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM article WHERE id = ?').get(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create article
router.post('/', (req, res) => {
  try {
    const { nom, reference, machineId, quantite, prix, fournisseur } = req.body;
    const id = uuidv4();
    const qrCode = id;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO article (id, nom, qrCode, reference, machineId, quantite, prix, fournisseur, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nom, qrCode, reference, machineId, quantite, prix, fournisseur, now, now);

    res.status(201).json({ id, nom, reference, machineId, quantite, prix, fournisseur, qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update article
router.put('/:id', (req, res) => {
  try {
    const { nom, reference, machineId, quantite, prix, fournisseur } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE article
      SET nom = ?, reference = ?, machineId = ?, quantite = ?, prix = ?, fournisseur = ?, updatedAt = ?
      WHERE id = ?
    `).run(nom, reference, machineId, quantite, prix, fournisseur, now, req.params.id);

    res.json({ message: 'Article updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE article
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM article WHERE id = ?').run(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
