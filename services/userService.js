const admin = require('firebase-admin');
const db = admin.firestore();

// Récupérer la liste des utilisateurs
const getUsers = async () => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      cin: doc.data().cin,
      nom: doc.data().nom,
      prenom: doc.data().prenom,
      role: doc.data().role,
    }));
    // Filtrage des administrateurs dans le code
    const filteredUsers = users.filter(user => user.role !== 'admin');
    return filteredUsers;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
  }
};

// Recherche partielle par cin et rôle
const searchUsersPartial = async ({ prenom, role }) => {
  try {
    let query = db.collection('users');
    if (prenom) {
      query = query
        .orderBy('prenom')
        .startAt(prenom)
        .endAt(`${prenom}\uf8ff`);
    }

    const snapshot = await query.get();
    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      cin: doc.data().cin,
      nom: doc.data().nom,
      prenom: doc.data().prenom,
      role: doc.data().role,
    }));

    if (role) {
      users = users.filter(user => user.role.toLowerCase().includes(role.toLowerCase()));
    }

    // Filtrer les administrateurs
    return users.filter(user => user.role !== 'admin');
  } catch (error) {
    throw new Error(`Erreur lors de la recherche partielle : ${error.message}`);
  }
};

// Ajouter un utilisateur
const addUser = async (cin, role, nom, prenom, password) => {
  try {
    await db.collection('users').add({
      cin: cin,
      nom: nom,
      prenom: prenom,
      role: role,
      password: password,
    });
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'utilisateur: ${error.message}`);
  }
};

// Mettre à jour un utilisateur
const updateUser = async (id, cin, role, nom, prenom) => {
  try {
    await db.collection('users').doc(id).update({
      cin: cin,
      nom: nom,
      prenom: prenom,
      role: role,
    });
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
  }
};

// Supprimer un utilisateur
const deleteUser = async (id) => {
  try {
    await db.collection('users').doc(id).delete();
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
  }
};

// Récupérer la liste des chauffeurs affectés
const getChauffeurAffected = async () => {
  try {
    const snapshot = await db.collection('sites').get();
    const secteurs = snapshot.docs.map(doc => ({
      id: doc.id,
      chauffeurID: doc.data().chauffeurID,
      //nom: doc.data().nom,
      //codeP: doc.data().codeP,
      //nbPoubelles: doc.data().nbPoubelles,
    }));

    return secteurs;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
  }
};

module.exports = { getUsers, searchUsersPartial, addUser, updateUser, deleteUser, getChauffeurAffected };
