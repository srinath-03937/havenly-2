require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

<<<<<<< HEAD
=======
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

>>>>>>> eb17cdf9e1ec76aa80040b87f6fe2d9afdfa2d84
// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.listen(PORT, () => {
  console.log(`DormFlow Backend running on http://localhost:${PORT}`);
  console.log(`Frontend served at: http://localhost:${PORT}`);
});
