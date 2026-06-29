'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import VisitCounter from '@/components/VisitCounter'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const tipo = searchParams.get('tipo') || ''
  const pageParam = searchParams.get('page') || '1'
  const limitParam = searchParams.get('limit') || '10'

  const [results, setResults] = useState<any>({ hits: [], estimatedTotalHits: 0, processingTimeMs: 0 })
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const page = parseInt(pageParam)
  const limit = parseInt(limitParam)
  const totalPages = Math.ceil(results.estimatedTotalHits / limit)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (tipo) params.set('tipo', tipo)
        params.set('limit', limit.toString())

        const res = await fetch(`/api/search?${params.toString()}`)
        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query, tipo, limit])

  if (loading) {
    return <div className="text-center py-12">Buscando...</div>
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'necesita': return '🚨'
      case 'ofrece': return '🤝'
      case 'desaparecido': return '👤'
      case 'centro': return '📍'
      default: return '📋'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'necesita': return 'border-l-red-500 hover:bg-red-50'
      case 'ofrece': return 'border-l-green-500 hover:bg-green-50'
      case 'desaparecido': return 'border-l-yellow-500 hover:bg-yellow-50'
      case 'centro': return 'border-l-blue-500 hover:bg-blue-50'
      default: return 'border-l-gray-500 hover:bg-gray-50'
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (tipo) params.set('tipo', tipo)
    params.set('limit', limit.toString())
    params.set('page', pageNum.toString())
    return `/search?${params.toString()}`
  }

  return (
    <>
      <VisitCounter />

      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {results.estimatedTotalHits} resultado(s)
            </p>
            <p className="text-sm text-gray-500">
              Pagina {page} de {totalPages || 1} - {results.processingTimeMs}ms
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Mostrar:</label>
            <select
              value={limit}
              onChange={(e) => {
                const params = new URLSearchParams()
                if (query) params.set('q', query)
                if (tipo) params.set('tipo', tipo)
                params.set('limit', e.target.value)
                window.location.href = `/search?${params.toString()}`
              }}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {results.hits.map((hit: any) => (
          <article
            key={hit.id}
            className={`bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 cursor-pointer ${getTipoColor(hit.tipo)}`}
            onClick={() => toggleExpand(hit.id)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTipoIcon(hit.tipo)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {hit.nombre || hit.titulo || 'Sin titulo'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {hit.descripcion}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  hit.tipo === 'necesita' ? 'bg-red-600 text-white' :
                  hit.tipo === 'ofrece' ? 'bg-green-600 text-white' :
                  hit.tipo === 'desaparecido' ? 'bg-yellow-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {hit.tipo}
                </span>
              </div>

              {expandedCard === hit.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <p className="text-gray-700">{hit.descripcion}</p>

                  {hit.imagenes && hit.imagenes.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                      {hit.imagenes.map((img: string, idx: number) => {
                        const imageUrl = img.startsWith('/api/') ? img : `/api${img}`
                        return (
                          <img
                            key={idx}
                            src={imageUrl}
                            alt={`Imagen ${idx + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        )
                      })}
                    </div>
                  )}

                  <div className="space-y-1 text-sm">
                    {hit.texto_ubicacion && (
                      <p><span className="font-semibold">📍</span> {hit.texto_ubicacion}</p>
                    )}
                    {hit.ciudad && (
                      <p><span className="font-semibold">🏙️</span> {hit.ciudad}{hit.estado && `, ${hit.estado}`}</p>
                    )}
                    {hit.contacto && (
                      <p><span className="font-semibold">📞</span> <a href={`tel:${hit.contacto}`} className="text-blue-600 hover:underline">{hit.contacto}</a></p>
                    )}
                    {hit.horario && (
                      <p><span className="font-semibold">🕐</span> {hit.horario}</p>
                    )}
                    {hit.timestamp && (
                      <p className="text-xs text-gray-500">
                        ⏰ {new Date(hit.timestamp).toLocaleString('es-VE')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-2 text-center">
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  {expandedCard === hit.id ? '▲ Mostrar menos' : '▼ Ver mas detalles'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

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
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes informacion que compartir?</h3>
          <p className="text-gray-600 mb-4">Ayuda a otros agregando centros de acopio, necesidades o personas desaparecidas</p>
          <Link href="/agregar" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            Agregar Informacion
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
          <Link href="/agregar" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg">
            + Agregar Informacion
          </Link>
        </div>

        <div className="mb-6">
          <form action="/search" method="GET" className="flex gap-2">
            <input
              type="search"
              name="q"
              placeholder="Buscar por nombre, ubicacion, descripcion..."
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
            <Link href="/search?tipo=necesita" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">🚨 Necesita</Link>
            <Link href="/search?tipo=ofrece" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">🤝 Ofrece</Link>
            <Link href="/search?tipo=desaparecido" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">👤 Desaparecidos</Link>
            <Link href="/search?tipo=centro" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">📍 Centros</Link>
          </div>
        </div>

        <Suspense fallback={<div>Cargando resultados...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
