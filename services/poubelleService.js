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
  return await db.collection('poubelles').doc(id).delete();
};

module.exports = {
  getAllPoubelles,
  addPoubelle,
  updatePoubelle,
  deletePoubelle
};
