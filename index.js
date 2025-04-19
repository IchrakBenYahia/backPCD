const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

// 🔧 Change le port si nécessaire
const port = 3000;

// 🔐 Remplace ceci avec le chemin vers ta clé privée téléchargée
const serviceAccount = require('./config/serviceAccountKey.json');

// 🔥 Initialisation Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🌍 Active CORS pour permettre l'accès externe
app.use(cors());
app.use(bodyParser.json());

// ✅ Route d'update
app.post('/api/poubelle/update', async (req, res) => {
  console.log('Requête reçue:', req.body);
  const { id, pleine } = req.body;

  try {
    await db.collection('poubelles').doc(id).update({ pleine });
    res.status(200).send('Mise à jour réussie');
  } catch (error) {
    console.error('Erreur Firestore :', error);
    res.status(500).send('Erreur lors de la mise à jour');
  }
});

// 📡 Écoute sur toutes les interfaces (important !)
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
