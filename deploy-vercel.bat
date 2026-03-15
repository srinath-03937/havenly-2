@echo off
echo 🚀 Deploying Havenly to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if we're in the root directory
if not exist backend (
    echo ❌ Please run this script from the root directory of Havenly
    pause
    exit /b 1
)

if not exist frontend (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

REM Build frontend first
echo 📦 Building frontend...
cd frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend build successful!

REM Go back to root directory
cd ..

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod

echo ✅ Deployment complete!
echo.
echo 📝 Your Havenly application is now live on Vercel!
echo.
echo 🔧 Next steps:
echo 1. Set environment variables in Vercel dashboard
echo 2. Test your application
echo 3. Set up custom domain (optional)
pause
