const express = require('express');
const router = express.Router();
const {
    getAllAlertes,
    addAlerte,
    updateAlerte,
    deleteAlerte,
    generateAlertesForPoubelles // 👉 on ajoute ici
} = require('../services/alerteService');

router.get('/', async (req, res) => {
  try {
    const data = await getAllAlertes();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

router.post('/', async (req, res) => {
  try {
    await addAlerte(req.body);
    res.status(201).json({ message: 'Alerte ajoutée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await updateAlerte(req.params.id, req.body);
    res.status(200).json({ message: 'Mise à jour réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteAlerte(req.params.id);
    res.status(200).json({ message: 'Suppression réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// 🚀 NOUVELLE ROUTE pour générer les alertes automatiquement
router.post('/generate', async (req, res) => {
  try {
    await generateAlertesForPoubelles();
    res.status(200).json({ message: 'Alertes générées avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération des alertes' });
  }
});

module.exports = router;
