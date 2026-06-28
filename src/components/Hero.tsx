'use client'

import { useState } from 'react'

const TIPOS_AYUDA = [
  { id: 'alimento', label: 'Comida', icon: '🍚', desc: 'Alimentos, víveres' },
  { id: 'medicina', label: 'Medicinas', icon: '💊', desc: 'Medicamentos, insumos' },
  { id: 'agua', label: 'Agua', icon: '💧', desc: 'Agua potable' },
  { id: 'ropa', label: 'Ropa', icon: '👕', desc: 'Ropa, calzado, mantas' },
  { id: 'transporte', label: 'Transporte', icon: '🚗', desc: 'Movilidad, traslado' },
  { id: 'alojamiento', label: 'Refugio', icon: '🏠', desc: 'Dónde dormir' },
  { id: 'otro', label: 'Otro', icon: '🤝', desc: 'Otra necesidad' },
]

export default function Hero() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    tipo: '',
    ubicacion: '',
    contacto: '',
    descripcion: '',
    nombre: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ tipo: '', ubicacion: '', contacto: '', descripcion: '', nombre: '' })
        setStep(1)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const canAdvance = () => {
    if (step === 1) return formData.tipo !== ''
    if (step === 2) return formData.ubicacion !== ''
    if (step === 3) return formData.contacto !== ''
    return true
  }

  const nextStep = () => {
    if (canAdvance() && step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Pantalla de éxito
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Recibido!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu mensaje llegó a quienes pueden ayudar. Estamos trabajando para contactarte pronto.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-emerald-600 font-medium hover:underline"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Encabezado emocional */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Cuéntanos qué necesitas. Cada dato que compartas nos ayuda a llegar más rápido y mejor.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            Estamos contigo.
          </p>
        </div>

        {/* Progreso visual */}
        <div className="flex items-center justify-center mb-6 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 transition-all ${
                  step > s ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              Algo salió mal. Por favor intenta de nuevo.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASO 1: ¿Qué necesitas? */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  ¿Qué tipo de ayuda necesitas?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Toca la que más se acerque a tu situación
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIPOS_AYUDA.map((tipo) => (
                    <button
                      key={tipo.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: tipo.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.tipo === tipo.id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-3xl mb-1">{tipo.icon}</div>
                      <div className="font-semibold text-gray-900">{tipo.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{tipo.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2: ¿Dónde estás? */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  ¿Dónde podemos encontrarte?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Sé específico: barrio, calle, referencias cercanas
                </p>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  maxLength={200}
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Ej: Barrio El Carmen, calle 5, casa azul frente a la cancha"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Entre más detalles, más rápido llegamos
                </p>
              </div>
            )}

            {/* PASO 3: Cómo contactarte */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  ¿Cómo podemos contactarte?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Para coordinar la ayuda
                </p>
                <input
                  type="text"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg mb-4"
                  placeholder="Teléfono o WhatsApp"
                />

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos más (opcional)
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  maxLength={2000}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                  placeholder="¿Cuántas personas son? ¿Hay niños o adultos mayores? ¿Algo importante que debamos saber?"
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.descripcion.length}/2000
                </p>
              </div>
            )}

            {/* Navegación */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900"
                >
                  ← Atrás
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canAdvance()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'loading' || !canAdvance()}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-none shadow-lg"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar solicitud ✓'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Validación social */}
        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 Tu información es confidencial y solo se usa para coordinar ayuda
        </p>
      </div>
    </div>
  )
}
