import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            ← Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Documentación
          </h1>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">Guías Disponibles</h2>
            
            <ul className="space-y-2 mb-6">
              <li>
                <a href="https://github.com/cheosys-jose/red-cheosys/blob/main/docs/ROADMAP.md" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  📋 Roadmap del Proyecto
                </a>
              </li>
              <li>
                <a href="https://github.com/cheosys-jose/red-cheosys/blob/main/docs/DECISIONES.md" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  🏗️ Decisiones Arquitectónicas
                </a>
              </li>
              <li>
                <a href="https://github.com/cheosys-jose/red-cheosys/blob/main/docs/MIGRACION.md" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  🔄 Plan de Migración
                </a>
              </li>
              <li>
                <a href="https://github.com/cheosys-jose/red-cheosys/blob/main/docs/CHANGELOG.md" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  📝 Changelog
                </a>
              </li>
              <li>
                <a href="https://github.com/cheosys-jose/red-cheosys/blob/main/docs/CONTRIBUTING.md" 
                   className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  🤝 Cómo Contribuir
                </a>
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-3">Tecnologías</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">Next.js 14</div>
                <div className="text-sm text-gray-600">Framework React</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">Meilisearch</div>
                <div className="text-sm text-gray-600">Búsqueda instantánea</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">OpenStreetMap</div>
                <div className="text-sm text-gray-600">Geolocalización</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">Tailwind CSS</div>
                <div className="text-sm text-gray-600">Estilos</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">TypeScript</div>
                <div className="text-sm text-gray-600">Tipado</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold">SQLite</div>
                <div className="text-sm text-gray-600">Datos</div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">API</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Endpoints disponibles:</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-200 px-2 py-1 rounded">POST /api/submit</code> - Agregar registro</li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">GET /search?q=...</code> - Búsqueda full-text</li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">GET /api/search/near?lat=&lng=</code> - Búsqueda por cercanía</li>
              </ul>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
