import { searchRecords } from '@/lib/meilisearch'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CentrosPage() {
  let results: any = { hits: [], estimatedTotalHits: 0 }
  
  try {
    results = await searchRecords('', ['tipo = "centro"'])
  } catch (error) {
    console.error('Error buscando centros:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">← Volver al inicio</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Centros de Acopio</h1>
            <Link href="/agregar" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm">
              + Agregar Centro
            </Link>
          </div>

          {results.estimatedTotalHits === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aún no hay centros registrados</h2>
              <p className="text-gray-600 mb-6">Sé el primero en agregar un centro de acopio</p>
              <Link href="/agregar" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Agregar Primer Centro
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">{results.estimatedTotalHits} centro(s) registrado(s)</p>
              
              {results.hits.map((centro: any) => (
                <div key={centro.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-900">{centro.titulo || centro.nombre || 'Centro sin nombre'}</h2>
                    <span className="text-xs text-gray-500">{new Date(centro.timestamp).toLocaleDateString('es-VE')}</span>
                  </div>

                  {centro.imagenes && centro.imagenes.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      {centro.imagenes.slice(0, 3).map((img: string, idx: number) => (
                        <img key={idx} src={img} alt={`Imagen ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start">
                      <span className="mr-2">📍</span>
                      <span>{centro.texto_ubicacion}</span>
                    </div>
                    {centro.ciudad && (
                      <div className="flex items-start">
                        <span className="mr-2">🏙️</span>
                        <span>{centro.ciudad}, {centro.estado}</span>
                      </div>
                    )}
                    {centro.contacto && (
                      <div className="flex items-center">
                        <span className="mr-2">📞</span>
                        <a href={`tel:${centro.contacto}`} className="text-blue-600 hover:underline">{centro.contacto}</a>
                      </div>
                    )}
                    {centro.horario && (
                      <div className="flex items-start">
                        <span className="mr-2">🕐</span>
                        <span>{centro.horario}</span>
                      </div>
                    )}
                  </div>

                  {centro.descripcion && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{centro.descripcion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
