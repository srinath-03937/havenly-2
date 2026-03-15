#!/bin/bash

# Havenly - Single Server Deployment Script
echo "🚀 Starting Havenly Single Server..."

# Check if we're in the backend directory
if [ ! -f "package.json" ] || [ ! -d "../frontend" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Build frontend first
echo "📦 Building frontend..."
cd ../frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Start backend server (which serves both frontend and backend)
echo "🚀 Starting single server..."
cd ../backend
npm start

echo "✅ Single server started!"
echo ""
echo "📝 Your application is now running at:"
echo "   🌐 http://localhost:5000"
echo ""
echo "🔧 Features available:"
echo "   ✅ Frontend and Backend on single server"
echo "   ✅ API endpoints at /api/*"
echo "   ✅ Static files served from /uploads"
echo "   ✅ React app served for all non-API routes"
