#!/bin/bash

echo "🚀 Starting Simple Agriculture Platform..."

# Kill existing processes
pkill -f "python3.*main.py" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# Start Backend
echo "📡 Starting Backend..."
cd backend
python3 main.py > ../backend.log 2>&1 &
echo $! > ../backend.pid
cd ..
sleep 3

# Check backend
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi
echo "✅ Backend running on http://localhost:8000"

# Build and start Frontend
echo "🌐 Building Frontend..."
cd frontend
npm run build > /dev/null 2>&1

echo "🚀 Starting Frontend..."
node server.js > ../frontend.log 2>&1 &
echo $! > ../frontend.pid
cd ..
sleep 2

# Check frontend
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Frontend failed to start"
    exit 1
fi
echo "✅ Frontend running on http://localhost:3000"

echo ""
echo "🎉 Application ready!"
echo "📍 Open: http://localhost:3000"
echo ""
