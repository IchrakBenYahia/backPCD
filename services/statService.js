// services/statService.js
const admin = require('firebase-admin');
const db = admin.firestore();

// ➤ Nombre total d'utilisateurs (hors admin)
const getUserCount = async () => {
  try {
    const snapshot = await db.collection('users')
                             .where('role', '!=', 'admin')
                             .get();
    return snapshot.size;
  } catch (e) {
    throw new Error(`Erreur lors de la récupération des utilisateurs : ${e.message}`);
  }
};

// ➤ Nombre d'utilisateurs par rôle (hors admin)
const getUserCountsByRoles = async () => {
  try {
    const snapshot = await db.collection('users')
                             .where('role', '!=', 'admin')
                             .get();

    const roleCounts = {};
    snapshot.forEach(doc => {
      const role = doc.data().role || 'inconnu';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    return roleCounts;
  } catch (e) {
    throw new Error(`Erreur lors de la récupération des utilisateurs par rôle : ${e.message}`);
  }
};

// ➤ Total des poubelles dans tous les sites
const getTotalPoubelles = async () => {
  try {
    const snapshot = await db.collection('sites').get();
    let total = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      total += data.nbPoubelles || 0;
    });

    return total;
  } catch (e) {
    throw new Error(`Erreur lors de la récupération du total des poubelles : ${e.message}`);
  }
};

// ➤ Statut des poubelles (pleines vs vides)
const getPoubellesStatus = async () => {
  try {
    const snapshot = await db.collection('poubelles').get();
    let plein = 0;
    let vide = 0;

    snapshot.forEach(doc => {
      const isPleine = doc.data().pleine || false;
      if (isPleine) plein++;
      else vide++;
    });

    return { plein, vide };
  } catch (e) {
    throw new Error(`Erreur lors de la récupération du statut des poubelles : ${e.message}`);
  }
};

module.exports = {
  getUserCount,
  getUserCountsByRoles,
  getTotalPoubelles,
  getPoubellesStatus,
};
