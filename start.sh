#!/bin/bash
# Simple startup script - runs both backend and frontend

echo "🚀 Starting Precision Agriculture Platform..."
echo ""

# Kill any existing processes
pkill -f "python3.*main.py" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# Start Backend
echo "📡 Starting Backend Server..."
cd backend
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "❌ Backend failed to start. Check backend.log"
    exit 1
fi

# Start Frontend
echo "🌐 Starting Frontend Server..."
cd frontend

# Build if needed
if [ ! -d "dist" ] || [ "src" -nt "dist" ]; then
    echo "📦 Building frontend..."
    npm run build > /dev/null 2>&1
fi

# Start server
node server.js > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

# Wait for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend failed to start. Check frontend.log"
    exit 1
fi

echo ""
echo "🎉 Application is ready!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "To stop: ./stop.sh or kill the processes"

