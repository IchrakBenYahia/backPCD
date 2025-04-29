const axios = require('axios');
const fs = require('fs');

// Charger les poubelles depuis poubelles.json
const poubelles = JSON.parse(fs.readFileSync('poubelles.json', 'utf8'));

const emulatePoubelleFilling = async () => {
  try {
    for (const poubelle of poubelles) {
      const id = poubelle.id; // On récupère l'id (ATTENTION : il faut qu'il existe dans ton fichier JSON !!)

      // Simulation : 20% de chance qu'une poubelle devienne pleine
      const pleine = Math.random() < 0.2;

      if (id) {
        await axios.post('http://localhost:3000/poubelles/update', { id, pleine });
        console.log(`Envoyé pour la poubelle ${id}: pleine = ${pleine}`);
      } else {
        console.warn('ID manquant pour une poubelle dans poubelles.json');
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'émulation:', error.message);
  }
};

// Démarrage de l'émulateur toutes les 30 sec
//setInterval(emulatePoubelleFilling, 30000);
// Démarrage de l'émulateur toutes les 2 minutes
//setInterval(emulatePoubelleFilling, 120000);
// Démarrage de l'émulateur toutes les 1 heure
setInterval(emulatePoubelleFilling, 3600000);
console.log('Émulateur de remplissage des poubelles lancé...');
