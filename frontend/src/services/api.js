import axios from 'axios'

// Simple API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
})

export const fetchDashboard = () => api.get('/dashboard').then(r => r.data)
export const fetchRecommendations = () => api.get('/recommendations').then(r => r.data)
export const fetchHistoricalData = (days = 30) => api.get('/historical', { params: { days } }).then(r => r.data)
export const fetchWeatherForecast = () => api.get('/weather-forecast').then(r => r.data)
