'use client'

import { useState, useEffect } from 'react'

export default function VisitCounter() {
  const [metrics, setMetrics] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    countries: {} as Record<string, number>,
    userCountry: ''
  })

  useEffect(() => {
    // Registrar visita
    fetch('/api/metrics/visit', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetrics(prev => ({
            ...prev,
            userCountry: data.country
          }))
        }
      })
      .catch(console.error)
    
    // Obtener métricas totales
    fetch('/api/metrics/visit')
      .then(res => res.json())
      .then(data => {
        setMetrics({
          totalVisits: data.totalVisits || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          countries: data.countries || {},
          userCountry: ''
        })
      })
      .catch(console.error)
  }, [])

  // Obtener top 5 países
  const topCountries = Object.entries(metrics.countries)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-xs border border-gray-200 z-50 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">👁️</span>
        <div>
          <p className="font-bold text-gray-900">{metrics.totalVisits.toLocaleString()} visitas</p>
          <p className="text-gray-500">{metrics.uniqueVisitors.toLocaleString()} únicas</p>
        </div>
      </div>
      
      {metrics.userCountry && (
        <p className="text-xs text-gray-600 mb-2">
          🌍 Visitante desde: <strong>{metrics.userCountry}</strong>
        </p>
      )}
      
      {topCountries.length > 0 && (
        <div className="border-t pt-2 mt-2">
          <p className="font-semibold text-gray-700 mb-1">📊 Top países:</p>
          <ul className="space-y-1">
            {topCountries.map(([country, count]) => (
              <li key={country} className="flex justify-between text-gray-600">
                <span>{country}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
