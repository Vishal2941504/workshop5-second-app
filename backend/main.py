from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from datetime import datetime, timedelta
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db, get_db
from models import SensorData
from services.ai_service import AIService
from services.data_service import DataService
from api.routes import router
from middleware import RateLimitMiddleware, SecurityHeadersMiddleware

# Startup event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data
    init_db()
    DataService.seed_mock_data()
    yield
    # Cleanup if needed

app = FastAPI(
    title="Precision Agriculture Decision Platform API",
    description="AI-powered agricultural recommendations",
    version="1.0.0",
    lifespan=lifespan
)

# Security middleware (must be added first)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)

# CORS middleware - Simple configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Handle HTTP exceptions with standardized format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all other exceptions - don't expose internal details in production"""
    import traceback
    
    # Log full error in development
    if os.getenv("ENVIRONMENT") != "production":
        print(f"Unhandled exception: {exc}")
        traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An internal server error occurred" if os.getenv("ENVIRONMENT") == "production" else str(exc),
            "status_code": 500,
            "timestamp": datetime.now().isoformat()
        }
    )

# Include routers
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Precision Agriculture Decision Platform API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)

