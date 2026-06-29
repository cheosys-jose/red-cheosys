'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { ConvertedImage } from '@/lib/imageConverter'

export default function MissingPersonReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ConvertedImage[]>([])
  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    ageGroup: '',
    gender: '',
    lastSeenLocation: '',
    clothingDescription: '',
    distinctiveFeatures: '',
    relativeContact: '',
    additionalInfo: ''
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

      const res = await fetch('/api/v1/persons/missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls
        })
      })
      
      if (res.ok) {
        alert('✅ Registro creado exitosamente')
        router.push('/search?type=missing_persons')
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/persons/missing" className="text-blue-600 hover:underline">
            ← Volver / Cambiar de opción
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🔍</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportar Persona Buscada</h1>
              <p className="text-gray-600">Danos los detalles de la persona que estás buscando</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre completo */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                1. Nombre completo de la persona *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: María González Rodríguez"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.fullName.length}/100 caracteres</p>
            </div>

            {/* Alias */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                2. Alias o apodo (opcional):
              </label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: La Negra, El Chamo"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.alias.length}/50 caracteres</p>
            </div>

            {/* Grupo de edad */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                3. Grupo de edad *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { value: 'BABY', label: 'Bebé' },
                  { value: 'CHILD', label: 'Niño' },
                  { value: 'TEEN', label: 'Joven' },
                  { value: 'ADULT', label: 'Adulto' },
                  { value: 'ELDERLY', label: 'Anciano' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                      className="w-5 h-5 text-yellow-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Género */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                4. Género *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'MALE', label: 'Masculino' },
                  { value: 'FEMALE', label: 'Femenino' },
                  { value: 'OTHER', label: 'Otro' },
                  { value: 'UNKNOWN', label: 'No sé' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      required
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-5 h-5 text-yellow-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Última ubicación vista */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                5. ¿Dónde fue vista por última vez? *
              </label>
              <input
                type="text"
                value={formData.lastSeenLocation}
                onChange={(e) => setFormData({...formData, lastSeenLocation: e.target.value})}
                required
                maxLength={150}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: Centro Comercial Sambil, Chacao, Caracas"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.lastSeenLocation.length}/150 caracteres</p>
            </div>

            {/* Descripción de ropa */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                6. ¿Qué ropa llevaba puesta? (opcional):
              </label>
              <input
                type="text"
                value={formData.clothingDescription}
                onChange={(e) => setFormData({...formData, clothingDescription: e.target.value})}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: Camisa azul, pantalón negro, zapatos marrones"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.clothingDescription.length}/100 caracteres</p>
            </div>

            {/* Rasgos distintivos */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                7. Rasgos distintivos (opcional):
              </label>
              <input
                type="text"
                value={formData.distinctiveFeatures}
                onChange={(e) => setFormData({...formData, distinctiveFeatures: e.target.value})}
                maxLength={300}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Ej: Tatuaje en brazo derecho, usa lentes, cicatriz en mejilla"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.distinctiveFeatures.length}/300 caracteres</p>
            </div>

            {/* Contacto del familiar */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                8. Tu información de contacto *
              </label>
              <input
                type="tel"
                value={formData.relativeContact}
                onChange={(e) => setFormData({...formData, relativeContact: e.target.value})}
                required
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Teléfono / WhatsApp: Ej: +58 412 1234567"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.relativeContact.length}/50 caracteres</p>
            </div>

            {/* Información adicional */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                9. Información adicional (opcional):
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Cualquier otra información relevante..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.additionalInfo.length}/500 caracteres</p>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                10. Fotos de la persona (opcional)
              </label>
              <ImageUpload onImagesSelected={handleImagesSelected} maxImages={3} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-600 text-white rounded-lg font-semibold text-lg hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {loading ? 'Enviando...' : '📤 ENVIAR REPORTE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
