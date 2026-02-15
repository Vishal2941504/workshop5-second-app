from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from database import Base
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

# SQLAlchemy Models
class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    soil_moisture = Column(Float)  # Percentage
    soil_nitrogen = Column(Float)  # ppm
    soil_phosphorus = Column(Float)  # ppm
    soil_potassium = Column(Float)  # ppm
    temperature = Column(Float)  # Celsius
    humidity = Column(Float)  # Percentage
    rainfall = Column(Float)  # mm
    field_id = Column(String, default="field_001")

class YieldHistory(Base):
    __tablename__ = "yield_history"
    
    id = Column(Integer, primary_key=True, index=True)
    season = Column(String)  # e.g., "2023-2024"
    crop_type = Column(String, default="Corn")
    yield_amount = Column(Float)  # tons/hectare
    field_id = Column(String, default="field_001")
    harvest_date = Column(DateTime, default=datetime.utcnow)

# Pydantic Models for API
class SensorDataResponse(BaseModel):
    id: int
    timestamp: datetime
    soil_moisture: float
    soil_nitrogen: float
    soil_phosphorus: float
    soil_potassium: float
    temperature: float
    humidity: float
    rainfall: float
    field_id: str
    
    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    irrigation: str  # Low, Medium, High
    fertilizer: str  # Apply, Delay
    pest_risk: str  # Low, Moderate, High
    yield_forecast: float  # tons/hectare
    confidence: float  # 0-1
    timestamp: datetime
    alerts: List[str]

class DashboardResponse(BaseModel):
    current_soil_moisture: float
    current_nutrients: dict
    current_weather: dict
    yield_forecast: float
    recommendations: RecommendationResponse
    last_updated: datetime

class HistoricalDataResponse(BaseModel):
    sensor_data: List[SensorDataResponse]
    yield_history: List[dict]


