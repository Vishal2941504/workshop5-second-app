import { Card } from './Card'

export default function Dashboard({ data }) {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
        No data available
      </div>
    )
  }

  const { current_soil_moisture, current_nutrients, current_weather, yield_forecast } = data
  
  // Validate data exists
  if (!current_nutrients || !current_weather) {
    return (
      <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
        Incomplete data available
      </div>
    )
  }

  const getMoistureColor = (moisture) => {
    if (moisture < 30) return 'text-red-600'
    if (moisture < 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Low'
    if (moisture < 50) return 'Moderate'
    return 'Optimal'
  }

  return (
    <div className="space-y-6" role="region" aria-label="Field Dashboard">
      <h2 className="text-xl font-semibold text-gray-900">Field Dashboard</h2>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Soil Moisture */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Soil Moisture</p>
              <p className={`text-2xl font-bold mt-1 ${getMoistureColor(current_soil_moisture)}`}>
                {current_soil_moisture.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {getMoistureStatus(current_soil_moisture)}
              </p>
            </div>
            <div className="text-3xl">💧</div>
          </div>
        </Card>

        {/* Temperature */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {current_weather.temperature.toFixed(1)}°C
              </p>
              <p className="text-xs text-gray-500 mt-1">Current</p>
            </div>
            <div className="text-3xl">🌡️</div>
          </div>
        </Card>

        {/* Humidity */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {current_weather.humidity.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Relative</p>
            </div>
            <div className="text-3xl">💨</div>
          </div>
        </Card>

        {/* Rainfall */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rainfall</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {current_weather.rainfall.toFixed(1)}mm
              </p>
              <p className="text-xs text-gray-500 mt-1">Today</p>
            </div>
            <div className="text-3xl">🌧️</div>
          </div>
        </Card>
      </div>

      {/* Nutrient Levels */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrient Levels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nitrogen (N)</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{current_nutrients.nitrogen.toFixed(1)} ppm</span>
                <span className={current_nutrients.nitrogen < 20 ? 'text-red-600' : 'text-green-600'}>
                  {current_nutrients.nitrogen < 20 ? 'Low' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    current_nutrients.nitrogen < 20 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((current_nutrients.nitrogen / 40) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Phosphorus (P)</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{current_nutrients.phosphorus.toFixed(1)} ppm</span>
                <span className={current_nutrients.phosphorus < 15 ? 'text-red-600' : 'text-green-600'}>
                  {current_nutrients.phosphorus < 15 ? 'Low' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    current_nutrients.phosphorus < 15 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((current_nutrients.phosphorus / 30) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Potassium (K)</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{current_nutrients.potassium.toFixed(1)} ppm</span>
                <span className={current_nutrients.potassium < 150 ? 'text-red-600' : 'text-green-600'}>
                  {current_nutrients.potassium < 150 ? 'Low' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    current_nutrients.potassium < 150 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((current_nutrients.potassium / 300) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Yield Forecast */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Yield Forecast</h3>
            <p className="text-sm text-gray-600 mt-1">Next Season Prediction</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {yield_forecast.toFixed(2)} tons/hectare
            </p>
          </div>
          <div className="text-5xl">🌾</div>
        </div>
      </Card>
    </div>
  )
}

