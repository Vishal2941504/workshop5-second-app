import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ErrorBoundary from './components/ErrorBoundary'
import { useState, useEffect } from 'react'
import { fetchDashboard } from './services/api'
import { handleError } from './utils/errorHandler'

function App() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    // Load dashboard data for footer
    fetchDashboard()
      .then(setDashboardData)
      .catch((err) => handleError(err, 'App:fetchDashboard'))
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" role="main">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t mt-12" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-600">
                Last updated: {dashboardData?.last_updated ? new Date(dashboardData.last_updated).toLocaleString() : 'N/A'}
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

