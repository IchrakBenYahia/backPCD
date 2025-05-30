const express = require('express');
const router = express.Router();
const {
  getAllPoubelles,
  addPoubelle,
  updatePoubelle,
  deletePoubelle,
  updatePleinePoubelle,
} = require('../services/poubelleService');

router.get('/', async (req, res) => {
  try {
    const data = await getAllPoubelles();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des poubelles' });
  }
});

router.post('/', async (req, res) => {
  try {
    await addPoubelle(req.body);
    res.status(201).json({ message: 'Poubelle ajoutée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await updatePoubelle(req.params.id, req.body);
    res.status(200).json({ message: 'Mise à jour réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deletePoubelle(req.params.id);
    res.status(200).json({ message: 'Suppression réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Route spéciale : Mise à jour du champ "pleine"
router.post('/update', async (req, res) => {
  const { id, pleine } = req.body;
  try {
    await updatePleinePoubelle(id,pleine);
    res.status(200).json({ message: 'Modification réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

module.exports = router;
