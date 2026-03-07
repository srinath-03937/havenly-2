import admin from 'firebase-admin';

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

// Collections
export const USERS_COLLECTION = 'users';
export const ROOMS_COLLECTION = 'rooms';
export const COMPLAINTS_COLLECTION = 'complaints';
export const TRANSACTIONS_COLLECTION = 'transactions';
export const NOTICES_COLLECTION = 'notices';
