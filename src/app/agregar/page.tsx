'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIPOS_REGISTRO = [
  { id: 'necesita', label: 'Necesita Ayuda', icon: '🚨', color: 'red' },
  { id: 'ofrece', label: 'Ofrece Ayuda', icon: '🤝', color: 'green' },
  { id: 'desaparecido', label: 'Desaparecido', icon: '👤', color: 'yellow' },
  { id: 'centro', label: 'Centro de Acopio', icon: '📍', color: 'blue' },
]

export default function AgregarPage() {
  const [tipo, setTipo] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    contacto: '',
    descripcion: '',
    titulo: '',
    telefono: '',
    horario: '',
    tipos_aceptados: [] as string[]
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [geoData, setGeoData] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Preparar datos según el tipo
      let payload: any = {
        tipo,
        ubicacion: formData.ubicacion,
        contacto: formData.contacto || formData.telefono,
        descripcion: formData.descripcion,
        nombre: formData.nombre
      }

      // Si es centro, agregar campos extra
      if (tipo === 'centro') {
        payload.titulo = formData.titulo || formData.nombre
        payload.horario = formData.horario
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        setGeoData(data.geo)
        setStatus('success')
        setFormData({
          nombre: '',
          ubicacion: '',
          contacto: '',
          descripcion: '',
          titulo: '',
          telefono: '',
          horario: '',
          tipos_aceptados: []
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Información Enviada!
          </h2>
          <p className="text-gray-600 mb-4">
            Tu aporte se ha guardado correctamente y está disponible para quien lo necesite.
          </p>
          
          {geoData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-left">
              <p className="font-semibold mb-1">Ubicación detectada:</p>
              <p>📍 {geoData.ciudad}, {geoData.estado}</p>
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {geoData.lat.toFixed(4)}, {geoData.lng.toFixed(4)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => setStatus('idle')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Agregar Otro
            </button>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            ← Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agregar Información
          </h1>
          <p className="text-gray-600 mb-6">
            Comparte información útil para ayudar a otros
          </p>

          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              Error al enviar. Por favor intenta de nuevo.
            </div>
          )}

          {!tipo ? (
            // Selección de tipo
            <div>
              <h2 className="text-xl font-semibold mb-4">¿Qué tipo de información quieres compartir?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TIPOS_REGISTRO.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTipo(t.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                      t.color === 'red' ? 'border-red-200 hover:border-red-400 bg-red-50' :
                      t.color === 'green' ? 'border-green-200 hover:border-green-400 bg-green-50' :
                      t.color === 'yellow' ? 'border-yellow-200 hover:border-yellow-400 bg-yellow-50' :
                      'border-blue-200 hover:border-blue-400 bg-blue-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{t.icon}</div>
                    <div className="font-semibold text-lg">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Formulario según tipo
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {TIPOS_REGISTRO.find(t => t.id === tipo)?.icon} {TIPOS_REGISTRO.find(t => t.id === tipo)?.label}
                </h2>
                <button
                  type="button"
                  onClick={() => setTipo('')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Cambiar tipo
                </button>
              </div>

              {/* Campos comunes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {tipo === 'desaparecido' ? 'Nombre de la persona' : 'Nombre / Referencia'} {tipo !== 'desaparecido' && '(opcional)'}
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  maxLength={100}
                  required={tipo === 'desaparecido'}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={tipo === 'desaparecido' ? 'Nombre completo' : 'Ej: Juan, Familia Pérez, etc.'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección completa o referencia"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Sé específico: barrio, calle, referencias cercanas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {tipo === 'centro' ? 'Teléfono de contacto' : 'Tu contacto'} *
                </label>
                <input
                  type="text"
                  name={tipo === 'centro' ? 'telefono' : 'contacto'}
                  value={tipo === 'centro' ? formData.telefono : formData.contacto}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Teléfono, WhatsApp o email"
                />
              </div>

              {/* Campos específicos por tipo */}
              {tipo === 'centro' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Centro *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      maxLength={150}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Iglesia San José, Club Deportivo, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario de Atención
                    </label>
                    <input
                      type="text"
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Lun-Vie 8am-6pm, Sáb 9am-1pm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    tipo === 'necesita' ? 'Describe qué necesitas y por qué...' :
                    tipo === 'ofrece' ? '¿Qué tipo de ayuda puedes ofrecer?' :
                    tipo === 'desaparecido' ? 'Última vez visto, descripción física, ropa, etc.' :
                    'Información adicional sobre el centro...'
                  }
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.descripcion.length}/2000
                </p>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Información'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Tu información será pública para ayudar a quien la necesite
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
