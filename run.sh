#!/bin/bash

# Agentic Shop Lab - Combined Frontend & Backend Runner for Replit

echo "🚀 Starting Agentic Shop Lab..."
echo "========================================"

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ ERROR: OPENAI_API_KEY environment variable not set!"
    echo ""
    echo "Please set your OpenAI API key in Replit Secrets:"
    echo "1. Go to your Replit project"
    echo "2. Click the lock icon (Secrets)"
    echo "3. Add OPENAI_API_KEY with your API key"
    echo ""
    exit 1
fi

echo "✅ OpenAI API key found"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd backend
python3 -m pip install -r requirements.txt --quiet
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install --silent
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build --silent
cd ..

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi

echo "✅ Backend server started (PID: $BACKEND_PID)"
echo ""

# Start frontend server
echo "🌐 Starting frontend server..."
echo "========================================"
echo ""
echo "🎉 Agentic Shop Lab is running!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Serve frontend (this will be the main process)
cd frontend/dist
python3 -m http.server 3000
