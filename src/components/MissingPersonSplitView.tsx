'use client'

import Link from 'next/link'

export default function MissingPersonSplitView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lg text-blue-600 hover:underline mb-8 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          MÓDULO: PERSONAS EXTRAVIADAS
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Por favor, selecciona la opción que describe tu situación actual:
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* BUSCO A UN FAMILIAR */}
          <Link 
            href="/persons/missing/report"
            className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-4 border-red-500 hover:border-red-600"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              BUSCO A UN FAMILIAR
            </h2>
            <p className="text-gray-600 mb-6">
              "Mi ser querido no aparece y quiero registrar sus datos para que la comunidad me ayude a localizarlo."
            </p>
            <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
              SELECCIONAR
            </button>
          </Link>
          
          {/* ENCONTRÉ A ALGUIEN */}
          <Link 
            href="/persons/found/report"
            className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-4 border-green-500 hover:border-green-600"
          >
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ENCONTRÉ A ALGUIEN
            </h2>
            <p className="text-gray-600 mb-6">
              "Tengo a una persona resguardada, está perdida, herida o inconsciente, y necesito que su familia sepa dónde está."
            </p>
            <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              SELECCIONAR
            </button>
          </Link>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-12">
          📌 Nota: Todos los datos registrados serán de acceso público para facilitar el cruce de información.
        </p>
      </div>
    </div>
  )
}
