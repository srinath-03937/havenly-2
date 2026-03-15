require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Havenly API is running', status: 'ok', time: new Date().toISOString() });
});

// Debug endpoint
app.get('/debug-env', (req, res) => {
  res.json({
    projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'SET (length: ' + (process.env.FIREBASE_PRIVATE_KEY?.length || 0) + ')' : 'NOT SET',
    databaseURL: process.env.FIREBASE_DATABASE_URL ? 'SET' : 'NOT SET',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    geminiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET'
  });
});

// API test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Main page - JSON response
app.get('/', (req, res) => {
  res.json({
    app: 'Havenly',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/health', '/debug-env', '/api/test'],
    message: 'Backend API is working!'
  });
});

// Catch all
app.get('*', (req, res) => {
  res.json({
    message: 'Havenly API',
    path: req.path,
    availableEndpoints: ['/health', '/debug-env', '/api/test', '/']
  });
});

module.exports = app;
