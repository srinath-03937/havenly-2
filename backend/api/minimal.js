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

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Serve a simple HTML page for all routes
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Havenly - Hostel Management</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .status { 
          color: #4CAF50; 
          font-weight: bold; 
          font-size: 20px;
        }
        .error { 
          color: #ff6b6b; 
        }
        .btn {
          background: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px;
          text-decoration: none;
          display: inline-block;
        }
        .btn:hover {
          background: #45a049;
        }
        h1 { font-size: 48px; margin-bottom: 10px; }
        h2 { font-size: 24px; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏠 Havenly</h1>
        <h2>Hostel Management System</h2>
        <div class="status">✅ Backend API is Running</div>
        <p>Server is successfully deployed on Vercel!</p>
        <div>
          <h3>🔧 Test API Endpoints:</h3>
          <a href="/health" class="btn">🔍 Health Check</a>
          <a href="/debug-env" class="btn">🔧 Debug Environment</a>
          <a href="/api/test" class="btn">🚀 API Test</a>
        </div>
        <div style="margin-top: 30px;">
          <h3>📱 Next Steps:</h3>
          <p>1. Test the API endpoints above</p>
          <p>2. Check environment variables are set correctly</p>
          <p>3. Once API works, we'll add the React frontend</p>
        </div>
        <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
          <p>Current path: ${req.path}</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Export for Vercel
module.exports = app;
