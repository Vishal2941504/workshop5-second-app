import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import Recommendations from '../components/Recommendations'
import HistoricalCharts from '../components/HistoricalCharts'
import { fetchDashboard, fetchHistoricalData } from '../services/api'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dashboard, historical] = await Promise.all([
        fetchDashboard(),
        fetchHistoricalData()
      ])
      setDashboardData(dashboard)
      setHistoricalData(historical)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message || 'Failed to load data. Make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center bg-white p-6 rounded-lg shadow max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dashboardData?.recommendations?.alerts && dashboardData.recommendations.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p className="font-bold">Alerts:</p>
          {dashboardData.recommendations.alerts.map((alert, i) => (
            <p key={i}>{alert}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Dashboard data={dashboardData} />
        </div>
        <div className="lg:col-span-1">
          <Recommendations recommendations={dashboardData?.recommendations} />
        </div>
      </div>

      {historicalData && <HistoricalCharts data={historicalData} />}
    </div>
  )
}
