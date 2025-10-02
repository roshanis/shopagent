#!/bin/sh

# Replit Build Script - Simple approach
# This script handles the build phase for Replit deployments

set -e  # Exit on error

echo "Building Agentic Shop Lab for Replit..."
echo "========================================"

# Get script directory (POSIX compatible)
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
echo "Build directory: $SCRIPT_DIR"
echo ""

# Install Python dependencies using --user flag (works in Replit)
echo "Installing Python dependencies..."
cd "$SCRIPT_DIR"
pip install --user -r backend/requirements.txt
echo "Python dependencies installed"
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd "$SCRIPT_DIR/frontend"
echo "Changed to: $SCRIPT_DIR/frontend"
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
