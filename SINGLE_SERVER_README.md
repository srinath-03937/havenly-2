# Havenly Single Server Setup

This setup allows you to run the entire Havenly application (frontend + backend) on a single server.

## 🚀 Quick Start

### Option 1: Using NPM Script
```bash
cd backend
npm run single-server
```

### Option 2: Using Batch File (Windows)
```bash
cd backend
start-single-server.bat
```

### Option 3: Manual Steps
```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Start the backend server
cd ../backend
npm start
```

## 📱 Access Your Application

- **Full Application**: http://localhost:5000
- **API Endpoints**: http://localhost:5000/api/*
- **Health Check**: http://localhost:5000/health

## 🔧 How It Works

1. **Frontend Build**: The React app is built to `frontend/dist`
2. **Static Serving**: The backend serves the built frontend files
3. **API Routes**: Backend API routes are served at `/api/*`
4. **Fallback Routing**: All non-API routes serve the React app
5. **Single Port**: Everything runs on port 5000

## 📁 Project Structure

```
Havenly/
├── backend/
│   ├── server.js          # Main server file
│   ├── start-single-server.bat  # Windows batch script
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── dist/              # Built React app
│   └── src/               # React source code
└── README.md
```

## 🎯 Benefits

✅ **Single Port**: No need to manage multiple ports
✅ **Easy Deployment**: One server to deploy
✅ **No CORS Issues**: Frontend and backend on same domain
✅ **Simple Configuration**: Less complex setup
✅ **Production Ready**: Suitable for deployment

## 🔧 Environment Variables

Make sure your `.env` file in the backend directory contains:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=5000
```

## 🚀 Deployment

### Local Development
```bash
cd backend
npm run single-server
```

### Production Deployment
1. Build frontend: `npm run build`
2. Set environment variables
3. Start server: `npm start`

## 📱 Demo Credentials

- **Admin**: gajula@gmail.com / sahithi
- **Student**: student-test@havenly.com / student123

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Frontend Build Issues
```bash
cd frontend
npm install
npm run build
```

### Backend Issues
```bash
cd backend
npm install
npm start
```

## 🎉 Features Available

- ✅ User Authentication
- ✅ Admin Dashboard
- ✅ Student Portal
- ✅ Room Management
- ✅ Payment Processing
- ✅ Complaint System
- ✅ AI Integration
- ✅ Mobile Responsive Design
- ✅ Real-time Updates

**Your Havenly application is now running on a single server! 🎉**
