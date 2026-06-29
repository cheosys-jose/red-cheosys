'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FoundPersonReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    condition: '',
    declaredName: '',
    currentSafeLocation: '',
    estimatedAgeGroup: '',
    estimatedGender: '',
    clothingDescription: '',
    custodianContact: '',
    additionalInfo: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/v1/persons/found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert('✅ Registro creado exitosamente')
        router.push('/search')
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
          <Link href="/persons/missing" className="text-blue-600 hover:underline">
            ← Volver / Cambiar de opción
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          REPORTE DE PERSONA LOCALIZADA / RESGUARDADA
        </h1>
        <p className="text-gray-600 mb-8">
          Danos los detalles de la persona que tienes contigo o que viste.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Estado de salud */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              1. ¿En qué estado de salud se encuentra la persona? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'CONSCIOUS_DISORIENTED', label: 'Consciente (No recuerda datos / Niño perdido)' },
                { value: 'UNCONSCIOUS', label: 'Inconsciente / Sedado' },
                { value: 'UNDER_MEDICAL_CARE', label: 'Herido bajo atención médica' },
                { value: 'DECEASED', label: 'Fallecido' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={option.value}
                    required
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Nombre declarado */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              2. ¿Sabe su nombre? (Si no lo sabe, déjalo en blanco):
            </label>
            <input
              type="text"
              value={formData.declaredName}
              onChange={(e) => setFormData({...formData, declaredName: e.target.value})}
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nombre completo si lo conoce"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.declaredName.length}/100 caracteres</p>
          </div>

          {/* 3. Ubicación actual */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              3. ¿Dónde se encuentra la persona físicamente AHORITA mismo? *
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
                      currentSafeLocation: `GPS: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                    })
                  } catch (error) {
                    alert('No se pudo obtener la ubicación. Por favor, ingrésala manualmente.')
                  }
                } else {
                  alert('Tu navegador no soporta geolocalización.')
                }
              }}
              className="mb-3 w-full py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
            >
              📍 CLIC AQUÍ: USAR MI UBICACIÓN GPS ACTUAL
            </button>
            <input
              type="text"
              value={formData.currentSafeLocation}
              onChange={(e) => setFormData({...formData, currentSafeLocation: e.target.value})}
              required
              maxLength={150}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Hospital Pérez Carreño, piso 2, área de trauma"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.currentSafeLocation.length}/150 caracteres</p>
          </div>

          {/* 4. Género estimado */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              4. Género estimado:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'MALE', label: 'Hombre' },
                { value: 'FEMALE', label: 'Mujer' },
                { value: 'OTHER', label: 'Otro' },
                { value: 'UNKNOWN', label: 'No sé' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="estimatedGender"
                    value={option.value}
                    onChange={(e) => setFormData({...formData, estimatedGender: e.target.value})}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Edad estimada */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              5. Edad estimada:
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
                    name="estimatedAgeGroup"
                    value={option.value}
                    onChange={(e) => setFormData({...formData, estimatedAgeGroup: e.target.value})}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Descripción de ropa */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              6. ¿Qué ropa lleva puesta? (opcional):
            </label>
            <input
              type="text"
              value={formData.clothingDescription}
              onChange={(e) => setFormData({...formData, clothingDescription: e.target.value})}
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Franela azul, pantalón jean oscuro"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.clothingDescription.length}/100 caracteres</p>
          </div>

          {/* 7. Contacto del custodio */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              7. Tu información de contacto (Para que la familia te llame): *
            </label>
            <input
              type="tel"
              value={formData.custodianContact}
              onChange={(e) => setFormData({...formData, custodianContact: e.target.value})}
              required
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Teléfono / WhatsApp: Ej: +58 412 1234567"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.custodianContact.length}/50 caracteres</p>
          </div>

          {/* 8. Información adicional */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              8. Información adicional (opcional):
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Cualquier otra información relevante..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.additionalInfo.length}/500 caracteres</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Enviando...' : '📤 ENVIAR INFORMACIÓN'}
          </button>
        </form>
      </div>
    </div>
  )
}
