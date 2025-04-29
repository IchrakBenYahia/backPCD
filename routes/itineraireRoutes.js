const express = require('express');
const { getPoubellesPleines } = require('../services/poubelleService');
const { genererItineraireOptimal } = require('../services/itineraireService');


const router = express.Router();


router.get('/itineraire-optimal', async (req, res) => {
  try {
    const { latitude, longitude } = req.query; // Récupère la position depuis Flutter
    if (!latitude || !longitude) {
      return res.status(400).send('Latitude et longitude requises');
    }


    const pointDepart = {
      id: 'start', // Identifier pour le point de départ
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };


    const poubellesPleines = await getPoubellesPleines(); // Récupère la liste des poubelles
    if (!poubellesPleines || poubellesPleines.length === 0) {
      return res.status(404).send('Aucune poubelle pleine trouvée');
    }


    const itineraire = genererItineraireOptimal(poubellesPleines, pointDepart); // Génère l'itinéraire optimal
    //console.log("tttttt",itineraire);


    res.json(itineraire); // Envoie l'itinéraire au frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});


module.exports = router;



