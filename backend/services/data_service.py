from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from models import SensorData, YieldHistory
import random
import numpy as np

class DataService:
    """Service for managing sensor data and historical records"""
    
    @staticmethod
    def seed_mock_data():
        """Generate 30 days of mock sensor data"""
        db = SessionLocal()
        try:
            # Check if data already exists
            existing = db.query(SensorData).first()
            if existing:
                return  # Data already seeded
            
            # Generate 30 days of data
            base_date = datetime.utcnow() - timedelta(days=30)
            
            for day in range(30):
                # Generate 4 readings per day (every 6 hours)
                for hour_offset in [0, 6, 12, 18]:
                    timestamp = base_date + timedelta(days=day, hours=hour_offset)
                    
                    # Simulate realistic variations
                    soil_moisture = 40 + random.uniform(-10, 20) + (day * 0.5)  # Gradual trend
                    soil_nitrogen = 25 + random.uniform(-5, 10)
                    soil_phosphorus = 18 + random.uniform(-3, 8)
                    soil_potassium = 200 + random.uniform(-30, 50)
                    temperature = 22 + random.uniform(-5, 8) + (5 * np.sin(day / 7))  # Weekly cycle
                    humidity = 60 + random.uniform(-15, 20)
                    rainfall = random.uniform(0, 10) if random.random() > 0.85 else 0
                    
                    sensor_data = SensorData(
                        timestamp=timestamp,
                        soil_moisture=round(soil_moisture, 2),
                        soil_nitrogen=round(soil_nitrogen, 2),
                        soil_phosphorus=round(soil_phosphorus, 2),
                        soil_potassium=round(soil_potassium, 2),
                        temperature=round(temperature, 2),
                        humidity=round(humidity, 2),
                        rainfall=round(rainfall, 2),
                        field_id="field_001"
                    )
                    db.add(sensor_data)
            
            # Seed yield history
            seasons = ["2020-2021", "2021-2022", "2022-2023", "2023-2024"]
            base_yield = 7.5
            
            for i, season in enumerate(seasons):
                # Simulate yield with some trend
                yield_amount = base_yield + random.uniform(-0.5, 1.5) + (i * 0.3)
                harvest_date = datetime.utcnow() - timedelta(days=365 * (len(seasons) - i))
                
                yield_record = YieldHistory(
                    season=season,
                    crop_type="Corn",
                    yield_amount=round(yield_amount, 2),
                    field_id="field_001",
                    harvest_date=harvest_date
                )
                db.add(yield_record)
            
            db.commit()
        finally:
            db.close()
    
    @staticmethod
    def get_latest_sensor_data(db: Session, field_id: str = "field_001") -> SensorData:
        """Get the most recent sensor reading"""
        return db.query(SensorData).filter(
            SensorData.field_id == field_id
        ).order_by(SensorData.timestamp.desc()).first()
    
    @staticmethod
    def get_historical_sensor_data(db: Session, days: int = 30, field_id: str = "field_001") -> list:
        """Get historical sensor data"""
        cutoff = datetime.utcnow() - timedelta(days=days)
        return db.query(SensorData).filter(
            SensorData.field_id == field_id,
            SensorData.timestamp >= cutoff
        ).order_by(SensorData.timestamp.asc()).all()
    
    @staticmethod
    def get_yield_history(db: Session, field_id: str = "field_001") -> list:
        """Get yield history"""
        return db.query(YieldHistory).filter(
            YieldHistory.field_id == field_id
        ).order_by(YieldHistory.harvest_date.asc()).all()

