const admin = require('firebase-admin');
const db = admin.firestore();

// Récupérer la liste des sites
const getSites = async () => {
  try {
    const snapshot = await db.collection('sites').get();
    const sites = snapshot.docs.map(doc => ({
      id: doc.id,
      codeP: doc.data().codeP,
      nbPoubelles: doc.data().nbPoubelles,
      nom: doc.data().nom,
    }));
    return sites;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des sites: ${error.message}`);
  }
};

// Recherche partielle par codeP et nom
const searchSitePartial = async ({ codeP, nom }) => {
  try {
    let snapshot = await db.collection('sites').get();
    let sites = snapshot.docs.map(doc => ({
      id: doc.id,
      codeP: doc.data().codeP,
      nom: doc.data().nom,
      nbPoubelles: doc.data().nbPoubelles,
    }));

    // Filtrage local
    if (codeP !== undefined && codeP !== null) {
      sites = sites.filter(site => site.codeP === codeP);
    }
    if (nom) {
      sites = sites.filter(site =>
        site.nom.toLowerCase().includes(nom.toLowerCase())
      );
    }

    // Exclure les noms admin si besoin
    return sites.filter(site => site.nom !== 'admin');
  } catch (error) {
    throw new Error(`Erreur lors de la recherche partielle : ${error.message}`);
  }
};

// Ajouter un site
const addSite = async (codeP, nbPoubelles, nom) => {
  try {
    await db.collection('sites').add({
      codeP: codeP,
      nbPoubelles: nbPoubelles,
      nom: nom,
    });
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout du site: ${error.message}`);
  }
};

// Mettre à jour un site
const updateSite = async (id, codeP, nbPoubelles, nom) => {
  try {
    await db.collection('sites').doc(id).update({
      codeP: codeP,
      nbPoubelles: nbPoubelles,
      nom: nom,
    });
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du site: ${error.message}`);
  }
};

// Supprimer un site
const deleteSite = async (id) => {
  try {
    await db.collection('sites').doc(id).delete();
  } catch (error) {
    throw new Error(`Erreur lors de la suppression du site: ${error.message}`);
  }
};

module.exports = { getSites, searchSitePartial, addSite, updateSite, deleteSite };
