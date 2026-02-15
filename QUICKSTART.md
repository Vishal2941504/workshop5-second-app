# Quick Start Guide

## 🚀 Running in Cursor Preview Environment

### Option 1: Run Backend and Frontend Separately

#### Step 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend will be available at: `http://localhost:8000`

#### Step 2: Start Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Using Docker Compose

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## ✅ Verification

1. **Check Backend Health**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check API Endpoint**:
   ```bash
   curl http://localhost:8000/api/v1/dashboard
   ```

3. **Open Frontend**: Navigate to `http://localhost:3000` in your browser

## 📊 What You'll See

- **Dashboard**: Current soil moisture, nutrients, weather, and yield forecast
- **AI Recommendations**: Irrigation, fertilizer, and pest risk recommendations
- **Historical Charts**: 30-day trends for soil moisture, weather, and yield history
- **Alerts**: Critical notifications for irrigation needs and pest risks

## 🔧 Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change port in `backend/main.py` or stop the conflicting service
- **Database errors**: Delete `backend/agriculture.db` and restart (will regenerate data)
- **Import errors**: Make sure you're in the `backend` directory and have installed requirements

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically use the next available port
- **API connection errors**: Ensure backend is running on port 8000
- **Build errors**: Delete `node_modules` and run `npm install` again

### Docker Issues

- **Build fails**: Make sure Docker is running and you have sufficient resources
- **Port conflicts**: Modify ports in `docker-compose.yml`

## 🎯 Next Steps

- Explore the dashboard and recommendations
- Check the API documentation at `http://localhost:8000/docs`
- Review the code structure in `backend/` and `frontend/` directories
- Customize AI thresholds in `backend/services/ai_service.py`


