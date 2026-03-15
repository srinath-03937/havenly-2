#!/bin/bash

# Havenly - Vercel Deployment Script
echo "🚀 Deploying Havenly to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the root directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the root directory of Havenly"
    exit 1
fi

# Build frontend first
echo "📦 Building frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Go back to root directory
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Your Havenly application is now live on Vercel!"
echo ""
echo "🔧 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Test your application"
echo "3. Set up custom domain (optional)"
