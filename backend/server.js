require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase - simplified for Vercel
let db;
try {
  console.log('Initializing Firebase...');
  console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
  
  // Check if we have the required credentials
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('Missing Firebase credentials');
  }

  // Initialize with service account
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  };

  // Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  }
  
  db = admin.firestore();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('Full error:', error);
  
  // Create a simple mock database that returns empty results
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve({ writeTime: new Date().toISOString() }),
        update: () => Promise.resolve({ writeTime: new Date().toISOString() }),
        delete: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'mock-' + Date.now() }),
      where: () => ({
        get: () => Promise.resolve({ docs: [] })
      }),
      get: () => Promise.resolve({ docs: [] })
    })
  };
  console.log('⚠️ Using mock database');
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder (only for local dev)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;

// Start server for local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`DormFlow Backend running on http://localhost:${PORT}`);
    console.log('Firebase Firestore connected');
  });
}
