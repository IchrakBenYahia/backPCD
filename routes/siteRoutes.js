const express = require('express');
const router = express.Router();
const siteService = require('../services/siteService');

// GET all sites
router.get('/sites', async (req, res) => {
  try {
    const sites = await siteService.getSites();
    res.json(sites);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Recherche partielle
router.get('/sites/search', async (req, res) => {
  try {
    const { codeP, nom } = req.query;
    const results = await siteService.searchSitePartial({
      codeP: codeP ? parseInt(codeP) : undefined,
      nom,
    });
    res.json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST ajouter un site
router.post('/sites', async (req, res) => {
  try {
    const { codeP, nbPoubelles, nom, chauffeurID} = req.body;
    await siteService.addSite(codeP, nbPoubelles, nom, chauffeurID);
    res.status(201).send("Site ajouté");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT mise à jour
router.put('/sites/:id', async (req, res) => {
  try {
    const { codeP, nbPoubelles, nom, chauffeurID } = req.body;
    await siteService.updateSite(req.params.id, codeP, nbPoubelles, nom, chauffeurID);
    res.send("Site mis à jour");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE
router.delete('/sites/:id', async (req, res) => {
  try {
    await siteService.deleteSite(req.params.id);
    res.send("Site supprimé");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// récupérer un user par chauffeurID
router.get('/sites/chauffeur/:chauffeurID', async (req, res) => {
  try {
    const chauffeurID = req.params.chauffeurID;
    const chauffeur = await siteService.getUserByChauffeurID(chauffeurID);
    res.json(chauffeur);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Récupérer la liste des utilisateurs
router.get('/sites/users/:role', async (req, res) => {
  try {
    const role = req.params.role;
    const users = await siteService.getUsers(role);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
