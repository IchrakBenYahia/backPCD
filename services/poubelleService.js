const admin = require('firebase-admin');
const db = admin.firestore();

const getAllPoubelles = async () => {
  const snapshot = await db.collection('poubelles').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const addPoubelle = async (data) => {
  return await db.collection('poubelles').add({
    ...data,
    pleine: false
  });
};

const updatePoubelle = async (id, data) => {
  return await db.collection('poubelles').doc(id).update(data);
};

const deletePoubelle = async (id) => {
  try {
    // Supprimer la poubelle
    await db.collection('poubelles').doc(id).delete();

    // Trouver toutes les alertes liées à cette poubelle
    const alertesSnapshot = await db.collection('alertes')
      .where('poubelle', '==', id)
      .get();

    // Supprimer toutes les alertes associées
    const deletePromises = alertesSnapshot.docs.map(doc => 
      db.collection('alertes').doc(doc.id).delete()
    );

    await Promise.all(deletePromises);

  } catch (error) {
    console.error('Erreur lors de la suppression de la poubelle et de ses alertes:', error);
  }
};

const updatePleinePoubelle = async (id, pleine) => {

  if (!id || typeof pleine !== 'boolean') {
    return console.error('ID ou pleine invalide');
  }

  try {
    const updateData = {
      pleine,
      dateDePleine: pleine ? new Date() : null,
    };

    await db.collection('poubelles').doc(id).update(updateData);
    //console.log(`Poubelle ${id} mise à jour: pleine = ${pleine}`);

    // Si la poubelle devient vide, vérifier les alertes
    if (!pleine) {
      const alertesSnapshot = await db.collection('alertes')
        .where('poubelle', '==', id)
        .where('traitee', '==', false)
        .get();

      if (!alertesSnapshot.empty) {
        const updatePromises = alertesSnapshot.docs.map((alerteDoc) =>
          db.collection('alertes').doc(alerteDoc.id).update({ traitee: true })
        );
        await Promise.all(updatePromises);
        //console.log(`Alertes traitées pour la poubelle ${id}`);
      }
    }

    console.error('Mise à jour réussie');
  } catch (error) {
    console.error('Erreur Firestore :', error);
  }
  
};

async function getPoubellesPleines() {
  const snapshot = await db.collection('poubelles').where('pleine', '==', true).get();
 
  if (snapshot.empty) {
    return [];
  }


  const poubelles = [];
  snapshot.forEach(doc => {
    poubelles.push({
      id: doc.id,
      adresse: doc.data().adresse,
      longitude: doc.data().longitude,
      latitude: doc.data().latitude,
    });
  });


  return poubelles;
}


module.exports = {
  getAllPoubelles,
  addPoubelle,
  updatePoubelle,
  deletePoubelle,
  updatePleinePoubelle,
  getPoubellesPleines,
};
