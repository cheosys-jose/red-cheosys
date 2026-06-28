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
          <article key={hit.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-900">{hit.titulo || hit.descripcion?.substring(0, 100)}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                hit.tipo === 'necesita' ? 'bg-red-100 text-red-800' :
                hit.tipo === 'ofrece' ? 'bg-green-100 text-green-800' :
                hit.tipo === 'desaparecido' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {hit.tipo?.toUpperCase()}
              </span>
            </div>

            {/* IMÁGENES - Usar URL directa de /api/images/ */}
            {hit.imagenes && hit.imagenes.length > 0 && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {hit.imagenes.map((img: string, idx: number) => {
                  // Convertir /images/... a /api/images/...
                  const imageUrl = img.startsWith('/api/') ? img : `/api${img}`
                  
                  return (
                    <img
                      key={idx}
                      src={imageUrl}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                      onError={(e) => {
                        console.error('❌ Error cargando imagen:', imageUrl)
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                      onLoad={() => console.log('✅ Imagen cargada:', imageUrl)}
                    />
                  )
                })}
              </div>
            )}

            <p className="text-gray-700 mb-4">{hit.descripcion}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t pt-4">
              {hit.texto_ubicacion && <span>📍 {hit.texto_ubicacion}</span>}
              {hit.ciudad && <span>🏙️ {hit.ciudad}</span>}
              {hit.contacto && <a href={`tel:${hit.contacto}`} className="text-blue-600 hover:underline">📞 {hit.contacto}</a>}
              {hit.timestamp && <span>⏰ {new Date(hit.timestamp).toLocaleDateString('es-VE')}</span>}
            </div>
          </article>
        ))}
      </div>

      {results.estimatedTotalHits === 0 && (
        <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes información que compartir?</h3>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">Red CheoSys</Link>
          <Link href="/agregar" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg">
            + Agregar Información
          </Link>
        </div>

        <div className="mb-6">
          <form action="/search" method="GET" className="flex gap-2">
            <input type="search" name="q" placeholder="Buscar..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
