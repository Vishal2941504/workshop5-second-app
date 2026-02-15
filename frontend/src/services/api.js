import axios from 'axios'
import { handleError } from '../utils/errorHandler'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    handleError(error, 'API:Request')
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      handleError(error, `API:Response:${status}`)
      
      // Return user-friendly error message
      const errorMessage = data?.message || data?.detail || `Server error: ${status}`
      return Promise.reject(new Error(errorMessage))
    } else if (error.request) {
      // Request made but no response
      handleError(error, 'API:NoResponse')
      return Promise.reject(new Error('Network error: Unable to reach server'))
    } else {
      // Something else happened
      handleError(error, 'API:Unknown')
      return Promise.reject(new Error('An unexpected error occurred'))
    }
  }
)

export const fetchDashboard = async () => {
  try {
    const response = await api.get('/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchRecommendations = async () => {
  try {
    const response = await api.get('/recommendations')
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchHistoricalData = async (days = 30) => {
  try {
    // Validate days parameter
    const validDays = Math.max(1, Math.min(365, parseInt(days) || 30))
    const response = await api.get('/historical', { params: { days: validDays } })
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchSensorData = async (days = 7) => {
  try {
    // Validate days parameter
    const validDays = Math.max(1, Math.min(365, parseInt(days) || 7))
    const response = await api.get('/sensor-data', { params: { days: validDays } })
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchWeatherForecast = async () => {
  try {
    const response = await api.get('/weather-forecast')
    return response.data
  } catch (error) {
    throw error
  }
}

