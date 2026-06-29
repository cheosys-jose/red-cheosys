'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [dateData, setDateData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/metrics/visit')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetch(`/api/metrics/visit?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => setDateData(data))
        .catch(console.error)
    }
  }, [selectedDate])

  if (!metrics) {
    return <div className="min-h-screen flex items-center justify-center">Cargando métricas...</div>
  }

  const topCountries = Object.entries(metrics.countries || {})
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 10)

  const topCities = Object.entries(metrics.cities || {})
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 10)

  const recentDates = Object.keys(metrics.visitsByDate || {})
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 30)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📊 Métricas de Visitas</h1>
          <Link href="/search" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            ← Volver
          </Link>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Visitas Totales</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.totalVisits?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Visitantes Únicos</p>
            <p className="text-3xl font-bold text-green-600">{metrics.uniqueVisitors?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Países</p>
            <p className="text-3xl font-bold text-purple-600">{Object.keys(metrics.countries || {}).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Días con actividad</p>
            <p className="text-3xl font-bold text-orange-600">{Object.keys(metrics.dailyVisits || {}).length}</p>
          </div>
        </div>

        {/* Dispositivos y Navegadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">📱 Dispositivos</h3>
            <div className="space-y-2">
              {Object.entries(metrics.devices || {}).map(([device, count]) => (
                <div key={device} className="flex justify-between">
                  <span>{device}</span>
                  <span className="font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">🌐 Navegadores</h3>
            <div className="space-y-2">
              {Object.entries(metrics.browsers || {}).map(([browser, count]) => (
                <div key={browser} className="flex justify-between">
                  <span>{browser}</span>
                  <span className="font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">💻 Sistemas Operativos</h3>
            <div className="space-y-2">
              {Object.entries(metrics.operatingSystems || {}).map(([os, count]) => (
                <div key={os} className="flex justify-between">
                  <span>{os}</span>
                  <span className="font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Países y Ciudades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">🌍 Top Países</h3>
            <div className="space-y-2">
              {topCountries.map(([country, count]) => (
                <div key={country} className="flex justify-between items-center">
                  <span>{country}</span>
                  <span className="font-semibold bg-blue-100 px-2 py-1 rounded">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">🏙️ Top Ciudades</h3>
            <div className="space-y-2">
              {topCities.map(([city, count]) => (
                <div key={city} className="flex justify-between items-center">
                  <span className="text-sm">{city}</span>
                  <span className="font-semibold bg-green-100 px-2 py-1 rounded">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visitas por Fecha */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-3">📅 Visitas por Fecha</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {recentDates.map(date => {
              const dateInfo = metrics.visitsByDate[date]
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded border-2 transition-all ${
                    selectedDate === date 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{date}</p>
                  <p className="text-xs text-gray-600">{dateInfo.total} visitas</p>
                  <p className="text-xs text-gray-500">{dateInfo.unique} únicas</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detalle de Fecha Seleccionada */}
        {selectedDate && dateData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-3">📊 Detalle del {selectedDate}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Total: {dateData.total}</h4>
                <h4 className="font-semibold mb-2">Únicas: {dateData.unique}</h4>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Por País:</h4>
                {Object.entries(dateData.countries || {}).map(([country, count]) => (
                  <div key={country} className="flex justify-between text-sm">
                    <span>{country}</span>
                    <span>{count as number}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Por Hora:</h4>
                {Object.entries(dateData.hours || {})
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([hour, count]) => (
                    <div key={hour} className="flex justify-between text-sm">
                      <span>{hour}:00</span>
                      <span>{count as number}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
