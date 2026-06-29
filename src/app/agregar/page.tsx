'use client'

import Link from 'next/link'

export default function AgregarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lg text-blue-600 hover:underline mb-8 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Agregar Información
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Comparte información útil para ayudar a quien lo necesite
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alerta - Necesita Ayuda */}
          <Link 
            href="/agregar/alerta"
            className="block p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-red-300 hover:border-red-500"
          >
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Necesita Ayuda
            </h2>
            <p className="text-gray-600 mb-4">
              Reportar emergencia, atrapados, inundación, emergencia médica o escasez de suministros
            </p>
            <div className="text-sm text-red-700 font-semibold">
              Crear Alerta →
            </div>
          </Link>

          {/* Recurso - Ofrece Ayuda */}
          <Link 
            href="/agregar/recurso"
            className="block p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-green-300 hover:border-green-500"
          >
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ofrece Ayuda
            </h2>
            <p className="text-gray-600 mb-4">
              Transporte 4x4, personal médico, personal de rescate, espacio en refugio o donaciones
            </p>
            <div className="text-sm text-green-700 font-semibold">
              Ofrecer Recurso →
            </div>
          </Link>

          {/* Persona Desaparecida */}
          <Link 
            href="/persons/missing"
            className="block p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-yellow-300 hover:border-yellow-500"
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Desaparecidos
            </h2>
            <p className="text-gray-600 mb-4">
              Buscar familiar o reportar persona encontrada/resguardada
            </p>
            <div className="text-sm text-yellow-700 font-semibold">
              Reportar Persona →
            </div>
          </Link>

          {/* Centro de Acopio */}
          <Link 
            href="/agregar/centro"
            className="block p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-blue-300 hover:border-blue-500"
          >
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Centro de Acopio
            </h2>
            <p className="text-gray-600 mb-4">
              Registrar centro de donaciones, refugio temporal o punto médico
            </p>
            <div className="text-sm text-blue-700 font-semibold">
              Registrar Centro →
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-12">
          📌 Todos los datos registrados serán de acceso público para facilitar el cruce de información.
        </p>
      </div>
    </div>
  )
}
