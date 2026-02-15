from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from services.ai_service import AIService
from services.data_service import DataService
from models import (
    DashboardResponse,
    RecommendationResponse,
    HistoricalDataResponse,
    SensorDataResponse
)
from security import validate_field_id, validate_days
from typing import List

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    field_id: str = Query(default="field_001", description="Field identifier"),
    db: Session = Depends(get_db)
):
    """Get dashboard data with current readings and recommendations"""
    try:
        # Validate and sanitize input
        field_id = validate_field_id(field_id)
        
        ai_service = AIService(db)
        
        # Get latest sensor data
        latest_data = DataService.get_latest_sensor_data(db, field_id)
        if not latest_data:
            raise HTTPException(status_code=404, detail="No sensor data found for the specified field")
        
        # Get recommendations
        recommendations_data = ai_service.generate_recommendations(field_id)
        
        # Get yield forecast
        yield_forecast = recommendations_data["yield_forecast"]
        
        # Format response
        dashboard = DashboardResponse(
            current_soil_moisture=latest_data.soil_moisture,
            current_nutrients={
                "nitrogen": latest_data.soil_nitrogen,
                "phosphorus": latest_data.soil_phosphorus,
                "potassium": latest_data.soil_potassium
            },
            current_weather={
                "temperature": latest_data.temperature,
                "humidity": latest_data.humidity,
                "rainfall": latest_data.rainfall
            },
            yield_forecast=yield_forecast,
            recommendations=RecommendationResponse(**recommendations_data),
            last_updated=latest_data.timestamp
        )
        
        return dashboard
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard data")

@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    field_id: str = Query(default="field_001", description="Field identifier"),
    db: Session = Depends(get_db)
):
    """Get AI recommendations"""
    try:
        # Validate and sanitize input
        field_id = validate_field_id(field_id)
        
        ai_service = AIService(db)
        recommendations = ai_service.generate_recommendations(field_id)
        return RecommendationResponse(**recommendations)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

@router.get("/historical", response_model=HistoricalDataResponse)
async def get_historical_data(
    days: int = Query(default=30, ge=1, le=365, description="Number of days of historical data"),
    field_id: str = Query(default="field_001", description="Field identifier"),
    db: Session = Depends(get_db)
):
    """Get historical sensor data and yield history"""
    try:
        # Validate and sanitize inputs
        field_id = validate_field_id(field_id)
        days = validate_days(days)
        
        # Get sensor data
        sensor_data = DataService.get_historical_sensor_data(db, days=days, field_id=field_id)
        
        # Get yield history
        yield_history = DataService.get_yield_history(db, field_id=field_id)
        
        return HistoricalDataResponse(
            sensor_data=[SensorDataResponse.model_validate(d) for d in sensor_data],
            yield_history=[
                {
                    "season": y.season,
                    "crop_type": y.crop_type,
                    "yield_amount": y.yield_amount,
                    "harvest_date": y.harvest_date.isoformat()
                }
                for y in yield_history
            ]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve historical data")

@router.get("/sensor-data", response_model=List[SensorDataResponse])
async def get_sensor_data(
    days: int = Query(default=7, ge=1, le=365, description="Number of days of sensor data"),
    field_id: str = Query(default="field_001", description="Field identifier"),
    db: Session = Depends(get_db)
):
    """Get sensor data for specified time period"""
    try:
        # Validate and sanitize inputs
        field_id = validate_field_id(field_id)
        days = validate_days(days)
        
        sensor_data = DataService.get_historical_sensor_data(db, days=days, field_id=field_id)
        return [SensorDataResponse.model_validate(d) for d in sensor_data]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve sensor data")

@router.get("/weather-forecast")
async def get_weather_forecast(db: Session = Depends(get_db)):
    """Get 7-day weather forecast"""
    try:
        ai_service = AIService(db)
        forecast = ai_service.get_weather_forecast()
        return {"forecast": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

