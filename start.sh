#!/bin/sh
set -e

echo "=== Starting Agentic Shop Lab ==="

# Check API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "ERROR: OPENAI_API_KEY not set!"
    exit 1
fi

# Start backend
echo "Starting backend..."
cd /home/runner/workspace/backend || cd ./backend
python3 main.py &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend
sleep 3

# Check backend
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend failed to start"
    exit 1
fi

# Serve frontend
echo "Starting frontend..."
cd /home/runner/workspace/frontend/dist || cd ./frontend/dist
echo "Serving from: $(pwd)"
exec python3 -m http.server 3000
