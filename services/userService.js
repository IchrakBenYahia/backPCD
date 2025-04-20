const admin = require('firebase-admin');
const db = admin.firestore();

// Récupérer la liste des utilisateurs
const getUsers = async () => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      role: doc.data().role,
    }));
    // Filtrage des administrateurs dans le code
    const filteredUsers = users.filter(user => user.role !== 'admin');
    return filteredUsers;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
  }
};

// Recherche partielle par email et rôle
const searchUsersPartial = async ({ email, role }) => {
  try {
    let query = db.collection('users');
    if (email) {
      query = query
        .orderBy('email')
        .startAt(email)
        .endAt(`${email}\uf8ff`);
    }

    const snapshot = await query.get();
    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
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
const addUser = async (email, role) => {
  try {
    await db.collection('users').add({
      email: email,
      role: role,
    });
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'utilisateur: ${error.message}`);
  }
};

// Mettre à jour un utilisateur
const updateUser = async (id, email, role) => {
  try {
    await db.collection('users').doc(id).update({
      email: email,
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

module.exports = { getUsers, searchUsersPartial, addUser, updateUser, deleteUser };
