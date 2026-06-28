import Link from 'next/link'

export default function AgregarPage() {
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
            Agregar Información
          </h1>
          
          <p className="text-gray-600 mb-6">
            Próximamente: Formulario para agregar centros de acopio, necesidades y personas desaparecidas.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Estado:</strong> En desarrollo. Mientras tanto, usa el formulario principal en la página de inicio.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
