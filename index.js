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

// 🌍 Middleware
app.use(cors());
app.use(bodyParser.json());

// 📦 Import des routes
const poubelleRoutes = require('./routes/poubelleRoutes');
const userRoutes = require('./routes/userRoutes');
const secteurRoutes = require('./routes/siteRoutes');
const statRoutes = require('./routes/statRoutes');
const alerteRoutes = require('./routes/alerteRoutes');
const authRoutes = require('./routes/authRoutes');
const itineraireRoutes = require('./routes/itineraireRoutes');

// 🛣️ Utilisation des routes
app.use('/poubelles', poubelleRoutes);
app.use('/api/poubelle', poubelleRoutes);
app.use('/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/secteurs', secteurRoutes);
app.use('/api/secteur', secteurRoutes);
app.use('/stats', statRoutes);
app.use('/api/stat', statRoutes);
app.use('/alertes', alerteRoutes);
app.use('/api/alerte', alerteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/itineraire', itineraireRoutes);
// 🚀 Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
