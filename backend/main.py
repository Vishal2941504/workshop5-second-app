from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(title="Agriculture API")

# Simple CORS - allow everything
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple dashboard endpoint
@app.get("/api/v1/dashboard")
async def get_dashboard():
    return {
        "current_soil_moisture": 45.5,
        "current_nutrients": {
            "nitrogen": 25.0,
            "phosphorus": 18.0,
            "potassium": 200.0
        },
        "current_weather": {
            "temperature": 22.0,
            "humidity": 60.0,
            "rainfall": 5.0
        },
        "yield_forecast": 8.5,
        "recommendations": {
            "irrigation": "Medium",
            "fertilizer": "Apply",
            "pest_risk": "Low",
            "confidence": 0.85,
            "alerts": []
        },
        "last_updated": "2026-02-15T14:00:00"
    }

@app.get("/api/v1/recommendations")
async def get_recommendations():
    return {
        "irrigation": "Medium",
        "fertilizer": "Apply",
        "pest_risk": "Low",
        "confidence": 0.85
    }

@app.get("/api/v1/historical")
async def get_historical():
    # Simple mock data
    sensor_data = []
    for i in range(30):
        sensor_data.append({
            "timestamp": f"2026-02-{15-i:02d}T10:00:00",
            "soil_moisture": 40 + i * 0.5,
            "temperature": 20 + i * 0.3,
            "humidity": 55 + i * 0.2,
            "soil_nitrogen": 20 + i * 0.1,
            "soil_phosphorus": 15 + i * 0.1,
            "soil_potassium": 180 + i * 0.5,
            "rainfall": i % 7 * 2
        })
    
    return {
        "sensor_data": sensor_data,
        "yield_history": [
            {"season": "2024 Spring", "crop_type": "Wheat", "yield_amount": 7.5, "harvest_date": "2024-06-15"},
            {"season": "2024 Fall", "crop_type": "Corn", "yield_amount": 9.2, "harvest_date": "2024-11-20"}
        ]
    }

@app.get("/api/v1/weather-forecast")
async def get_weather():
    forecast = []
    for i in range(7):
        forecast.append({
            "date": f"2026-02-{16+i:02d}",
            "temperature": 20 + i,
            "humidity": 60 - i * 2,
            "rainfall": i % 3 * 5
        })
    return {"forecast": forecast}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
