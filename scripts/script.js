const serviceAccount = require('./serviceAccountKey.json');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// db.collection('boards').get().then(querySnap => {
//   querySnap.forEach(queryDocSnap => {
//     queryDocSnap.ref.set({ public: true }, { merge: true });
//   });
// });
