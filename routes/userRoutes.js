const express = require('express');
const router = express.Router();
const { getUsers, searchUsersPartial, addUser, updateUser, deleteUser, getChauffeurAffected } = require('../services/userService');

// Récupérer la liste des utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Recherche partielle des utilisateurs
router.get('/users/search', async (req, res) => {
  const { prenom, role } = req.query;
  try {
    const users = await searchUsersPartial({ prenom, role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un utilisateur
router.post('/users', async (req, res) => {
  const { cin, role, nom, prenom, password } = req.body;
  try {
    console.log("testttttttttttt");
    console.log(cin);
    console.log( role);
    console.log(nom);
    console.log(prenom, );
    console.log(password);
    await addUser(cin, role, nom, prenom, password);
    res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { cin, role, nom, prenom } = req.body;
  try {
    await updateUser(id, cin, role, nom, prenom);
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer la liste des utilisateurs
router.get('/usersAffected', async (req, res) => {
  try {
    const users = await getChauffeurAffected();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
