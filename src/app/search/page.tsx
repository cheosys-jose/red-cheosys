import { searchRecords } from '@/lib/meilisearch'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  const filters: string[] = []
  if (tipo) filters.push(`tipo = "${tipo}"`)
  if (ciudad) filters.push(`ciudad = "${ciudad}"`)

  let results: any = { hits: [], estimatedTotalHits: 0, processingTimeMs: 0 }
  try {
    results = await searchRecords(query, filters.length > 0 ? filters : undefined)
  } catch (error) {
    console.error('Error en búsqueda:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">
            Red CheoSys
          </Link>
          <Link
            href="/agregar"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg"
          >
            + Agregar Información
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <form action="/search" method="GET" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Buscar por ubicación, descripción..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold text-gray-700 mb-3">Filtros</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !tipo ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </Link>
            <Link
              href="/search?tipo=necesita"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipo === 'necesita' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚨 Necesita
            </Link>
            <Link
              href="/search?tipo=ofrece"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipo === 'ofrece' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤝 Ofrece
            </Link>
            <Link
              href="/search?tipo=desaparecido"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipo === 'desaparecido' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👤 Desaparecidos
            </Link>
            <Link
              href="/search?tipo=centro"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipo === 'centro' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📍 Centros
            </Link>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          {results.estimatedTotalHits > 0 ? (
            <p>
              <strong>{results.estimatedTotalHits}</strong> resultado(s) encontrado(s) en {results.processingTimeMs}ms
            </p>
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>

        {/* Lista de Resultados */}
        <div className="space-y-4">
          {results.hits.map((hit: any) => (
            <article key={hit.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
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

              {/* Imágenes */}
              {hit.imagenes && hit.imagenes.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hit.imagenes.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ))}
                </div>
              )}

              <p className="text-gray-700 mb-4">
                {hit.descripcion}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t pt-4">
                {hit.texto_ubicacion && (
                  <span className="flex items-center gap-1">
                    📍 {hit.texto_ubicacion}
                  </span>
                )}
                {hit.ciudad && (
                  <span className="flex items-center gap-1">
                    🏙️ {hit.ciudad}
                  </span>
                )}
                {hit.contacto && (
                  <a href={`tel:${hit.contacto}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                    📞 {hit.contacto}
                  </a>
                )}
                {hit.timestamp && (
                  <span className="flex items-center gap-1">
                    ⏰ {new Date(hit.timestamp).toLocaleDateString('es-VE')}
                  </span>
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
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Agregar Información
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
