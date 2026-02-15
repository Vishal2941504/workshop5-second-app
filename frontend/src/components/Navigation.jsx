import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Precision Agriculture - Home">
              <span className="text-2xl font-bold text-gray-900">
                🌾 Precision Agriculture
              </span>
            </Link>
          </div>
          <div className="flex space-x-4" role="menubar">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isActive('/')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isActive('/analytics')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
              aria-current={isActive('/analytics') ? 'page' : undefined}
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

