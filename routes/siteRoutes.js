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
    const { codeP, nbPoubelles, nom } = req.body;
    await siteService.addSite(codeP, nbPoubelles, nom);
    res.status(201).send("Site ajouté");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT mise à jour
router.put('/sites/:id', async (req, res) => {
  try {
    const { codeP, nbPoubelles, nom } = req.body;
    await siteService.updateSite(req.params.id, codeP, nbPoubelles, nom);
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

module.exports = router;
