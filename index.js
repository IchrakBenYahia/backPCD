const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.FIREBASE_API_KEY;

// 🔐 Initialisation Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ✨ Maintenant SEULEMENT on peut démarrer l'émulateur
require('./emulateur');

// 🌍 Middleware
app.use(cors());
app.use(bodyParser.json());

// 📦 Import des routes
const poubelleRoutes = require('./routes/poubelleRoutes');
const userRoutes = require('./routes/userRoutes');
const siteRoutes = require('./routes/siteRoutes');
const statRoutes = require('./routes/statRoutes');
const alerteRoutes = require('./routes/alerteRoutes');
const authRoutes = require('./routes/authRoutes');

// 🛣️ Utilisation des routes
app.use('/poubelles', poubelleRoutes);
app.use('/api/poubelle', poubelleRoutes);
app.use('/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/sites', siteRoutes);
app.use('/api/site', siteRoutes);
app.use('/stats', statRoutes);
app.use('/api/stat', statRoutes);
app.use('/alertes', alerteRoutes);
app.use('/api/alerte', alerteRoutes);
app.use('/api/auth', authRoutes);

// 🚀 Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
