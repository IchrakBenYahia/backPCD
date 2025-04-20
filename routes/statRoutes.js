const express = require('express');
const router = express.Router();
const {
    getUserCount,
    getUserCountsByRoles,
    getTotalPoubelles,
    getPoubellesStatus
  } = require('../services/statService');

// Nombre total d'utilisateurs (hors admin)
router.get('/userCount', async (req, res) => {
  try {
    const count = await getUserCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nombre d'utilisateurs par rôle
router.get('/userCountsByRoles', async (req, res) => {
  try {
    const data = await getUserCountsByRoles();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nombre total de poubelles
router.get('/totalPoubelles', async (req, res) => {
  try {
    const total = await getTotalPoubelles();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statut des poubelles (pleines vs vides)
router.get('/poubellesStatus', async (req, res) => {
  try {
    const status = await getPoubellesStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
