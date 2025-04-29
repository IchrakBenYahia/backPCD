
// itineraireService.js


// Fonction pour calculer la distance entre deux points (formule Haversine)
function distanceHaversine(point1, point2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);
  
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) *
        Math.cos(point2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  
  // Fonction 2-opt pour améliorer l'itinéraire
  function twoOpt(route) {
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 1; i < route.length - 2; i++) {
        for (let j = i + 1; j < route.length - 1; j++) {
          const A = route[i];
          const B = route[i + 1];
          const C = route[j];
          const D = route[j + 1];
  
  
          const distanceABCD = distanceHaversine(A, B) + distanceHaversine(C, D);
          const distanceACBD = distanceHaversine(A, C) + distanceHaversine(B, D);
  
  
          if (distanceACBD < distanceABCD) {
            // Inverser les noeuds entre i+1 et j
            route = [
              ...route.slice(0, i + 1),
              ...route.slice(i + 1, j + 1).reverse(),
              ...route.slice(j + 1),
            ];
            improved = true;
          }
        }
      }
    }
    return route;
  }
  
  
  // Fonction principale pour générer l'itinéraire optimal
  function genererItineraireOptimal(poubelles, pointDepart) {
    const pointsRestants = [...poubelles];
    const itineraire = [{ ...pointDepart, point: 'Départ' }];
    let pointActuel = pointDepart;
  
  
    // Approche gloutonne pour construire une première version rapide
    while (pointsRestants.length > 0) {
      let plusProcheIndex = 0;
      let distanceMin = distanceHaversine(pointActuel, pointsRestants[0]);
  
  
      for (let i = 1; i < pointsRestants.length; i++) {
        const distance = distanceHaversine(pointActuel, pointsRestants[i]);
        if (distance < distanceMin) {
          distanceMin = distance;
          plusProcheIndex = i;
        }
      }
  
  
      const prochainePoubelle = pointsRestants.splice(plusProcheIndex, 1)[0];
      itineraire.push(prochainePoubelle);
      pointActuel = prochainePoubelle;
    }
  
  
    // Retour au point de départ pour fermer le circuit
    itineraire.push({ ...pointDepart, point: 'Retour' });
  
  
    // Amélioration intelligente avec 2-opt
    return twoOpt(itineraire);
  }
  
  
  module.exports = { genererItineraireOptimal };
  
  
  