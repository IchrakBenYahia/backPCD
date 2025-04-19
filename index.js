const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

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

// 🛣️ Utilisation des routes
app.use('/poubelles', poubelleRoutes); // ex: GET /poubelles, POST /poubelles
app.use('/api/poubelle', poubelleRoutes); // pour route spéciale

// 🚀 Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
