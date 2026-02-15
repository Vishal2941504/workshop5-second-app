from datetime import datetime, timedelta
from typing import List, Dict
import numpy as np
from sqlalchemy.orm import Session
from models import SensorData, YieldHistory
import random

class AIService:
    """AI simulation service for agricultural recommendations"""
    
    # Thresholds
    SOIL_MOISTURE_LOW = 30.0
    SOIL_MOISTURE_MEDIUM = 50.0
    TEMP_HIGH_THRESHOLD = 30.0
    HUMIDITY_PEST_THRESHOLD = 70.0
    TEMP_PEST_THRESHOLD = 25.0
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_recent_sensor_data(self, days: int = 7) -> List[SensorData]:
        """Get recent sensor data"""
        cutoff = datetime.utcnow() - timedelta(days=days)
        return self.db.query(SensorData).filter(
            SensorData.timestamp >= cutoff
        ).order_by(SensorData.timestamp.desc()).all()
    
    def get_weather_forecast(self) -> Dict:
        """Simulate weather forecast for next 7 days"""
        base_temp = 22.0
        base_humidity = 60.0
        
        forecast = []
        for i in range(7):
            # Simulate some variation
            temp = base_temp + random.uniform(-5, 8)
            humidity = base_humidity + random.uniform(-15, 20)
            rainfall = random.uniform(0, 5) if random.random() > 0.7 else 0
            
            forecast.append({
                "date": (datetime.utcnow() + timedelta(days=i)).isoformat(),
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "rainfall": round(rainfall, 1)
            })
        
        return forecast
    
    def predict_irrigation_need(self, current_data: SensorData, forecast: List[Dict]) -> str:
        """Predict irrigation recommendation"""
        moisture = current_data.soil_moisture
        
        # Check forecast for hot weather
        avg_forecast_temp = np.mean([f["temperature"] for f in forecast[:3]])
        hot_weather = avg_forecast_temp > self.TEMP_HIGH_THRESHOLD
        
        # Logic
        if moisture < self.SOIL_MOISTURE_LOW:
            if hot_weather:
                return "High"
            return "Medium"
        elif moisture < self.SOIL_MOISTURE_MEDIUM:
            if hot_weather:
                return "Medium"
            return "Low"
        else:
            return "Low"
    
    def predict_fertilizer_need(self, recent_data: List[SensorData]) -> str:
        """Predict fertilizer recommendation based on nutrient trends"""
        if len(recent_data) < 3:
            return "Delay"
        
        # Get nutrient levels over time
        nitrogen_levels = [d.soil_nitrogen for d in recent_data[:7]]
        phosphorus_levels = [d.soil_phosphorus for d in recent_data[:7]]
        
        # Calculate trend (simple linear regression slope)
        def calculate_trend(values):
            if len(values) < 2:
                return 0
            x = np.arange(len(values))
            slope = np.polyfit(x, values, 1)[0]
            return slope
        
        nitrogen_trend = calculate_trend(nitrogen_levels)
        phosphorus_trend = calculate_trend(phosphorus_levels)
        
        # Current levels
        current_nitrogen = nitrogen_levels[0]
        current_phosphorus = phosphorus_levels[0]
        
        # Decision logic
        low_nutrients = current_nitrogen < 20 or current_phosphorus < 15
        declining_trend = nitrogen_trend < -0.5 or phosphorus_trend < -0.3
        
        if low_nutrients or declining_trend:
            return "Apply"
        else:
            return "Delay"
    
    def predict_pest_risk(self, current_data: SensorData, forecast: List[Dict]) -> str:
        """Predict pest risk based on temperature and humidity"""
        current_temp = current_data.temperature
        current_humidity = current_data.humidity
        
        # Check forecast conditions
        forecast_conditions = forecast[:3]
        avg_forecast_temp = np.mean([f["temperature"] for f in forecast_conditions])
        avg_forecast_humidity = np.mean([f["humidity"] for f in forecast_conditions])
        
        # Risk calculation
        temp_risk = current_temp > self.TEMP_PEST_THRESHOLD or avg_forecast_temp > self.TEMP_PEST_THRESHOLD
        humidity_risk = current_humidity > self.HUMIDITY_PEST_THRESHOLD or avg_forecast_humidity > self.HUMIDITY_PEST_THRESHOLD
        
        if temp_risk and humidity_risk:
            return "High"
        elif temp_risk or humidity_risk:
            return "Moderate"
        else:
            return "Low"
    
    def forecast_yield(self, field_id: str = "field_001") -> float:
        """Forecast yield using moving average and trend"""
        # Get historical yields
        yield_history = self.db.query(YieldHistory).filter(
            YieldHistory.field_id == field_id
        ).order_by(YieldHistory.harvest_date.desc()).limit(5).all()
        
        if not yield_history:
            # Default forecast if no history
            return 8.5
        
        yields = [y.yield_amount for y in yield_history]
        
        # Weighted moving average (more recent = higher weight)
        weights = np.array([0.4, 0.3, 0.2, 0.08, 0.02][:len(yields)])
        weights = weights / weights.sum()  # Normalize
        
        base_forecast = np.average(yields, weights=weights)
        
        # Trend detection
        if len(yields) >= 2:
            trend = (yields[0] - yields[-1]) / len(yields)
            # Apply trend with dampening
            trend_factor = 1 + (trend * 0.1)
            forecast = base_forecast * trend_factor
        else:
            forecast = base_forecast
        
        # Seasonal adjustment (simulate)
        seasonal_multiplier = 1.05  # Slight positive adjustment
        forecast = forecast * seasonal_multiplier
        
        return round(forecast, 2)
    
    def generate_recommendations(self, field_id: str = "field_001") -> Dict:
        """Generate all AI recommendations"""
        recent_data = self.get_recent_sensor_data(days=7)
        
        if not recent_data:
            raise ValueError("No sensor data available")
        
        current_data = recent_data[0]
        forecast = self.get_weather_forecast()
        
        # Get recommendations
        irrigation = self.predict_irrigation_need(current_data, forecast)
        fertilizer = self.predict_fertilizer_need(recent_data)
        pest_risk = self.predict_pest_risk(current_data, forecast)
        yield_forecast = self.forecast_yield(field_id)
        
        # Generate alerts
        alerts = []
        if irrigation == "High":
            alerts.append("Critical irrigation needed - soil moisture is low")
        if pest_risk == "High":
            alerts.append("High pest risk detected - consider preventive measures")
        if fertilizer == "Apply":
            alerts.append("Fertilizer application recommended")
        
        # Calculate confidence (simplified)
        confidence = 0.85  # Simulated confidence score
        
        return {
            "irrigation": irrigation,
            "fertilizer": fertilizer,
            "pest_risk": pest_risk,
            "yield_forecast": yield_forecast,
            "confidence": confidence,
            "timestamp": datetime.utcnow(),
            "alerts": alerts
        }


