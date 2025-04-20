const express = require('express');
const router = express.Router();
const { getUsers, searchUsersPartial, addUser, updateUser, deleteUser } = require('../services/userService');

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
  const { email, role } = req.query;
  try {
    const users = await searchUsersPartial({ email, role });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un utilisateur
router.post('/users', async (req, res) => {
  const { email, role } = req.body;
  try {
    await addUser(email, role);
    res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  try {
    await updateUser(id, email, role);
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

module.exports = router;
