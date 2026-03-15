require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase (same as your main server)
try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  
  console.log('Firebase config check:', {
    projectId: !!projectId,
    clientEmail: !!clientEmail,
    databaseURL: !!databaseURL,
    privateKeyLength: privateKey ? privateKey.length : 0
  });
  
  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(`Missing Firebase credentials: ${!projectId ? 'projectId ' : ''}${!privateKey ? 'privateKey ' : ''}${!clientEmail ? 'clientEmail ' : ''}`);
  }
  
  let cleanPrivateKey = privateKey;
  
  // Remove surrounding quotes if present
  if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
    cleanPrivateKey = cleanPrivateKey.slice(1, -1);
  }
  
  // Replace escaped newlines with actual newlines
  cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
  
  // Ensure proper BEGIN and END lines
  if (!cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    cleanPrivateKey = '-----BEGIN PRIVATE KEY-----\n' + cleanPrivateKey;
  }
  if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----')) {
    cleanPrivateKey = cleanPrivateKey + '\n-----END PRIVATE KEY-----';
  }
  
  cleanPrivateKey = cleanPrivateKey.trim();
  
  console.log('Private key formatted, length:', cleanPrivateKey.length);
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId,
      privateKey: cleanPrivateKey,
      clientEmail: clientEmail
    }),
    databaseURL: databaseURL
  });
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  console.error('Environment variables check:');
  console.error('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
  console.error('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET');
  console.error('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET');
  console.error('FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL ? 'SET' : 'NOT SET');
}

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Import routes
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const studentRoutes = require('../routes/student');
const aiRoutes = require('../routes/ai');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Havenly API is running' });
});

// Debug endpoint to check environment variables
app.get('/debug-env', (req, res) => {
  res.json({
    projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET',
    databaseURL: process.env.FIREBASE_DATABASE_URL ? 'SET' : 'NOT SET',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    geminiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET'
  });
});

// Catch-all handler - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Export for Vercel
module.exports = app;
