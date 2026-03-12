// Firebase Admin SDK initialization
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase
try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

// Export Firebase and models
module.exports = {
  admin,
  db: admin.firestore(),
  ...require('./models/models')
};
