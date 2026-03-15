require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ message: 'Havenly API is running', status: 'ok' });
});

// Debug endpoint
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

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all handler - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Export for Vercel
module.exports = app;
