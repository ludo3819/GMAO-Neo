const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { v4: uuidv4 } = require('uuid');

// GET all interventions
router.get('/', (req, res) => {
  try {
    const interventions = db.prepare('SELECT * FROM intervention ORDER BY datePlanifiee DESC').all();
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single intervention
router.get('/:id', (req, res) => {
  try {
    const intervention = db.prepare('SELECT * FROM intervention WHERE id = ?').get(req.params.id);
    if (!intervention) return res.status(404).json({ error: 'Intervention not found' });
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create intervention
router.post('/', (req, res) => {
  try {
    const { titre, description, machineId, type, datePlanifiee, technicien, articles, observations } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO intervention (id, titre, description, machineId, type, datePlanifiee, technicien, articles, observations, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titre, description, machineId, type, datePlanifiee, technicien, JSON.stringify(articles || []), observations, now, now);

    res.status(201).json({ id, titre, description, machineId, type, datePlanifiee, technicien, articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update intervention
router.put('/:id', (req, res) => {
  try {
    const { titre, description, machineId, type, statut, datePlanifiee, dateRealisation, duree, technicien, articles, observations } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE intervention
      SET titre = ?, description = ?, machineId = ?, type = ?, statut = ?, datePlanifiee = ?, dateRealisation = ?, duree = ?, technicien = ?, articles = ?, observations = ?, updatedAt = ?
      WHERE id = ?
    `).run(titre, description, machineId, type, statut, datePlanifiee, dateRealisation, duree, technicien, JSON.stringify(articles || []), observations, now, req.params.id);

    res.json({ message: 'Intervention updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE intervention
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM intervention WHERE id = ?').run(req.params.id);
    res.json({ message: 'Intervention deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
