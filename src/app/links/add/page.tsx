'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddLinkPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    submitterName: '',
    submitterEmail: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/v1/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('✅ Link enviado exitosamente. Será revisado y publicado pronto.')
        router.push('/links')
      } else {
        const error = await res.json()
        alert('❌ Error: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/links" className="text-blue-600 hover:underline">
            ← Volver a Links
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agregar Link de Interés
          </h1>
          <p className="text-gray-600 mb-8">
            Comparte un enlace útil para la comunidad. Será revisado antes de ser publicado.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                1. Título del link *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Protección Civil Venezuela"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 caracteres</p>
            </div>

            {/* URL */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                2. URL completa *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                3. Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe brevemente qué ofrece este sitio web"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/300 caracteres</p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                4. Categoría *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'official', label: '🏛️ Organismo Oficial' },
                  { value: 'missing', label: '👤 Personas Desaparecidas' },
                  { value: 'centers', label: '📦 Centros de Acopio' },
                  { value: 'news', label: '📰 Información y Noticias' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nombre del remitente (opcional) */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                5. Tu nombre (opcional)
              </label>
              <input
                type="text"
                value={formData.submitterName}
                onChange={(e) => setFormData({...formData, submitterName: e.target.value})}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre"
              />
            </div>

            {/* Email del remitente (opcional) */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                6. Tu email (opcional, para contacto)
              </label>
              <input
                type="email"
                value={formData.submitterEmail}
                onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Enviando...' : '🔗 ENVIAR LINK'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
