const admin = require('firebase-admin');
const db = admin.firestore();

// Récupérer la liste des secteurs
const getSecteurs = async () => {
  try {
    const snapshot = await db.collection('sites').get();
    const secteurs = snapshot.docs.map(doc => ({
      id: doc.id,
      codeP: doc.data().codeP,
      nbPoubelles: doc.data().nbPoubelles,
      nom: doc.data().nom,
      chauffeurID: doc.data().chauffeurID,
    }));
    return secteurs;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des secteurs: ${error.message}`);
  }
};

// Recherche partielle par codeP et nom
const searchSecteurPartial = async ({ codeP, nom }) => {
  try {
    let snapshot = await db.collection('sites').get();
    let secteurs = snapshot.docs.map(doc => ({
      id: doc.id,
      codeP: doc.data().codeP,
      nom: doc.data().nom,
      nbPoubelles: doc.data().nbPoubelles,
      chauffeurID: doc.data().chauffeurID,
    }));

    // Filtrage local
    if (codeP !== undefined && codeP !== null) {
      secteurs = secteurs.filter(secteur => secteur.codeP === codeP);
    }
    if (nom) {
      secteurs = secteurs.filter(secteur =>
        secteur.nom.toLowerCase().includes(nom.toLowerCase())
      );
    }

    // Exclure les noms admin si besoin
    return secteurs.filter(secteur => secteur.nom !== 'admin');
  } catch (error) {
    throw new Error(`Erreur lors de la recherche partielle : ${error.message}`);
  }
};

// Ajouter un secteur
const addSecteur = async (codeP, nbPoubelles, nom, chauffeurID) => {
  try {
    await db.collection('sites').add({
      codeP: codeP,
      nbPoubelles: nbPoubelles,
      nom: nom,
      chauffeurID: chauffeurID,
    });
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout du secteur: ${error.message}`);
  }
};

// Mettre à jour un secteur
const updateSecteur = async (id, codeP, nbPoubelles, nom, chauffeurID) => {
  try {
    await db.collection('sites').doc(id).update({
      codeP: codeP,
      nbPoubelles: nbPoubelles,
      nom: nom,
      chauffeurID: chauffeurID,
    });
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du secteur: ${error.message}`);
  }
};

// Supprimer un secteur
const deleteSecteur = async (id) => {
  try {
    await db.collection('sites').doc(id).delete();
  } catch (error) {
    throw new Error(`Erreur lors de la suppression du secteur: ${error.message}`);
  }
};

// Récupérer un utilisateur par chauffeurID
const getUserByChauffeurID = async (chauffeurID) => {
  try {
    const userDoc = await db.collection('users').doc(chauffeurID).get();
    if (!userDoc.exists) {
      throw new Error('Utilisateur non trouvé');
    }
    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
  }
};

const getUsers = async (role) => {
  try {
    const userDoc = await db.collection('users').where('role', '==', role).get();
    const users = userDoc.docs.map(doc => ({
      id: doc.id,
      cin: doc.data().cin,
      nom: doc.data().nom,
      prenom: doc.data().prenom,
      role: doc.data().role,
    }));
    return users;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
  }
};

const getSecteursByChauffeurID = async (chauffeurID) => {
  try {
    const snapshot = await db.collection('sites').where('chauffeurID', '==', chauffeurID).get();

    if (snapshot.empty) {
      return []; // Aucun secteur trouvé
    }

    // Retourner tous les secteurs trouvés
    return snapshot.docs.map(doc => ({
      id: doc.id,
      codeP: doc.data().codeP,
      nom: doc.data().nom,
      nbPoubelles: doc.data().nbPoubelles,
      chauffeurID: doc.data().chauffeurID,
    }));
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des secteurs: ${error.message}`);
  }
};



module.exports = { getSecteurs, searchSecteurPartial, addSecteur, updateSecteur, deleteSecteur, getUserByChauffeurID, getUsers,getSecteursByChauffeurID };