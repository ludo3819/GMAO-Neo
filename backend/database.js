const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const os = require('os');

const dbDir = path.join(os.homedir(), '.gmao-neo');
const dbPath = path.join(dbDir, 'database.db');

// Create directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDatabase() {
  // Parc Machine Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parc_machine (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      type TEXT NOT NULL,
      marque TEXT,
      modele TEXT,
      numSerie TEXT UNIQUE,
      dateAcquisition TEXT,
      localisation TEXT,
      etat TEXT DEFAULT 'Actif',
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  // Article Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS article (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      qrCode TEXT UNIQUE,
      reference TEXT,
      machineId TEXT,
      quantite INTEGER DEFAULT 1,
      prix REAL,
      fournisseur TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(machineId) REFERENCES parc_machine(id)
    )
  `);

  // Intervention Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS intervention (
      id TEXT PRIMARY KEY,
      titre TEXT NOT NULL,
      description TEXT,
      machineId TEXT NOT NULL,
      type TEXT NOT NULL,
      statut TEXT DEFAULT 'Planifiée',
      datePlanifiee TEXT,
      dateRealisation TEXT,
      duree INTEGER,
      technicien TEXT,
      articles TEXT,
      observations TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(machineId) REFERENCES parc_machine(id)
    )
  `);

  // Planning Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS planning (
      id TEXT PRIMARY KEY,
      interventionId TEXT NOT NULL,
      machineId TEXT NOT NULL,
      dateDebut TEXT NOT NULL,
      dateFin TEXT,
      statut TEXT DEFAULT 'À faire',
      priorite TEXT DEFAULT 'Normal',
      technicien TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(interventionId) REFERENCES intervention(id),
      FOREIGN KEY(machineId) REFERENCES parc_machine(id)
    )
  `);

  console.log('Database initialized successfully at:', dbPath);
}

module.exports = { db, initDatabase };
