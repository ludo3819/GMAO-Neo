const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./database');
const parcMachineRoutes = require('./routes/parcMachine');
const articleRoutes = require('./routes/article');
const interventionRoutes = require('./routes/intervention');
const planningRoutes = require('./routes/planning');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/parc-machine', parcMachineRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/intervention', interventionRoutes);
app.use('/api/planning', planningRoutes);

function startBackend() {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

module.exports = { startBackend };
