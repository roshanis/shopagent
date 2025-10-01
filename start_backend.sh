#!/bin/bash

# Agentic Shop Lab - Backend Startup Script

echo "================================================"
echo "Agentic Shop Lab - Backend Server Startup"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo ""
    echo "Creating .env file from template..."
    cat > .env << 'EOF'
# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Backend Configuration
PORT=8000

# Frontend Configuration
VITE_API_URL=http://localhost:8000
EOF
    echo "✓ .env file created"
    echo ""
    echo "IMPORTANT: Please edit .env file and add your OpenAI API key!"
    echo "Then run this script again."
    echo ""
    exit 1
fi

# Check if API key is set in .env
if grep -q "your-openai-api-key-here" .env; then
    echo "ERROR: Please update OPENAI_API_KEY in .env file!"
    echo ""
    echo "Edit .env file and replace 'your-openai-api-key-here' with your actual API key"
    echo ""
    exit 1
fi

echo "✓ .env file found"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
pip install -q -e ../
echo "✓ Dependencies installed"
echo ""

# Start the server
echo "================================================"
echo "Starting FastAPI server..."
echo "================================================"
echo ""
echo "API Server: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Interactive API: http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py
