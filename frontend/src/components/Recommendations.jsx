import { Card } from './Card'

export default function Recommendations({ recommendations }) {
  if (!recommendations) {
    return (
      <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
        No recommendations available
      </div>
    )
  }

  const { irrigation, fertilizer, pest_risk, yield_forecast, confidence } = recommendations
  
  // Validate required fields
  if (!irrigation || !fertilizer || !pest_risk) {
    return (
      <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
        Incomplete recommendations data
      </div>
    )
  }

  const getIrrigationColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPestRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getFertilizerColor = (action) => {
    return action === 'Apply'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <div className="space-y-6" role="region" aria-label="AI Recommendations">
      <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>

      {/* Irrigation Recommendation */}
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Irrigation</h3>
            <p className="text-sm text-gray-600">Watering recommendation</p>
          </div>
          <div className="text-2xl">💧</div>
        </div>
        <div className={`px-4 py-3 rounded-lg border-2 ${getIrrigationColor(irrigation)}`}>
          <p className="font-bold text-lg">{irrigation}</p>
          <p className="text-sm mt-1">
            {irrigation === 'High' && 'Immediate irrigation required'}
            {irrigation === 'Medium' && 'Moderate irrigation recommended'}
            {irrigation === 'Low' && 'Current moisture levels are adequate'}
          </p>
        </div>
      </Card>

      {/* Fertilizer Recommendation */}
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fertilizer</h3>
            <p className="text-sm text-gray-600">Nutrient application</p>
          </div>
          <div className="text-2xl">🌱</div>
        </div>
        <div className={`px-4 py-3 rounded-lg border-2 ${getFertilizerColor(fertilizer)}`}>
          <p className="font-bold text-lg">{fertilizer}</p>
          <p className="text-sm mt-1">
            {fertilizer === 'Apply' && 'Fertilizer application recommended based on nutrient trends'}
            {fertilizer === 'Delay' && 'Nutrient levels are sufficient, no action needed'}
          </p>
        </div>
      </Card>

      {/* Pest Risk */}
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pest Risk</h3>
            <p className="text-sm text-gray-600">Disease & pest alert</p>
          </div>
          <div className="text-2xl">🐛</div>
        </div>
        <div className={`px-4 py-3 rounded-lg border-2 ${getPestRiskColor(pest_risk)}`}>
          <p className="font-bold text-lg">{pest_risk}</p>
          <p className="text-sm mt-1">
            {pest_risk === 'High' && 'High risk conditions detected - monitor closely'}
            {pest_risk === 'Moderate' && 'Moderate risk - preventive measures recommended'}
            {pest_risk === 'Low' && 'Low risk - conditions are favorable'}
          </p>
        </div>
      </Card>

      {/* Confidence Score */}
      <Card>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">AI Confidence</p>
          <div className="relative w-full h-4 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-4 bg-primary-600 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
          <p className="text-sm font-semibold text-gray-900 mt-2">
            {(confidence * 100).toFixed(0)}%
          </p>
        </div>
      </Card>
    </div>
  )
}

