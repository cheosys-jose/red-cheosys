'use client'

import Image from 'next/image'

interface ResourceCardProps {
  data: any
  expanded: boolean
  onToggle: () => void
}

export default function ResourceCard({ data, expanded, onToggle }: ResourceCardProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'TRANSPORT_4X4': return '🚙 Transporte 4x4'
      case 'MEDICAL_STAFF': return '⚕️ Personal Médico'
      case 'RESCUE_STAFF': return '🚑 Personal de Rescate'
      case 'SHELTER_SPACE': return '🏠 Espacio en Refugio'
      case 'BULK_DONATION': return '📦 Donación Masiva'
      default: return category
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-600 text-white'
      case 'EN_ROUTE': return 'bg-blue-600 text-white'
      case 'EXHAUSTED': return 'bg-gray-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'DISPONIBLE'
      case 'EN_ROUTE': return 'EN CAMINO'
      case 'EXHAUSTED': return 'AGOTADO'
      default: return status
    }
  }

  return (
    <article 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-l-green-500 hover:bg-green-50 cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {getCategoryLabel(data.category)}
              </h3>
              <p className="text-sm text-gray-600">
                {data.coverageArea}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(data.status)}`}>
            {getStatusLabel(data.status)}
          </span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
          {data.description}
        </p>

        {/* Imágenes preview */}
        {data.images && data.images.length > 0 && (
          <div className="flex gap-2 mb-2">
            {data.images.slice(0, 3).map((img: any, idx: number) => (
              <div key={idx} className="relative w-20 h-20 rounded overflow-hidden">
                <Image
                  src={img.url}
                  alt={`Imagen ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {data.images.length > 3 && (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                +{data.images.length - 3}
              </div>
            )}
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <p className="text-gray-700">{data.description}</p>
            
            <p><span className="font-semibold">🕐 Disponibilidad:</span> {data.availability}</p>
            
            {data.providerContact && (
              <p><span className="font-semibold">📞 Contacto:</span> <a href={`tel:${data.providerContact}`} className="text-blue-600 hover:underline">{data.providerContact}</a></p>
            )}
            
            <p className="text-xs text-gray-500">
               {new Date(data.createdAt).toLocaleString('es-VE')}
            </p>
          </div>
        )}

        <div className="mt-2 text-center">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            {expanded ? '▲ Mostrar menos' : '▼ Ver más detalles'}
          </button>
        </div>
      </div>
    </article>
  )
}
