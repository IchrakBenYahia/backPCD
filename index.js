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
const siteRoutes = require('./routes/siteRoutes');
const statRoutes = require('./routes/statRoutes');
const authRoutes = require('./routes/authRoutes');

// 🛣️ Utilisation des routes
app.use('/poubelles', poubelleRoutes); // ex: GET /poubelles, POST /poubelles
app.use('/api/poubelle', poubelleRoutes); // pour route spéciale
app.use('/users', userRoutes); // pour route spéciale
app.use('/api/user', userRoutes); // pour route spéciale
app.use('/sites', siteRoutes); // pour route spéciale
app.use('/api/site', siteRoutes); // pour route spéciale
app.use('/stats', statRoutes);
app.use('/api/stat', statRoutes);
app.use('/api/auth', authRoutes);

// 🚀 Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
