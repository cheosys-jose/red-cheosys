'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const tipo = searchParams.get('tipo') || ''

  const [results, setResults] = useState<any>({ hits: [], estimatedTotalHits: 0, processingTimeMs: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (tipo) params.set('tipo', tipo)

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
  }, [query, tipo])

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
      case 'necesita': return 'border-l-red-500 bg-red-50'
      case 'ofrece': return 'border-l-green-500 bg-green-50'
      case 'desaparecido': return 'border-l-yellow-500 bg-yellow-50'
      case 'centro': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        {results.estimatedTotalHits > 0 ? (
          <p><strong>{results.estimatedTotalHits}</strong> resultado(s) en {results.processingTimeMs}ms</p>
        ) : (
          <p>No se encontraron resultados</p>
        )}
      </div>

      <div className="space-y-4">
        {results.hits.map((hit: any) => (
          <article 
            key={hit.id} 
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 ${getTipoColor(hit.tipo)}`}
          >
            <div className="p-6">
              {/* Header con tipo y fecha */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{getTipoIcon(hit.tipo)}</span>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      hit.tipo === 'necesita' ? 'bg-red-600 text-white' :
                      hit.tipo === 'ofrece' ? 'bg-green-600 text-white' :
                      hit.tipo === 'desaparecido' ? 'bg-yellow-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {hit.tipo}
                    </span>
                    {hit.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(hit.timestamp).toLocaleDateString('es-VE', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nombre/Título principal */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {hit.nombre || hit.titulo || 'Sin título'}
              </h2>

              {/* Descripción */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {hit.descripcion}
              </p>

              {/* Imágenes */}
              {hit.imagenes && hit.imagenes.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hit.imagenes.map((img: string, idx: number) => {
                    const imageUrl = img.startsWith('/api/') ? img : `/api${img}`
                    return (
                      <img
                        key={idx}
                        src={imageUrl}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                        onError={(e) => {
                          console.error('Error cargando imagen:', imageUrl)
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {/* Información de contacto y ubicación */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {hit.texto_ubicacion && (
                  <div className="flex items-start gap-2">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Ubicación</p>
                      <p className="text-sm text-gray-600">{hit.texto_ubicacion}</p>
                    </div>
                  </div>
                )}

                {hit.ciudad && hit.ciudad !== hit.texto_ubicacion && (
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🏙️</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Ciudad</p>
                      <p className="text-sm text-gray-600">
                        {hit.ciudad}
                        {hit.estado && `, ${hit.estado}`}
                        {hit.pais && `, ${hit.pais}`}
                      </p>
                    </div>
                  </div>
                )}

                {hit.contacto && (
                  <div className="flex items-start gap-2">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Contacto</p>
                      <a 
                        href={`tel:${hit.contacto}`} 
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        {hit.contacto}
                      </a>
                    </div>
                  </div>
                )}

                {hit.horario && (
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🕐</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Horario</p>
                      <p className="text-sm text-gray-600">{hit.horario}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {hit.tags && hit.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {hit.tags.map((tag: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {results.estimatedTotalHits === 0 && (
        <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes información que compartir?</h3>
          <p className="text-gray-600 mb-4">Ayuda a otros agregando centros de acopio, necesidades o personas desaparecidas</p>
          <Link href="/agregar" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            Agregar Información
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
            + Agregar Información
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
