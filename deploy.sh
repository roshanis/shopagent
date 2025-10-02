#!/bin/bash

# Replit Deployment Script
# This script is specifically for Replit deployments

echo "🚀 Replit Deployment - Building Agentic Shop Lab..."
echo "========================================"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Working directory: $SCRIPT_DIR"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install and build frontend
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install

echo "🔨 Building frontend..."
npm run build

cd "$SCRIPT_DIR"

echo "✅ Build completed successfully!"
echo ""
echo "Starting services..."

# Start backend
cd backend
python main.py &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Check if backend started
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"

# Start frontend
cd "$SCRIPT_DIR/frontend/dist"
python -m http.server 3000

