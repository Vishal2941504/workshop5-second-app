import { Card } from './Card'

export default function Alerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="mb-6">
      <Card className="bg-yellow-50 border-yellow-300">
        <div className="flex items-start">
          <div className="text-2xl mr-3">⚠️</div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">Active Alerts</h3>
            <ul className="space-y-2">
              {alerts.map((alert, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}


