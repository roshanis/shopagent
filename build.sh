#!/bin/sh
set -e

echo "=== Replit Build Script ==="

# Install Python packages to user directory
echo "Step 1: Installing Python dependencies..."
pip install --user -r /home/runner/workspace/backend/requirements.txt || pip install --user -r ./backend/requirements.txt
echo "Python dependencies installed"

# Install Node dependencies (must be in frontend directory)
echo "Step 2: Installing Node.js dependencies..."
cd /home/runner/workspace/frontend || cd ./frontend
pwd
ls -la package.json
npm install
echo "Node.js dependencies installed"

# Build frontend (already in frontend directory)
echo "Step 3: Building React frontend..."
npm run build
echo "Frontend build completed"

echo "=== Build Complete ==="
