'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { ConvertedImage } from '@/lib/imageConverter'

export default function AlertaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ConvertedImage[]>([])
  const [formData, setFormData] = useState({
    severity: '',
    alertType: '',
    affectedPeople: '',
    exactLocation: '',
    reporterContact: '',
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
      // Subir imágenes primero
      const imageUrls = await uploadImages()

      // Crear alerta con URLs de imágenes
      const res = await fetch('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls // Agregar URLs de imágenes al payload
        })
      })
      
      if (res.ok) {
        alert('✅ Alerta creada exitosamente')
        router.push('/search?type=alerts')
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/agregar" className="text-blue-600 hover:underline">
            ← Volver
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🚨</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Alerta de Emergencia</h1>
              <p className="text-gray-600">Reporta situaciones críticas que requieren atención inmediata</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Alerta */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                1. Tipo de emergencia *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'TRAPPED', label: 'Persona Atrapada', icon: '' },
                  { value: 'FLOOD', label: 'Inundación', icon: '🌊' },
                  { value: 'MEDICAL_EMERGENCY', label: 'Emergencia Médica', icon: '🏥' },
                  { value: 'SUPPLY_SHORTAGE', label: 'Escasez de Suministros', icon: '📦' },
                  { value: 'STRUCTURAL_DAMAGE', label: 'Daño Estructural', icon: '🏚️' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="alertType"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, alertType: e.target.value})}
                      className="w-5 h-5 text-red-600"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Severidad */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                2. Nivel de severidad *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'CRITICAL', label: 'Crítica', desc: 'Vida en peligro inmediato', color: 'red' },
                  { value: 'URGENT', label: 'Urgente', desc: 'Requiere atención rápida', color: 'orange' },
                  { value: 'SUPPORT', label: 'Apoyo', desc: 'Necesita asistencia', color: 'yellow' }
                ].map((option) => (
                  <label key={option.value} className={`p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border-${option.color}-300`}>
                    <input
                      type="radio"
                      name="severity"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, severity: e.target.value})}
                      className={`w-5 h-5 text-${option.color}-600 mb-2`}
                    />
                    <div className="font-bold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Ubicación exacta */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                3. Ubicación exacta *
              </label>
              <button
                type="button"
                onClick={async () => {
                  if ('geolocation' in navigator) {
                    try {
                      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject)
                      })
                      setFormData({
                        ...formData,
                        locationLat: position.coords.latitude,
                        locationLng: position.coords.longitude,
                        exactLocation: `GPS: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                      })
                    } catch (error) {
                      alert('No se pudo obtener la ubicación. Ingrésala manualmente.')
                    }
                  }
                }}
                className="mb-3 w-full py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                📍 Usar mi ubicación GPS actual
              </button>
              <input
                type="text"
                value={formData.exactLocation}
                onChange={(e) => setFormData({...formData, exactLocation: e.target.value})}
                required
                maxLength={150}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Ej: Av. Principal con Calle 5, Sector Las Flores, Caracas"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.exactLocation.length}/150 caracteres</p>
            </div>

            {/* Personas afectadas */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                4. Número estimado de personas afectadas
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['1-5', '5-10', '10-50', '50+'].map((range) => (
                  <label key={range} className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="affectedPeople"
                      value={range}
                      onChange={(e) => setFormData({...formData, affectedPeople: e.target.value})}
                      className="w-5 h-5 text-red-600"
                    />
                    <span>{range} personas</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                5. Descripción de la emergencia *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe la situación: qué pasó, cuándo, condiciones actuales, etc."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 caracteres</p>
            </div>

            {/* Contacto */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                6. Tu información de contacto *
              </label>
              <input
                type="tel"
                value={formData.reporterContact}
                onChange={(e) => setFormData({...formData, reporterContact: e.target.value})}
                required
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Teléfono / WhatsApp: Ej: +58 412 1234567"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.reporterContact.length}/50 caracteres</p>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                7. Fotos de la emergencia (opcional)
              </label>
              <ImageUpload onImagesSelected={handleImagesSelected} maxImages={3} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors shadow-lg"
            >
              {loading ? 'Creando alerta...' : '🚨 CREAR ALERTA DE EMERGENCIA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
