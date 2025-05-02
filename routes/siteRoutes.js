const express = require('express');
const router = express.Router();
const secteurService = require('../services/siteService');

// GET all secteurs
router.get('/secteurs', async (req, res) => {
  try {
    const secteurs = await secteurService.getSecteurs();
    res.json(secteurs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Recherche partielle
router.get('/secteurs/search', async (req, res) => {
  try {
    const { codeP, nom } = req.query;
    const results = await secteurService.searchSecteurPartial({
      codeP: codeP ? parseInt(codeP) : undefined,
      nom,
    });
    res.json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST ajouter un secteur
router.post('/secteurs', async (req, res) => {
  try {
    const { codeP, nbPoubelles, nom, chauffeurID} = req.body;
    await secteurService.addSecteur(codeP, nbPoubelles, nom, chauffeurID);
    res.status(201).send("Secteur ajouté");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT mise à jour
router.put('/secteurs/:id', async (req, res) => {
  try {
    const { codeP, nbPoubelles, nom, chauffeurID } = req.body;
    await secteurService.updateSecteur(req.params.id, codeP, nbPoubelles, nom, chauffeurID);
    res.send("Secteur mis à jour");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE
router.delete('/secteurs/:id', async (req, res) => {
  try {
    await secteurService.deleteSecteur(req.params.id);
    res.send("Secteur supprimé");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// récupérer un user par chauffeurID
router.get('/secteurs/chauffeur/:chauffeurID', async (req, res) => {
  try {
    const chauffeurID = req.params.chauffeurID;
    const chauffeur = await secteurService.getUserByChauffeurID(chauffeurID);
    res.json(chauffeur);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Récupérer la liste des utilisateurs
router.get('/secteurs/users/:role', async (req, res) => {
  try {
    const role = req.params.role;
    const users = await secteurService.getUsers(role);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer le secteur (site) affecté à un chauffeur donné
router.get('/secteurs/affectation/:chauffeurID', async (req, res) => {
  try {
    const chauffeurID = req.params.chauffeurID;
    const secteurs = await secteurService.getSecteursByChauffeurID(chauffeurID);

    if (!secteurs || secteurs.length === 0) {
      return res.status(404).json({ message: 'Aucun secteur trouvé pour ce chauffeur' });
    }

    res.json(secteurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
