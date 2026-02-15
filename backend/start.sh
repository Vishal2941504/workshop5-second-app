#!/bin/bash
# Backend server startup script

cd "$(dirname "$0")"

echo "🚀 Starting Precision Agriculture Backend Server..."
echo ""

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use"
    echo "   Stopping existing server..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install dependencies if needed
if [ ! -d "../frontend/node_modules" ] || [ ! -f ".deps_installed" ]; then
    echo "📦 Installing dependencies..."
    python3 -m pip install -r requirements.txt --user --quiet
    touch .deps_installed
fi

# Start the server
echo "🌱 Starting server on http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"
echo ""
python3 main.py

