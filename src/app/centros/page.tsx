import Link from 'next/link'

export default function CentrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            ← Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Centros de Acopio
          </h1>
          
          <p className="text-gray-600 mb-6">
            Próximamente: Lista completa de centros de acopio registrados con mapa interactivo.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Estado:</strong> En desarrollo. Mientras tanto, busca "centro" en el buscador principal.
            </p>
          </div>

          <Link
            href="/search?tipo=centro"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Buscar Centros
          </Link>
        </div>
      </div>
    </div>
  )
}
