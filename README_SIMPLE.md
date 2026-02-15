# Simple Setup Guide

## 🚀 One-Click Start (Local)

```bash
./start.sh
```

That's it! The script will:
1. Start backend on http://localhost:8000
2. Build and start frontend on http://localhost:3000
3. Open http://localhost:3000 in your browser

## 🛑 Stop Servers

```bash
./stop.sh
```

## 📝 Manual Start (if needed)

**Backend:**
```bash
cd backend
python3 main.py
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## ✅ Verify It's Working

1. Open http://localhost:3000
2. You should see the dashboard with data
3. No errors in browser console (F12)

## 🔧 Troubleshooting

**Backend not starting?**
- Check if port 8000 is free: `lsof -ti:8000`
- Kill existing process: `kill $(lsof -ti:8000)`

**Frontend not connecting?**
- Make sure backend is running first
- Check browser console for errors
- Verify CORS is enabled (it is by default)

## 📦 For AWS Deployment

The app is ready for AWS Amplify:
- `amplify.yml` is configured
- Build commands are set
- Environment variables can be set in AWS Console

