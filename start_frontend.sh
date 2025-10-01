#!/bin/bash

# Agentic Shop Lab - Frontend Startup Script

echo "================================================"
echo "Agentic Shop Lab - Frontend Application Startup"
echo "================================================"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

# Start the development server
echo "================================================"
echo "Starting React development server..."
echo "================================================"
echo ""
echo "Frontend Application: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
