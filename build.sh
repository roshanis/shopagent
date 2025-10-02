#!/bin/bash

# Replit Build Script
# This script handles the build phase for Replit deployments

set -e  # Exit on error
set -x  # Print commands as they execute

echo "🔨 Building Agentic Shop Lab for Replit..."
echo "========================================"

# Get absolute script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Build directory: $SCRIPT_DIR"
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la "$SCRIPT_DIR"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python3 -m pip install -r "$SCRIPT_DIR/backend/requirements.txt" --quiet
echo "✅ Python dependencies installed"
echo ""

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
echo "Changing to: $SCRIPT_DIR/frontend"
cd "$SCRIPT_DIR/frontend"
echo "Now in: $(pwd)"
echo "Checking for package.json:"
ls -la package.json
npm install
echo "✅ Node.js dependencies installed"
echo ""

# Build frontend
echo "🔨 Building React frontend..."
echo "Building from: $(pwd)"
npm run build
echo "✅ Frontend build completed"
echo ""

# Return to root
cd "$SCRIPT_DIR"

echo "========================================"
echo "✅ Build completed successfully!"
echo "========================================"

