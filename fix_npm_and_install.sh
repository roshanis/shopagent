#!/bin/bash

# NPM Permission Fix and Frontend Installation Script
# This script fixes npm cache permissions and installs frontend dependencies

echo "================================================"
echo "NPM Permission Fix & Frontend Installation"
echo "================================================"
echo ""

echo "This script will:"
echo "  1. Fix npm cache permissions"
echo "  2. Clean npm cache"
echo "  3. Install frontend dependencies"
echo ""
echo "You will be asked for your password (for sudo access)"
echo ""

read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Fix npm cache permissions
echo "Step 1: Fixing npm cache permissions..."
sudo chown -R $(whoami):$(id -gn) "/Users/$(whoami)/.npm"

if [ $? -eq 0 ]; then
    echo "✅ Permissions fixed successfully"
else
    echo "❌ Failed to fix permissions"
    exit 1
fi

echo ""

# Clean npm cache
echo "Step 2: Cleaning npm cache..."
npm cache clean --force

echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Remove existing node_modules if any
if [ -d "node_modules" ]; then
    echo "Step 3: Removing old node_modules..."
    rm -rf node_modules package-lock.json
    echo "✅ Cleaned up old files"
    echo ""
fi

# Install dependencies
echo "Step 4: Installing frontend dependencies..."
echo "This may take a few minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ SUCCESS! Frontend is ready!"
    echo "================================================"
    echo ""
    echo "You can now run:"
    echo "  ./start_frontend.sh"
    echo ""
    echo "Or from the frontend directory:"
    echo "  npm run dev"
    echo ""
else
    echo ""
    echo "================================================"
    echo "❌ Installation failed"
    echo "================================================"
    echo ""
    echo "Please check the error messages above."
    echo "If issues persist, try:"
    echo "  1. Update Node.js: brew upgrade node"
    echo "  2. Clear cache again: npm cache clean --force"
    echo "  3. Try installing again: cd frontend && npm install"
    echo ""
    exit 1
fi
