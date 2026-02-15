import { Card } from './Card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function HistoricalCharts({ data }) {
  if (!data || !data.sensor_data) return null

  // Prepare soil moisture data
  const moistureData = data.sensor_data
    .filter((d, index) => index % 4 === 0) // Sample every 4th point for performance
    .map(d => ({
      date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moisture: d.soil_moisture,
      temperature: d.temperature,
      humidity: d.humidity
    }))

  // Prepare yield history
  const yieldData = data.yield_history?.map(y => ({
    season: y.season,
    yield: y.yield_amount
  })) || []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Historical Trends</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Moisture Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Moisture Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                label={{ value: 'Moisture (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
                name="Soil Moisture (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Weather Trend Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Trends (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Yield History Chart */}
      {yieldData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="season"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: 'Yield (tons/hectare)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="yield"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.3}
                name="Yield (tons/hectare)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}


