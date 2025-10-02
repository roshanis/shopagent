#!/bin/sh

# Replit Start Script - Simple approach
# This script handles the run phase for Replit deployments

set -e  # Exit on error

echo "Starting Agentic Shop Lab..."
echo "========================================"

# Get script directory (POSIX compatible)
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
echo "Start directory: $SCRIPT_DIR"
echo ""

# Check for API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "ERROR: OPENAI_API_KEY not set!"
    echo "Please add it to Replit Secrets"
    exit 1
fi

echo "Environment variables validated"
echo ""

# Start backend
echo "Starting backend server..."
cd "$SCRIPT_DIR/backend"
python3 main.py &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to initialize
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend failed to start"
    exit 1
fi

# Start frontend server
echo "Starting frontend server..."
cd "$SCRIPT_DIR/frontend/dist"

echo ""
echo "========================================"
echo "Agentic Shop Lab is running!"
echo "========================================"
echo "Frontend: Port 3000"
echo "Backend API: Port 8000"
echo "========================================"
echo ""

# Start serving frontend (this will be the main process)
exec python3 -m http.server 3000
