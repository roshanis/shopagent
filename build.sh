#!/bin/sh

# Replit Build Script - Uses virtual environment for Python
# This script handles the build phase for Replit deployments

set -e  # Exit on error

echo "Building Agentic Shop Lab for Replit..."
echo "========================================"

# Get script directory (POSIX compatible)
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
echo "Build directory: $SCRIPT_DIR"
echo ""

# Create and activate virtual environment for Python
echo "Creating Python virtual environment..."
cd "$SCRIPT_DIR"
python3 -m venv .venv
. .venv/bin/activate

# Install Python dependencies in virtual environment
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r "$SCRIPT_DIR/backend/requirements.txt"
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
