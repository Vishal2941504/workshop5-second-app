import { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { fetchHistoricalData, fetchWeatherForecast, fetchRecommendations } from '../services/api'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function AnalyticsPage() {
  const [historicalData, setHistoricalData] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [historical, forecast, recs] = await Promise.all([
        fetchHistoricalData(30),
        fetchWeatherForecast(),
        fetchRecommendations()
      ])
      setHistoricalData(historical)
      setWeatherForecast(forecast)
      setRecommendations(recs)
    } catch (err) {
      // Error handling - in production this would go to error tracking
      // For now, we'll show a user-friendly message
      setHistoricalData(null)
      setWeatherForecast(null)
      setRecommendations(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const sensorData = historicalData?.sensor_data || []
  const dailyAverages = []
  
  // Group by day and calculate averages
  const dataByDay = {}
  sensorData.forEach(d => {
    const date = new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!dataByDay[date]) {
      dataByDay[date] = { date, moisture: [], temp: [], humidity: [], n: [], p: [], k: [] }
    }
    dataByDay[date].moisture.push(d.soil_moisture)
    dataByDay[date].temp.push(d.temperature)
    dataByDay[date].humidity.push(d.humidity)
    dataByDay[date].n.push(d.soil_nitrogen)
    dataByDay[date].p.push(d.soil_phosphorus)
    dataByDay[date].k.push(d.soil_potassium)
  })

  Object.keys(dataByDay).forEach(date => {
    const day = dataByDay[date]
    dailyAverages.push({
      date,
      moisture: (day.moisture.reduce((a, b) => a + b, 0) / day.moisture.length).toFixed(1),
      temperature: (day.temp.reduce((a, b) => a + b, 0) / day.temp.length).toFixed(1),
      humidity: (day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length).toFixed(1),
      nitrogen: (day.n.reduce((a, b) => a + b, 0) / day.n.length).toFixed(1),
      phosphorus: (day.p.reduce((a, b) => a + b, 0) / day.p.length).toFixed(1),
      potassium: (day.k.reduce((a, b) => a + b, 0) / day.k.length).toFixed(1)
    })
  })

  const yieldData = historicalData?.yield_history?.map(y => ({
    season: y.season,
    yield: y.yield_amount
  })) || []

  // Show error state if data failed to load
  if (!historicalData && !loading) {
    return (
      <div className="text-center py-12" role="alert">
        <p className="text-red-600 mb-4">Failed to load analytics data</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Retry loading analytics data"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6" role="region" aria-label="Advanced Analytics">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📊 Advanced Analytics</h2>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Refresh analytics data"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Soil Moisture</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {dailyAverages.length > 0 
                ? (dailyAverages.reduce((sum, d) => sum + parseFloat(d.moisture), 0) / dailyAverages.length).toFixed(1)
                : '0'}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Temperature</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {dailyAverages.length > 0
                ? (dailyAverages.reduce((sum, d) => sum + parseFloat(d.temperature), 0) / dailyAverages.length).toFixed(1)
                : '0'}°C
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">AI Confidence</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {recommendations ? (recommendations.confidence * 100).toFixed(0) : '0'}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Data Points</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {sensorData.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Comprehensive Nutrient Analysis */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrient Trends (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyAverages.slice(-14)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'ppm', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="nitrogen" stroke="#ef4444" strokeWidth={2} name="Nitrogen (N)" />
            <Line type="monotone" dataKey="phosphorus" stroke="#3b82f6" strokeWidth={2} name="Phosphorus (P)" />
            <Line type="monotone" dataKey="potassium" stroke="#10b981" strokeWidth={2} name="Potassium (K)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weather Forecast */}
      {weatherForecast && weatherForecast.forecast && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Weather Forecast</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weatherForecast.forecast.map(f => ({
              ...f,
              date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="temperature" fill="#ef4444" name="Temperature (°C)" />
              <Bar dataKey="humidity" fill="#3b82f6" name="Humidity (%)" />
              <Bar dataKey="rainfall" fill="#10b981" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Combined Environmental Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Moisture vs Temperature</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyAverages.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" label={{ value: 'Moisture (%)', angle: -90 }} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Temp (°C)', angle: 90 }} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="moisture" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Moisture (%)" />
              <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield History & Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" tick={{ fontSize: 12 }} />
              <YAxis label={{ value: 'Yield (tons/hectare)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" fill="#16a34a" name="Yield (tons/hectare)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recommendations Summary */}
      {recommendations && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Irrigation</p>
              <p className="text-2xl font-bold text-blue-600">{recommendations.irrigation}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Fertilizer</p>
              <p className="text-2xl font-bold text-green-600">{recommendations.fertilizer}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pest Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{recommendations.pest_risk}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

