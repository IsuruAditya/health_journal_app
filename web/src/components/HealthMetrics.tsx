import { TrendingUp, TrendingDown, Minus, Calendar, Activity, AlertTriangle } from 'lucide-react'
import type { HealthRecord } from '@/types'
import { getSeverityLabel } from '@/lib/utils'

interface HealthMetricsProps {
  records: HealthRecord[]
}

export function HealthMetrics({ records }: HealthMetricsProps) {
  const totalRecords = records.length
  const recentRecords = records.filter(r => {
    const recordDate = new Date(r.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return recordDate >= thirtyDaysAgo
  })

  const avgSeverity = records.length > 0 
    ? records.filter(r => r.severity).reduce((sum, r) => sum + (r.severity || 0), 0) / records.filter(r => r.severity).length
    : 0

  const severityTrend = (() => {
    if (records.length < 2) return 'stable'
    const recent = records.slice(0, 5).filter(r => r.severity).map(r => r.severity || 0)
    const older = records.slice(5, 10).filter(r => r.severity).map(r => r.severity || 0)
    
    if (recent.length === 0 || older.length === 0) return 'stable'
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    
    if (recentAvg > olderAvg + 0.5) return 'increasing'
    if (recentAvg < olderAvg - 0.5) return 'decreasing'
    return 'stable'
  })()

  const highSeverityCount = records.filter(r => (r.severity || 0) >= 7).length

  const metrics = [
    {
      label: 'Total Records',
      value: totalRecords,
      icon: Calendar,
      color: 'blue',
      description: 'All time'
    },
    {
      label: 'This Month',
      value: recentRecords.length,
      icon: Activity,
      color: 'green',
      description: 'Last 30 days'
    },
    {
      label: 'Avg Severity',
      value: avgSeverity.toFixed(1),
      icon: severityTrend === 'increasing' ? TrendingUp : severityTrend === 'decreasing' ? TrendingDown : Minus,
      color: avgSeverity >= 6 ? 'red' : avgSeverity >= 4 ? 'orange' : 'green',
      description: getSeverityLabel(Math.round(avgSeverity)),
      trend: severityTrend
    },
    {
      label: 'High Severity',
      value: highSeverityCount,
      icon: AlertTriangle,
      color: highSeverityCount > 0 ? 'red' : 'gray',
      description: 'Severity ≥ 7'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
    gray: 'bg-muted border-border text-muted-foreground'
  }

  const iconColorClasses = {
    blue: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-500/20 text-red-600 dark:text-red-400',
    gray: 'bg-muted text-muted-foreground'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${colorClasses[metric.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${iconColorClasses[metric.color as keyof typeof iconColorClasses]}`}>
                <Icon className="h-4 w-4" />
              </div>
              {metric.trend && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  metric.trend === 'increasing' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                  metric.trend === 'decreasing' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {metric.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-medium opacity-75 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs opacity-75 mt-1">{metric.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}