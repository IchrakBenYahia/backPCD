const admin = require('firebase-admin');
const axios = require('axios');

// Firebase admin auth et firestore
const auth = admin.auth();
const db = admin.firestore();

// Créer un nouvel utilisateur
const registerUser = async (cin, password, role, nom, prenom) => {
  try {
    const email = `${cin}@cin.com`;

    const userRecord = await auth.createUser({
      email,
      password,
    });

    await db.collection('users').doc(userRecord.uid).set({
      cin,
      role,
      nom,
      prenom,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      uid: userRecord.uid,
      cin,
      role,
      nom,
      prenom,
    };
  } catch (error) {
    throw new Error(`Erreur de création: ${error.message}`);
  }
};


// Connexion utilisateur (via cin)
const loginUser = async (cin, password) => {
    try {
      const apiKey = process.env.FIREBASE_API_KEY;
      console.log('********');
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          email: `${cin}@cin.com`,
          password,
          returnSecureToken: true,
        }
      );      
  
      const uid = response.data.localId;
      console.log('********');
      console.log(uid);
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error("Utilisateur non trouvé");
      }
  
      const userData = userDoc.data();
      return {
        uid,
        role: userData.role,
        cin: userData.cin,
      };
    } catch (error) {
      throw new Error("Identifiants invalides");
    }
  };  

// Réinitialisation du mot de passe via Firebase Auth REST API
const resetPassword = async (email) => {
  const apiKey = process.env.FIREBASE_API_KEY; // stocke cette clé dans .env

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        requestType: 'PASSWORD_RESET',
        email,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Impossible d'envoyer l'email de réinitialisation");
  }
};

// Récupérer l'utilisateur courant via son token
const getCurrentUser = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userRecord = await auth.getUser(decodedToken.uid);

    return {
      uid: userRecord.uid,
      cin: userRecord.cin,
      cinVerified: userRecord.cinVerified
    };
  } catch (error) {
    throw new Error("Token invalide");
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getCurrentUser
};
