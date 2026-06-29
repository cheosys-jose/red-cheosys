'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { ConvertedImage } from '@/lib/imageConverter'

export default function RecursoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ConvertedImage[]>([])
  const [formData, setFormData] = useState({
    category: '',
    coverageArea: '',
    availability: '',
    providerContact: '',
    description: '',
    locationLat: null as number | null,
    locationLng: null as number | null
  })

  const handleImagesSelected = (selectedImages: ConvertedImage[]) => {
    setImages(selectedImages)
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []

    const formDataUpload = new FormData()
    images.forEach((img) => {
      formDataUpload.append('files', img.file)
    })

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload
    })

    if (!res.ok) throw new Error('Error al subir imágenes')

    const data = await res.json()
    return data.files
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const imageUrls = await uploadImages()

      const res = await fetch('/api/v1/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls
        })
      })
      
      if (res.ok) {
        alert('✅ Recurso registrado exitosamente')
        router.push('/search?type=resources')
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/agregar" className="text-blue-600 hover:underline">
            ← Volver
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🤝</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ofrecer Recurso o Ayuda</h1>
              <p className="text-gray-600">Comparte lo que puedas ofrecer para ayudar a otros</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Recurso */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                1. ¿Qué puedes ofrecer? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'TRANSPORT_4X4', label: 'Transporte 4x4', icon: '🚙' },
                  { value: 'MEDICAL_STAFF', label: 'Personal Médico', icon: '⚕️' },
                  { value: 'RESCUE_STAFF', label: 'Personal de Rescate', icon: '🚑' },
                  { value: 'SHELTER_SPACE', label: 'Espacio en Refugio', icon: '🏠' },
                  { value: 'BULK_DONATION', label: 'Donación Masiva', icon: '📦' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-5 h-5 text-green-600"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                2. Disponibilidad *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'IMMEDIATE', label: 'Inmediata', desc: 'Disponible ahora' },
                  { value: 'NIGHT_SHIFT', label: 'Turno Nocturno', desc: 'Solo de noche' },
                  { value: 'WEEKENDS_ONLY', label: 'Fines de Semana', desc: 'Sábados y domingos' }
                ].map((option) => (
                  <label key={option.value} className="p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className="w-5 h-5 text-green-600 mb-2"
                    />
                    <div className="font-bold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Área de cobertura */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                3. Área de cobertura *
              </label>
              <input
                type="text"
                value={formData.coverageArea}
                onChange={(e) => setFormData({...formData, coverageArea: e.target.value})}
                required
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ej: Caracas y alrededores, Zona metropolitana, etc."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.coverageArea.length}/100 caracteres</p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                4. Descripción detallada *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe qué ofreces exactamente, capacidades, limitaciones, etc."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 caracteres</p>
            </div>

            {/* Contacto */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                5. Tu información de contacto *
              </label>
              <input
                type="tel"
                value={formData.providerContact}
                onChange={(e) => setFormData({...formData, providerContact: e.target.value})}
                required
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Teléfono / WhatsApp: Ej: +58 414 9876543"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.providerContact.length}/50 caracteres</p>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                6. Fotos del recurso (opcional)
              </label>
              <ImageUpload onImagesSelected={handleImagesSelected} maxImages={3} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-lg"
            >
              {loading ? 'Registrando...' : '🤝 OFRECER RECURSO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
