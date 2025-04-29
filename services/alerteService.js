const admin = require('firebase-admin');
const db = admin.firestore();

const getAllAlertes = async () => {
    const snapshot = await db.collection('alertes').get();
    
    // Récupérer les données et trier par 'traitee' (false en premier)
    const alertes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    // Trier les alertes : non traitées d'abord
    alertes.sort((a, b) => {
      if (a.traitee === b.traitee) return 0; // Si elles ont la même valeur, on les laisse dans l'ordre actuel
      return a.traitee ? 1 : -1; // false (non traitée) passe en premier
    });
  
    return alertes;
  };
  

const addAlerte = async (data) => {
  return await db.collection('alertes').add({
    ...data,
    traitee: false
  });
};

const updateAlerte = async (id, data) => {
  return await db.collection('alertes').doc(id).update(data);
};

const deleteAlerte = async (id) => {
  return await db.collection('alertes').doc(id).delete();
};

// 👉 NOUVELLE FONCTION : Générer alertes pour poubelles pleines depuis 24h
const generateAlertesForPoubelles = async () => {
    const now = new Date();
    const snapshot = await db.collection('poubelles').where('pleine', '==', true).get();
  
    const alertPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
  
      if (!data.dateDePleine) return; // Sécurité
      const dateDePleine = data.dateDePleine.toDate ? data.dateDePleine.toDate() : new Date(data.dateDePleine);
  
      const elapsedHours = (now - dateDePleine) / (1000 * 60 * 60);
  
      if (elapsedHours >= 24) {
        // On vérifie si une alerte NON TRAITÉE existe déjà
        const existingAlertsSnapshot = await db.collection('alertes')
          .where('poubelle', '==', doc.id)
          .where('traitee', '==', false)
          .get();
  
        if (existingAlertsSnapshot.empty) {
          // Créer une nouvelle alerte
          await db.collection('alertes').add({
            designation: `La poubelle de l'adresse "${data.adresse}" est pleine depuis 24 heures.`,
            poubelle: doc.id,
            titre: 'Poubelle pleine',
            traitee: false, // Non traitée au moment de la création
            date: now,
          });
  
          console.log(`✅ Alerte créée pour la poubelle ${doc.id}`);
        } else {
          console.log(`⚠️ Alerte non traitée déjà existante pour la poubelle ${doc.id}`);
        }
      }
    });
  
    await Promise.all(alertPromises);
  
    // Ensuite, on gère la résolution : si une poubelle n'est plus pleine,
    // on marque ses alertes comme traitées
    const emptiedSnapshot = await db.collection('poubelles').where('pleine', '==', false).get();
  
    const resolvePromises = emptiedSnapshot.docs.map(async (doc) => {
      const data = doc.data();
  
      // Cherche toutes les alertes NON traitées liées à cette poubelle
      const alertsToResolve = await db.collection('alertes')
        .where('poubelle', '==', doc.id)
        .where('traitee', '==', false)
        .get();
  
      const updatePromises = alertsToResolve.docs.map(async (alertDoc) => {
        await db.collection('alertes').doc(alertDoc.id).update({
          traitee: true,
          dateTraitee: now, // Optionnel : ajouter une date de traitement
        });
        console.log(`✅ Alerte ${alertDoc.id} marquée comme traitée pour poubelle ${doc.id}`);
      });
  
      await Promise.all(updatePromises);
    });
  
    await Promise.all(resolvePromises);
  };
  

module.exports = {
    getAllAlertes,
    addAlerte,
    updateAlerte,
    deleteAlerte,
    generateAlertesForPoubelles // ⚡ NE PAS OUBLIER d'exporter
};
