'use client'

import { useState, useRef } from 'react'
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
    horario: ''
  })
  const [imagenes, setImagenes] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [geoData, setGeoData] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 3) {
      alert('Máximo 3 imágenes permitidas')
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} excede el tamaño máximo de 2MB`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`)
        return false
      }
      return true
    })

    setImagenes(validFiles)
    setPreviews(validFiles.map(file => URL.createObjectURL(file)))
  }

  const removeImage = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setUploadProgress(0)

    try {
      // Paso 1: Enviar datos básicos
      setUploadProgress(20)
      const payload: any = {
        tipo,
        ubicacion: formData.ubicacion,
        contacto: formData.contacto || formData.telefono,
        descripcion: formData.descripcion,
        nombre: formData.nombre
      }

      if (tipo === 'centro') {
        payload.titulo = formData.titulo || formData.nombre
        payload.horario = formData.horario
      }

      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!submitResponse.ok) {
        const error = await submitResponse.json()
        throw new Error(error.error || 'Error al enviar datos')
      }

      setUploadProgress(50)
      const submitData = await submitResponse.json()
      const recordId = submitData.id
      setGeoData(submitData.geo)

      // Paso 2: Subir imágenes si existen
      if (imagenes.length > 0) {
        setUploadProgress(70)
        const imageFormData = new FormData()
        imageFormData.append('recordId', recordId)
        imagenes.forEach(image => {
          imageFormData.append('images', image)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          console.log('✅ Imágenes subidas:', uploadData.images)
          setUploadProgress(90)
          
          // Paso 3: Actualizar registro con URLs de imágenes
          const updateResponse = await fetch(`/api/records/${recordId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagenes: uploadData.images })
          })
          
          if (updateResponse.ok) {
            console.log('✅ Registro actualizado con imágenes')
          } else {
            console.warn('⚠️ No se pudo actualizar el registro con las imágenes')
          }
        } else {
          console.warn('⚠️ Error subiendo imágenes:', await uploadResponse.text())
        }
      }

      setUploadProgress(100)
      setStatus('success')
      setFormData({ nombre: '', ubicacion: '', contacto: '', descripcion: '', titulo: '', telefono: '', horario: '' })
      setImagenes([])
      setPreviews([])
    } catch (error) {
      console.error('❌ Error:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Información Enviada!</h2>
          <p className="text-gray-600 mb-4">Tu aporte se ha guardado correctamente</p>
          {geoData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-left">
              <p className="font-semibold mb-1">📍 Ubicación detectada:</p>
              <p>{geoData.ciudad}, {geoData.estado}</p>
            </div>
          )}
          {imagenes.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
              <p>📷 {imagenes.length} imagen(es) adjunta(s)</p>
            </div>
          )}
          <div className="space-y-2">
            <button onClick={() => setStatus('idle')} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Agregar Otro
            </button>
            <Link href="/" className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 text-center">
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
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">← Volver al inicio</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Información</h1>
          <p className="text-gray-600 mb-6">Comparte información útil para ayudar a otros</p>

          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              Error al enviar. Intenta de nuevo.
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {uploadProgress < 50 ? 'Enviando datos...' : uploadProgress < 70 ? 'Subiendo imágenes...' : 'Finalizando...'}
              </p>
            </div>
          )}

          {!tipo ? (
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {TIPOS_REGISTRO.find(t => t.id === tipo)?.icon} {TIPOS_REGISTRO.find(t => t.id === tipo)?.label}
                </h2>
                <button type="button" onClick={() => setTipo('')} className="text-sm text-blue-600 hover:underline">
                  Cambiar tipo
                </button>
              </div>

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
                  placeholder={tipo === 'desaparecido' ? 'Nombre completo' : 'Ej: Juan, Familia Pérez'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
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

              {tipo === 'centro' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Centro *</label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      maxLength={150}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Iglesia San José"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horario de Atención</label>
                    <input
                      type="text"
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Lun-Vie 8am-6pm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    tipo === 'necesita' ? 'Describe qué necesitas...' :
                    tipo === 'ofrece' ? '¿Qué ayuda puedes ofrecer?' :
                    tipo === 'desaparecido' ? 'Última vez visto, descripción física...' :
                    'Información adicional...'
                  }
                />
                <p className="text-xs text-gray-500 text-right">{formData.descripcion.length}/2000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (opcional, máximo 3)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📷 Agregar fotos (máx. 2MB cada una)
                  </button>
                  
                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Las imágenes se optimizarán automáticamente</p>
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
