// Calcul de la distance Haversine entre deux points (latitude, longitude)
function distanceHaversine(point1, point2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const lat1 = point1.latitude * (Math.PI / 180); // Conversion en radians
    const lon1 = point1.longitude * (Math.PI / 180);
    const lat2 = point2.latitude * (Math.PI / 180);
    const lon2 = point2.longitude * (Math.PI / 180);
 
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
 
    const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance en kilomètres
    //console.log(distance);
    return distance;
  }
 
  module.exports = { distanceHaversine };
 
