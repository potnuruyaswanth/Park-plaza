#!/bin/bash

# Smart Parking & Vehicle Service System - Setup Script
# This script will help you setup the project quickly

echo "🚀 Smart Parking & Vehicle Service System - Setup Guide"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
echo "========================"
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit server/.env with your credentials:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - RAZORPAY credentials"
else
    echo "✅ .env file already exists"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
echo "========================"
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit client/.env with your credentials:"
    echo "   - VITE_API_URL"
    echo "   - VITE_RAZORPAY_KEY_ID"
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "=========================================================="
echo "✅ SETUP COMPLETE!"
echo "=========================================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1️⃣  Configure Environment Variables:"
echo "    - Edit server/.env"
echo "    - Edit client/.env"
echo ""
echo "2️⃣  Start the Backend (Terminal 1):"
echo "    cd server && npm run dev"
echo ""
echo "3️⃣  Start the Frontend (Terminal 2):"
echo "    cd client && npm run dev"
echo ""
echo "4️⃣  Open in Browser:"
echo "    http://localhost:5173"
echo ""
echo "📖 Documentation:"
echo "   - README.md (Overview)"
echo "   - INSTALLATION.md (Detailed setup)"
echo "   - API_DOCUMENTATION.md (API reference)"
echo "   - PROJECT_SUMMARY.md (Features & status)"
echo ""
echo "Happy Coding! 🚀"
echo ""
