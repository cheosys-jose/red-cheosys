'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              🔴 Red CheoSys
            </Link>
            <div className="flex gap-4">
              <Link href="/links" className="text-blue-600 hover:underline">Links de Interés</Link>
              <Link href="/admin/metrics" className="text-gray-600 hover:text-blue-600">Métricas</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - Búsqueda */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buscador Humanitario
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            La información correcta, en el momento exacto, salva vidas
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar personas, centros, alertas..."
              className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 shadow-lg">
              🔍 Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Necesito / Quiero Ayudar */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* NECESITO AYUDA */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border-2 border-red-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                🆘 NECESITO AYUDA
              </h2>
              <div className="space-y-4">
                <Link href="/search?type=alerts" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-red-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚨</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Ver Emergencias Activas</h3>
                      <p className="text-sm text-gray-600">Lista de emergencias reportadas</p>
                    </div>
                    <span className="text-red-600 font-bold">VER →</span>
                  </div>
                </Link>
                <Link href="/search?type=resources&category=food" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-red-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🍽️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Buscar Comida/Agua</h3>
                      <p className="text-sm text-gray-600">Ver quién ofrece alimentos</p>
                    </div>
                    <span className="text-red-600 font-bold">VER →</span>
                  </div>
                </Link>
                <Link href="/search?type=resources&category=medicine" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-red-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💊</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Buscar Medicinas</h3>
                      <p className="text-sm text-gray-600">Ver quién ofrece medicamentos</p>
                    </div>
                    <span className="text-red-600 font-bold">VER →</span>
                  </div>
                </Link>
                <Link href="/search?type=resources&category=shelter" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-red-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🏠</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Buscar Refugio</h3>
                      <p className="text-sm text-gray-600">Ver albergues disponibles</p>
                    </div>
                    <span className="text-red-600 font-bold">VER →</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* QUIERO AYUDAR */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                🤝 QUIERO AYUDAR
              </h2>
              <div className="space-y-4">
                <Link href="/agregar/recurso?category=food" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📦</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Donar Alimentos</h3>
                      <p className="text-sm text-gray-600">Registrar donación de comida</p>
                    </div>
                    <span className="text-green-600 font-bold">OFRECER →</span>
                  </div>
                </Link>
                <Link href="/agregar/recurso?category=transport" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚙</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Transporte 4x4</h3>
                      <p className="text-sm text-gray-600">Ofrecer vehículo para rescate</p>
                    </div>
                    <span className="text-green-600 font-bold">OFRECER →</span>
                  </div>
                </Link>
                <Link href="/agregar/recurso?category=medical" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚕️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Personal Médico</h3>
                      <p className="text-sm text-gray-600">Ofrecer servicios médicos</p>
                    </div>
                    <span className="text-green-600 font-bold">OFRECER →</span>
                  </div>
                </Link>
                <Link href="/agregar/recurso?category=volunteer" className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👥</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Voluntariado</h3>
                      <p className="text-sm text-gray-600">Ofrecer ayuda en terreno</p>
                    </div>
                    <span className="text-green-600 font-bold">OFRECER →</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-12 px-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            👤 PERSONAS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-300">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Busco a un Familiar</h3>
              <p className="text-gray-600 mb-4">
                Mi ser querido no aparece y quiero registrar sus datos
              </p>
              <div className="space-y-3">
                <Link href="/persons/missing/report" className="block w-full py-3 bg-yellow-600 text-white rounded-lg font-semibold text-center hover:bg-yellow-700">
                  📝 REPORTAR DESAPARICIÓN
                </Link>
                <Link href="/search?type=missing_persons" className="block w-full py-3 bg-white text-yellow-700 rounded-lg font-semibold text-center hover:bg-yellow-50 border-2 border-yellow-300">
                  👁️ VER LISTA DE BUSCADOS
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-300">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Encontré a Alguien</h3>
              <p className="text-gray-600 mb-4">
                Tengo a una persona resguardada y necesito que su familia sepa
              </p>
              <div className="space-y-3">
                <Link href="/persons/found/report" className="block w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-center hover:bg-green-700">
                  📝 REPORTAR PERSONA ENCONTRADA
                </Link>
                <Link href="/search?type=found_persons" className="block w-full py-3 bg-white text-green-700 rounded-lg font-semibold text-center hover:bg-green-50 border-2 border-green-300">
                  👁️ VER LISTA DE ENCONTRADOS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dónde Ir */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            🏥 DÓNDE IR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/search?type=centers&centerType=DONATION_HUB" className="block p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-500 text-center">
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-bold text-gray-900">Centros de Acopio</h3>
              <p className="text-xs text-gray-600 mt-1">Ver lista →</p>
            </Link>
            <Link href="/search?type=centers&centerType=MEDICAL_POINT" className="block p-6 bg-red-50 rounded-xl hover:shadow-lg transition-all border-2 border-red-200 hover:border-red-500 text-center">
              <div className="text-4xl mb-2">🏥</div>
              <h3 className="font-bold text-gray-900">Hospitales</h3>
              <p className="text-xs text-gray-600 mt-1">Ver lista →</p>
            </Link>
            <Link href="/search?type=centers&centerType=TEMPORARY_SHELTER" className="block p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all border-2 border-green-200 hover:border-green-500 text-center">
              <div className="text-4xl mb-2">🛏️</div>
              <h3 className="font-bold text-gray-900">Albergues</h3>
              <p className="text-xs text-gray-600 mt-1">Ver lista →</p>
            </Link>
            <Link href="/search?q=farmacia" className="block p-6 bg-purple-50 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-500 text-center">
              <div className="text-4xl mb-2">💊</div>
              <h3 className="font-bold text-gray-900">Farmacias</h3>
              <p className="text-xs text-gray-600 mt-1">Ver lista →</p>
            </Link>
            <Link href="/search?q=agua" className="block p-6 bg-cyan-50 rounded-xl hover:shadow-lg transition-all border-2 border-cyan-200 hover:border-cyan-500 text-center">
              <div className="text-4xl mb-2">🚰</div>
              <h3 className="font-bold text-gray-900">Puntos de Agua</h3>
              <p className="text-xs text-gray-600 mt-1">Ver lista →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Links de Interés */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              🔗 LINKS DE INTERÉS
            </h2>
            <Link href="/links" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
              Ver Todos →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="https://proteccioncivil.gob.ve" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🏛️</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Protección Civil</h3>
                  <p className="text-sm text-gray-600">Coordinación de emergencias</p>
                </div>
              </div>
            </a>
            <a href="https://cruzrojavenezolana.org" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚕️</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Cruz Roja</h3>
                  <p className="text-sm text-gray-600">Atención médica y humanitaria</p>
                </div>
              </div>
            </a>
            <a href="https://bancoalimentos.org.ve" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📦</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Banco de Alimentos</h3>
                  <p className="text-sm text-gray-600">Red de distribución de comida</p>
                </div>
              </div>
            </a>
          </div>
          <div className="mt-8 text-center">
            <Link href="/links/add" className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 border-2 border-purple-300">
              💡 ¿Conoces un enlace útil? Agrégalo aquí
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg mb-2">"A un pueblo unido nadie lo detiene" 🇻🇪</p>
          <p className="text-sm text-gray-400">Open Source • Datos Públicos • Sin Fines de Lucro</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <Link href="/docs" className="text-gray-400 hover:text-white">Documentación</Link>
            <Link href="/search" className="text-gray-400 hover:text-white">Ver Todos los Resultados</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
