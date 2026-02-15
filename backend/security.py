"""
Security utilities for input validation and sanitization
"""
import re
from typing import Optional
from fastapi import HTTPException

# Allowed field ID pattern (alphanumeric and underscore only)
FIELD_ID_PATTERN = re.compile(r'^[a-zA-Z0-9_]+$')

# Valid recommendation values
VALID_IRRIGATION_LEVELS = ['Low', 'Medium', 'High']
VALID_FERTILIZER_ACTIONS = ['Apply', 'Delay']
VALID_PEST_RISKS = ['Low', 'Moderate', 'High']


def validate_field_id(field_id: str) -> str:
    """Validate and sanitize field ID"""
    if not field_id:
        raise HTTPException(status_code=400, detail="Field ID is required")
    
    if not isinstance(field_id, str):
        raise HTTPException(status_code=400, detail="Field ID must be a string")
    
    # Check length
    if len(field_id) > 50:
        raise HTTPException(status_code=400, detail="Field ID must be 50 characters or less")
    
    # Check pattern (prevent injection)
    if not FIELD_ID_PATTERN.match(field_id):
        raise HTTPException(
            status_code=400,
            detail="Field ID can only contain letters, numbers, and underscores"
        )
    
    return field_id.strip()


def validate_days(days: int) -> int:
    """Validate days parameter"""
    if not isinstance(days, int):
        raise HTTPException(status_code=400, detail="Days must be an integer")
    
    if days < 1:
        raise HTTPException(status_code=400, detail="Days must be at least 1")
    
    if days > 365:
        raise HTTPException(status_code=400, detail="Days cannot exceed 365")
    
    return days


def sanitize_string(value: str, max_length: int = 100) -> str:
    """Sanitize string input"""
    if not isinstance(value, str):
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', value)
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()


