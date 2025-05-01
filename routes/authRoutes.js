const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  resetPassword,
  getCurrentUser
} = require('../services/authService');

// Enregistrement
router.post('/register', async (req, res) => {
  const { cin, password, role, nom, prenom } = req.body;
  try {
    const result = await registerUser(cin, password, role, nom, prenom);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { cin, password } = req.body;
  try {
    const result = await loginUser(cin, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    await resetPassword(email);
    res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    // Ici, tu n'as pas besoin de vérifier le token côté serveur,
    // puisque la déconnexion côté serveur n'invalide pas le token.
    
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Infos utilisateur courant (via token envoyé dans l'en-tête Authorization)
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const userInfo = await getCurrentUser(idToken);
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
