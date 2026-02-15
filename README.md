# Precision Agriculture Decision Platform

A full-stack AI-powered web application that provides predictive irrigation, nutrient, yield, and pest risk recommendations for crop farms.

## 🌾 Features

- **Field Dashboard**: Real-time monitoring of soil moisture, nutrient levels, weather conditions, and yield forecasts
- **AI Recommendations**: Intelligent recommendations for irrigation, fertilizer application, and pest risk management
- **Historical Analytics**: Time-series charts for soil moisture, weather trends, and yield history
- **Alert System**: Critical notifications for irrigation needs and pest outbreaks
- **Mobile-First Design**: Responsive UI optimized for mobile devices

## 🏗️ Architecture

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Recharts** for data visualization
- Mobile-first responsive design

### Backend
- **Python FastAPI** RESTful API
- **SQLite** database (simulating time-series storage)
- **AI Simulation Layer**:
  - Irrigation recommendation model
  - Fertilizer timing model
  - Pest risk classification
  - Yield forecasting

### Database Schema
- **Sensor Data**: Soil moisture, nutrients (N, P, K), temperature, humidity, rainfall
- **Yield History**: Historical crop yields by season

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Using Docker

```bash
# Build and run both services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 📡 API Endpoints

### Dashboard
- `GET /api/v1/dashboard` - Get complete dashboard data
- `GET /api/v1/recommendations` - Get AI recommendations
- `GET /api/v1/historical?days=30` - Get historical sensor data
- `GET /api/v1/sensor-data?days=7` - Get sensor readings
- `GET /api/v1/weather-forecast` - Get 7-day weather forecast

### Health Check
- `GET /health` - API health status
- `GET /` - API information

## 🤖 AI Simulation Logic

### Irrigation Recommendation
- **High**: Soil moisture < 30% AND hot weather forecast
- **Medium**: Soil moisture < 30% OR (moisture < 50% AND hot weather)
- **Low**: Soil moisture >= 50%

### Fertilizer Recommendation
- **Apply**: Nutrient levels declining OR below threshold
- **Delay**: Nutrients stable and sufficient

### Pest Risk Classification
- **High**: Temperature > 25°C AND humidity > 70%
- **Moderate**: Temperature > 25°C OR humidity > 70%
- **Low**: Conditions below thresholds

### Yield Forecasting
- Weighted moving average of historical yields
- Trend detection with seasonal adjustments

## 🐳 AWS App Runner Deployment

### Backend Deployment

1. **Build and push Docker image**:
```bash
cd backend
docker build -t precision-ag-backend .
docker tag precision-ag-backend:latest <your-ecr-repo>/precision-ag-backend:latest
docker push <your-ecr-repo>/precision-ag-backend:latest
```

2. **Create App Runner service**:
   - Go to AWS App Runner console
   - Create new service
   - Source: Container registry (ECR)
   - Select your image
   - Port: 8000
   - Environment variables (if needed)

### Frontend Deployment

1. **Update API URL**:
   - Set `VITE_API_URL` environment variable to your backend URL
   - Or update `frontend/src/services/api.js`

2. **Build and push Docker image**:
```bash
cd frontend
docker build -t precision-ag-frontend .
docker tag precision-ag-frontend:latest <your-ecr-repo>/precision-ag-frontend:latest
docker push <your-ecr-repo>/precision-ag-frontend:latest
```

3. **Create App Runner service**:
   - Source: Container registry (ECR)
   - Select your frontend image
   - Port: 80
   - Configure nginx to proxy API requests

### Alternative: Single Service Deployment

You can also deploy both services together using docker-compose and deploy as a single App Runner service.

## 📁 Project Structure

```
.
├── backend/
│   ├── api/
│   │   └── routes.py          # API endpoints
│   ├── services/
│   │   ├── ai_service.py      # AI simulation logic
│   │   └── data_service.py    # Data management
│   ├── models.py              # Database models
│   ├── database.py            # Database configuration
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend Docker image
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── nginx.conf             # Nginx config for production
│   └── Dockerfile             # Frontend Docker image
│
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

**Backend**:
- No environment variables required for MVP
- Database file: `agriculture.db` (created automatically)

**Frontend**:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000/api/v1`)

## 🧪 Testing

### Backend
```bash
cd backend
# Test API endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/dashboard
```

### Frontend
```bash
cd frontend
npm run build  # Test production build
```

## 📊 Data Simulation

The application automatically generates:
- 30 days of historical sensor data (4 readings per day)
- 4 seasons of yield history
- Real-time weather forecasts (simulated)

Data is seeded on first startup and persists in SQLite database.

## 🛠️ Development Notes

- **Database**: SQLite file is created in the backend directory
- **CORS**: Currently allows all origins (configure for production)
- **Error Handling**: Global exception handler in FastAPI
- **Data Refresh**: Frontend auto-refreshes every 5 minutes

## 📝 License

This project is provided as-is for demonstration purposes.

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding authentication/authorization
- Implementing real ML models
- Connecting to actual IoT sensors
- Adding more sophisticated forecasting
- Implementing user management
- Adding field management features

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.


