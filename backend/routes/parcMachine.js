const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { v4: uuidv4 } = require('uuid');

// GET all machines
router.get('/', (req, res) => {
  try {
    const machines = db.prepare('SELECT * FROM parc_machine ORDER BY createdAt DESC').all();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single machine
router.get('/:id', (req, res) => {
  try {
    const machine = db.prepare('SELECT * FROM parc_machine WHERE id = ?').get(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create machine
router.post('/', (req, res) => {
  try {
    const { nom, type, marque, modele, numSerie, dateAcquisition, localisation } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO parc_machine (id, nom, type, marque, modele, numSerie, dateAcquisition, localisation, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nom, type, marque, modele, numSerie, dateAcquisition, localisation, now, now);

    res.status(201).json({ id, nom, type, marque, modele, numSerie, dateAcquisition, localisation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update machine
router.put('/:id', (req, res) => {
  try {
    const { nom, type, marque, modele, numSerie, dateAcquisition, localisation, etat } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE parc_machine
      SET nom = ?, type = ?, marque = ?, modele = ?, numSerie = ?, dateAcquisition = ?, localisation = ?, etat = ?, updatedAt = ?
      WHERE id = ?
    `).run(nom, type, marque, modele, numSerie, dateAcquisition, localisation, etat, now, req.params.id);

    res.json({ message: 'Machine updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE machine
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM parc_machine WHERE id = ?').run(req.params.id);
    res.json({ message: 'Machine deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
