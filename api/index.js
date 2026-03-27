require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// Import serverless-http for Vercel compatibility
const serverless = require('serverless-http');

// Initialize Firebase
try {
  // Use environment variables directly
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  
  // Only initialize Firebase if all credentials are available
  if (projectId && privateKey && clientEmail && databaseURL) {
    // Clean up the private key
    let cleanPrivateKey = privateKey;
    
    // Remove surrounding quotes if present
    if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
      cleanPrivateKey = cleanPrivateKey.slice(1, -1);
    }
    
    // Replace \n with actual newlines
    cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
    
    // Ensure proper BEGIN and END lines
    if (!cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      cleanPrivateKey = '-----BEGIN PRIVATE KEY-----\n' + cleanPrivateKey;
    }
    if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----')) {
      cleanPrivateKey = cleanPrivateKey + '\n-----END PRIVATE KEY-----';
    }
    
    cleanPrivateKey = cleanPrivateKey.trim();
    
    console.log('Initializing Firebase with project:', projectId);
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        privateKey: cleanPrivateKey,
        clientEmail: clientEmail
      }),
      databaseURL: databaseURL
    });
    
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase credentials not found in environment variables - skipping Firebase initialization');
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  // Don't exit process, just log the error for Vercel compatibility
}

// Initialize Firestore only if Firebase is initialized
let db;
try {
  db = admin.firestore();
  console.log('Firebase Firestore connected');
} catch (error) {
  console.warn('Firestore not available - using mock database');
  db = null;
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

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const aiRoutes = require('./routes/ai');

// API Routes
// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'DormFlow Backend is running' });
});

// Frontend routing - serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Body parser error handler (catch invalid JSON payloads)
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('Invalid JSON payload:', err.message);
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  next(err);
});

// Firebase connection established
console.log('Firebase Firestore connected');

// Ensure demo accounts exist for easier testing
try {
  const { User } = require('./models');
  (async () => {
    try {
      // Super Admin - only one account
      const superAdminEmail = 'gajula@gmail.com';
      const studentEmail = 'student-test@havenly.com';

      const superAdmin = await User.findByEmail(superAdminEmail);
      if (!superAdmin) {
        await User.create({ 
          name: 'Super Admin', 
          email: superAdminEmail, 
          password: 'sahithi', 
          role: 'admin',
          phone: '+919876543210'
        });
        console.log('Created super admin account:', superAdminEmail);
      }

      const student = await User.findByEmail(studentEmail);
      if (!student) {
        await User.create({ name: 'Student Demo', email: studentEmail, password: 'student123', role: 'student' });
        console.log('Created demo student account:', studentEmail);
      }
    } catch (err) {
      console.error('Demo account setup error:', err.message);
    }
  })();
} catch (e) {
  console.error('Unable to setup demo accounts:', e.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
// Commented out for Vercel deployment - Vercel doesn't support long-running ports
// app.listen(PORT, () => {
//   console.log(`DormFlow Backend running on http://localhost:${PORT}`);
//   console.log(`Frontend served at: http://localhost:${PORT}`);
// });

// Export for Vercel serverless functions
module.exports = app;
// Also export serverless-wrapped version for better Vercel compatibility
module.exports.handler = serverless(app);
