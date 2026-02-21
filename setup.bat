@echo off
REM Smart Parking & Vehicle Service System - Setup Script for Windows

echo.
echo 🚀 Smart Parking - Setup Guide (Windows)
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo ✅ NPM version: 
npm --version
echo.

REM Setup Backend
echo 📦 Setting up Backend...
echo ========================
cd server

if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already installed
)

if not exist ".env" (
    echo.
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env >nul
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit server\.env with your credentials:
    echo    - MONGODB_URI
    echo    - JWT_SECRET
    echo    - RAZORPAY credentials
) else (
    echo ✅ .env file already exists
)

cd ..

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
echo ========================
cd client

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)

if not exist ".env" (
    echo.
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env >nul
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit client\.env with your credentials:
    echo    - VITE_API_URL
    echo    - VITE_RAZORPAY_KEY_ID
) else (
    echo ✅ .env file already exists
)

cd ..

echo.
echo ==========================================
echo ✅ SETUP COMPLETE!
echo ==========================================
echo.
echo 📚 Next Steps:
echo.
echo 1️⃣  Configure Environment Variables:
echo    - Edit server\.env
echo    - Edit client\.env
echo.
echo 2️⃣  Start the Backend (Command Prompt 1):
echo    cd server ^& npm run dev
echo.
echo 3️⃣  Start the Frontend (Command Prompt 2):
echo    cd client ^& npm run dev
echo.
echo 4️⃣  Open in Browser:
echo    http://localhost:5173
echo.
echo 📖 Documentation:
echo    - README.md (Overview)
echo    - INSTALLATION.md (Detailed setup)
echo    - API_DOCUMENTATION.md (API reference)
echo    - PROJECT_SUMMARY.md (Features & status)
echo.
echo Happy Coding! 🚀
echo.
pause
