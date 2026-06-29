'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import VisitCounter from '@/components/VisitCounter'
import AlertCard from '@/components/AlertCard'
import ResourceCard from '@/components/ResourceCard'
import MissingPersonCard from '@/components/MissingPersonCard'
import FoundPersonCard from '@/components/FoundPersonCard'
import CenterCard from '@/components/CenterCard'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const pageParam = searchParams.get('page') || '1'
  const limitParam = searchParams.get('limit') || '20'

  const [results, setResults] = useState<any>({ hits: [], estimatedTotalHits: 0, processingTimeMs: 0 })
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const page = parseInt(pageParam)
  const limit = parseInt(limitParam)
  const offset = (page - 1) * limit
  const totalPages = Math.ceil(results.estimatedTotalHits / limit)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (type) params.set('type', type)
        params.set('limit', limit.toString())
        params.set('offset', offset.toString())

        const res = await fetch(`/api/v2/search?${params.toString()}`)
        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query, type, limit, offset])

  if (loading) {
    return <div className="text-center py-12">Buscando...</div>
  }

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type) params.set('type', type)
    params.set('limit', limit.toString())
    params.set('page', pageNum.toString())
    return `/search?${params.toString()}`
  }

  const renderCard = (hit: any) => {
    const isExpanded = expandedCard === hit.id
    const onToggle = () => toggleExpand(hit.id)

    switch (hit.entityType) {
      case 'alerts':
        return <AlertCard key={hit.id} data={hit} expanded={isExpanded} onToggle={onToggle} />
      case 'resources':
        return <ResourceCard key={hit.id} data={hit} expanded={isExpanded} onToggle={onToggle} />
      case 'missing_persons':
        return <MissingPersonCard key={hit.id} data={hit} expanded={isExpanded} onToggle={onToggle} />
      case 'found_persons':
        return <FoundPersonCard key={hit.id} data={hit} expanded={isExpanded} onToggle={onToggle} />
      case 'centers':
        return <CenterCard key={hit.id} data={hit} expanded={isExpanded} onToggle={onToggle} />
      default:
        return null
    }
  }

  return (
    <>
      <VisitCounter />

      {/* Stats y controles */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {results.estimatedTotalHits} resultado(s)
            </p>
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages || 1}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Mostrar:</label>
            <select
              value={limit}
              onChange={(e) => {
                const params = new URLSearchParams()
                if (query) params.set('q', query)
                if (type) params.set('type', type)
                params.set('limit', e.target.value)
                window.location.href = `/search?${params.toString()}`
              }}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="space-y-3">
        {results.hits.map((hit: any) => renderCard(hit))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
              ← Anterior
            </Link>
          )}

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <Link
                  key={pageNum}
                  href={buildPageUrl(pageNum)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
          </div>

          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
              Siguiente →
            </Link>
          )}
        </div>
      )}

      {results.estimatedTotalHits === 0 && (
        <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-4">¿Tienes información que compartir?</p>
          <Link href="/persons/missing" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            Reportar Persona Extraviada
          </Link>
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">Red CheoSys</Link>
          <Link href="/persons/missing" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg">
            + Reportar
          </Link>
        </div>

        <div className="mb-6">
          <form action="/search" method="GET" className="flex gap-2">
            <input
              type="search"
              name="q"
              placeholder="Buscar por nombre, ubicación, descripción..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Buscar
            </button>
          </form>
        </div>

        <div className="mb-6 bg-white rounded-lg p-4 shadow">
          <div className="flex flex-wrap gap-2">
            <Link href="/search" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Todos</Link>
            <Link href="/search?type=alerts" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">🚨 Alertas</Link>
            <Link href="/search?type=resources" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">🤝 Recursos</Link>
            <Link href="/search?type=missing_persons" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">👤 Buscados</Link>
            <Link href="/search?type=found_persons" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">🤝 Encontrados</Link>
            <Link href="/search?type=centers" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">📍 Centros</Link>
          </div>
        </div>

        <Suspense fallback={<div>Cargando resultados...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
