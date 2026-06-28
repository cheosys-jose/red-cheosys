import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Logo/Título */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
          Red CheoSys
        </h1>
        <p className="text-lg text-gray-600">
          Buscador humanitario de código abierto
        </p>
      </div>

      {/* Búsqueda Central */}
      <form action="/search" method="GET" className="w-full max-w-2xl mb-8">
        <div className="relative">
          <input
            type="search"
            name="q"
            placeholder="¿Qué necesitas buscar?"
            autoFocus
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full shadow-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl w-full">
        <Link
          href="/search?tipo=necesita"
          className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🚨</div>
          <div className="font-semibold text-gray-900">Necesita Ayuda</div>
        </Link>

        <Link
          href="/search?tipo=ofrece"
          className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🤝</div>
          <div className="font-semibold text-gray-900">Ofrece Ayuda</div>
        </Link>

        <Link
          href="/search?tipo=desaparecido"
          className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">👤</div>
          <div className="font-semibold text-gray-900">Desaparecidos</div>
        </Link>

        <Link
          href="/search?tipo=centro"
          className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">📍</div>
          <div className="font-semibold text-gray-900">Centros</div>
        </Link>
      </div>

      {/* Stats y Enlaces */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">
          Información pública para ayudar a quien la necesite
        </p>
        
        <div className="flex gap-4 justify-center text-sm">
          <Link href="/agregar" className="text-blue-600 hover:underline">
            Agregar información
          </Link>
          <Link href="/centros" className="text-blue-600 hover:underline">
            Ver centros
          </Link>
          <Link href="/docs" className="text-blue-600 hover:underline">
            Documentación
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400">
        <p>Open Source • Datos Públicos • Sin Fines de Lucro</p>
        <p className="mt-1">A un pueblo unido nadie lo detiene</p>
      </footer>
    </div>
  )
}
