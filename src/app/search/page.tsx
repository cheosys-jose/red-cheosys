import { searchRecords } from '@/lib/meilisearch'
import Link from 'next/link'

interface SearchPageProps {
  searchParams: {
    q?: string
    tipo?: string
    ciudad?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const tipo = searchParams.tipo || ''
  const ciudad = searchParams.ciudad || ''

  // Construir filtros
  const filters: string[] = []
  if (tipo) filters.push(`tipo = "${tipo}"`)
  if (ciudad) filters.push(`ciudad = "${ciudad}"`)

  // Buscar en Meilisearch
  let results: any = { hits: [], estimatedTotalHits: 0, processingTimeMs: 0 }
  try {
    results = await searchRecords(query, filters.length > 0 ? filters : undefined)
  } catch (error) {
    console.error('Error en búsqueda:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con búsqueda */}
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            Red CheoSys
          </Link>
          
          <form action="/search" method="GET" className="mt-4">
            <div className="flex gap-2">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/search"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !tipo ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos
          </Link>
          <Link
            href="/search?tipo=necesita"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipo === 'necesita' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🚨 Necesita
          </Link>
          <Link
            href="/search?tipo=ofrece"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipo === 'ofrece' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🤝 Ofrece
          </Link>
          <Link
            href="/search?tipo=desaparecido"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipo === 'desaparecido' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👤 Desaparecidos
          </Link>
          <Link
            href="/search?tipo=centro"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipo === 'centro' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📍 Centros
          </Link>
        </div>

        {/* Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          {results.estimatedTotalHits > 0 ? (
            <p>
              {results.estimatedTotalHits} resultados encontrados en {results.processingTimeMs}ms
            </p>
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>

        {/* Lista de Resultados */}
        <div className="space-y-4">
          {results.hits.map((hit: any) => (
            <article key={hit.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {hit.titulo || hit.descripcion?.substring(0, 100)}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  hit.tipo === 'necesita' ? 'bg-red-100 text-red-800' :
                  hit.tipo === 'ofrece' ? 'bg-green-100 text-green-800' :
                  hit.tipo === 'desaparecido' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {hit.tipo?.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 mb-3">
                {hit.descripcion?.substring(0, 200)}
                {hit.descripcion?.length > 200 && '...'}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {hit.texto_ubicacion && (
                  <span>📍 {hit.texto_ubicacion}</span>
                )}
                {hit.ciudad && (
                  <span>🏙️ {hit.ciudad}</span>
                )}
                {hit.contacto && (
                  <a href={`tel:${hit.contacto}`} className="text-blue-600 hover:underline">
                    📞 {hit.contacto}
                  </a>
                )}
                {hit.timestamp && (
                  <span>⏰ {new Date(hit.timestamp).toLocaleDateString('es-VE')}</span>
                )}
              </div>

              {hit.tags && hit.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {hit.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* CTA para agregar */}
        {results.estimatedTotalHits === 0 && (
          <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Tienes información que compartir?
            </h3>
            <p className="text-gray-600 mb-4">
              Ayuda a otros agregando centros de acopio, necesidades o personas desaparecidas
            </p>
            <Link
              href="/agregar"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Agregar Información
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
