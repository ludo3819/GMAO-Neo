# GMAO Neo

**Gestion de Maintenance Assistée par Ordinateur** - Application Desktop locale

## 🎯 Fonctionnalités

- 📊 **Tableau de Bord** : Vue d'ensemble des statistiques
- 🏭 **Parc Machine** : Gestion complète du parc d'équipements
- 📦 **Articles/Pièces** : Gestion des pièces détachées avec QR codes
- 🔧 **Interventions** : Planification et suivi des maintenances
- 📅 **Planning** : Calendrier des interventions avec priorités

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/ludo3819/GMAO-Neo.git
cd GMAO-Neo

# Installer les dépendances
npm install

# Lancer l'application en développement
npm run dev
```

## 🎨 Design

- **Palette** : Cyan (#00d9ff) / Violet (#c400ff) / Noir (#0a0e27)
- **Style** : Néo-futuriste fluide et moderne
- **Animations** : Transitions smooth et effets de glow

## 📊 Architecture

- **Frontend** : React 18
- **Backend** : Express.js
- **Base de données** : SQLite3 (locale)
- **Desktop** : Electron

## 💾 Données

- **Base SQLite locale** : `~/.gmao-neo/database.db`
- **Backend** : http://localhost:5000
- **Frontend** : http://localhost:3000 (dev)

## 📝 License

MIT
