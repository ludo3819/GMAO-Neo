const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { v4: uuidv4 } = require('uuid');

// GET all planning
router.get('/', (req, res) => {
  try {
    const planning = db.prepare('SELECT * FROM planning ORDER BY dateDebut DESC').all();
    res.json(planning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET planning by date range
router.get('/range/:startDate/:endDate', (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const planning = db.prepare(`
      SELECT * FROM planning
      WHERE dateDebut >= ? AND dateDebut <= ?
      ORDER BY dateDebut ASC
    `).all(startDate, endDate);
    res.json(planning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create planning
router.post('/', (req, res) => {
  try {
    const { interventionId, machineId, dateDebut, dateFin, priorite, technicien } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO planning (id, interventionId, machineId, dateDebut, dateFin, priorite, technicien, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, interventionId, machineId, dateDebut, dateFin, priorite, technicien, now, now);

    res.status(201).json({ id, interventionId, machineId, dateDebut, dateFin, priorite, technicien });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update planning
router.put('/:id', (req, res) => {
  try {
    const { interventionId, machineId, dateDebut, dateFin, statut, priorite, technicien } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE planning
      SET interventionId = ?, machineId = ?, dateDebut = ?, dateFin = ?, statut = ?, priorite = ?, technicien = ?, updatedAt = ?
      WHERE id = ?
    `).run(interventionId, machineId, dateDebut, dateFin, statut, priorite, technicien, now, req.params.id);

    res.json({ message: 'Planning updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE planning
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM planning WHERE id = ?').run(req.params.id);
    res.json({ message: 'Planning deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
