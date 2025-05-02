const express = require('express');
const { getPoubellesPleines } = require('../services/poubelleService');
const { genererItineraireOptimal } = require('../services/itineraireService');

const router = express.Router();

router.get('/itineraire-optimal', async (req, res) => {
  try {
    const { latitude, longitude, secteurs } = req.query;

    if (!latitude || !longitude || !secteurs) {
      return res.status(400).send('Latitude, longitude et secteurs sont requis');
    }

    const pointDepart = {
      id: 'start',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    // ✅ Convertir les secteurs en tableau (depuis query string)
    const secteursArray = secteurs.split(',').map(s => s.trim());

    // ✅ Récupérer toutes les poubelles correspondant à ces secteurs
    const poubellesPleines = await getPoubellesPleines(secteursArray);

    if (!poubellesPleines || poubellesPleines.length === 0) {
      return res.status(404).send('Aucune poubelle pleine trouvée');
    }

    const itineraire = genererItineraireOptimal(poubellesPleines, pointDepart);

    res.json(itineraire);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
