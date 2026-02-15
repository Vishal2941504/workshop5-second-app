import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import Recommendations from '../components/Recommendations'
import HistoricalCharts from '../components/HistoricalCharts'
import Alerts from '../components/Alerts'
import { fetchDashboard, fetchHistoricalData } from '../services/api'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 300000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [dashboard, historical] = await Promise.all([
        fetchDashboard(),
        fetchHistoricalData()
      ])
      setDashboardData(dashboard)
      setHistoricalData(historical)
      setError(null)
    } catch (err) {
      const errorMsg = err.message || err.toString() || 'Failed to load dashboard data'
      console.error('Dashboard load error:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-6 rounded-lg shadow">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-sm text-gray-600 mb-4">Make sure the backend server is running on port 8000</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          Warning: {error}
        </div>
      )}

      {/* Alerts Section */}
      {dashboardData?.recommendations?.alerts && dashboardData.recommendations.alerts.length > 0 && (
        <Alerts alerts={dashboardData.recommendations.alerts} />
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Dashboard */}
        <div className="lg:col-span-2">
          <Dashboard data={dashboardData} />
        </div>

        {/* Recommendations Sidebar */}
        <div className="lg:col-span-1">
          <Recommendations recommendations={dashboardData?.recommendations} />
        </div>
      </div>

      {/* Historical Charts */}
      {historicalData && (
        <HistoricalCharts data={historicalData} />
      )}
    </div>
  )
}

