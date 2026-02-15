import axios from 'axios'

// Simple API configuration
// For production, set VITE_API_URL in AWS Amplify environment variables
// For local development, defaults to localhost
const getApiUrl = () => {
  // Check if VITE_API_URL is set (from environment variable)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // For local development
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api/v1'
  }
  
  // For production - return empty or a placeholder
  // User needs to set VITE_API_URL in Amplify environment variables
  return ''
}

const API_URL = getApiUrl()

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

// Add error handling for missing API URL
if (!API_URL && typeof window !== 'undefined') {
  console.warn('⚠️ VITE_API_URL not set. API calls will fail. Set it in AWS Amplify environment variables.')
}

export const fetchDashboard = () => {
  if (!API_URL) {
    return Promise.reject(new Error('API URL not configured. Please set VITE_API_URL in environment variables.'))
  }
  return api.get('/dashboard').then(r => r.data)
}

export const fetchRecommendations = () => {
  if (!API_URL) {
    return Promise.reject(new Error('API URL not configured'))
  }
  return api.get('/recommendations').then(r => r.data)
}

export const fetchHistoricalData = (days = 30) => {
  if (!API_URL) {
    return Promise.reject(new Error('API URL not configured'))
  }
  return api.get('/historical', { params: { days } }).then(r => r.data)
}

export const fetchWeatherForecast = () => {
  if (!API_URL) {
    return Promise.reject(new Error('API URL not configured'))
  }
  return api.get('/weather-forecast').then(r => r.data)
}
