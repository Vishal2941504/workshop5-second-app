#!/bin/bash
# Stop all servers

echo "🛑 Stopping servers..."

pkill -f "python3.*main.py" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null

if [ -f backend.pid ]; then
    kill $(cat backend.pid) 2>/dev/null
    rm backend.pid
fi

if [ -f frontend.pid ]; then
    kill $(cat frontend.pid) 2>/dev/null
    rm frontend.pid
fi

sleep 2
echo "✅ All servers stopped"

