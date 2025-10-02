#!/bin/sh

# Replit Build Script - POSIX compliant
# This script handles the build phase for Replit deployments

set -e  # Exit on error

echo "Building Agentic Shop Lab for Replit..."
echo "========================================"

# Get script directory (POSIX compatible)
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
echo "Build directory: $SCRIPT_DIR"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
python3 -m pip install -r "$SCRIPT_DIR/backend/requirements.txt"
echo "Python dependencies installed"
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd "$SCRIPT_DIR/frontend"
echo "Changed to: $SCRIPT_DIR/frontend"
ls -la package.json
npm install
echo "Node.js dependencies installed"
echo ""

# Build frontend
echo "Building React frontend..."
npm run build
echo "Frontend build completed"
echo ""

# Return to root
cd "$SCRIPT_DIR"

echo "========================================"
echo "Build completed successfully!"
echo "========================================"
