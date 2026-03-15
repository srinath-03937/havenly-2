@echo off
echo 🚀 Starting Havenly Single Server...

REM Check if we're in the backend directory
if not exist package.json (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

if not exist ..\frontend (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

REM Build frontend first
echo 📦 Building frontend...
cd ..\frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend build successful!

REM Start backend server (which serves both frontend and backend)
echo 🚀 Starting single server...
cd ..\backend
call npm start

echo ✅ Single server started!
echo.
echo 📝 Your application is now running at:
echo    🌐 http://localhost:5000
echo.
echo 🔧 Features available:
echo    ✅ Frontend and Backend on single server
echo    ✅ API endpoints at /api/*
echo    ✅ Static files served from /uploads
echo    ✅ React app served for all non-API routes
pause
