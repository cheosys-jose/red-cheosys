'use client'

import Image from 'next/image'

interface CenterCardProps {
  data: any
  expanded: boolean
  onToggle: () => void
}

export default function CenterCard({ data, expanded, onToggle }: CenterCardProps) {
  const getCenterTypeLabel = (type: string) => {
    switch (type) {
      case 'DONATION_HUB': return '📦 Centro de Donaciones'
      case 'TEMPORARY_SHELTER': return '🏠 Refugio Temporal'
      case 'MEDICAL_POINT': return '🏥 Punto Médico'
      default: return type
    }
  }

  const getCapacityColor = (status: string) => {
    switch (status) {
      case 'RECEIVING': return 'bg-green-600 text-white'
      case 'FULL': return 'bg-orange-600 text-white'
      case 'CLOSED': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getCapacityLabel = (status: string) => {
    switch (status) {
      case 'RECEIVING': return 'RECIBIENDO'
      case 'FULL': return 'LLENO'
      case 'CLOSED': return 'CERRADO'
      default: return status
    }
  }

  return (
    <article 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-l-blue-500 hover:bg-blue-50 cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {data.name}
              </h3>
              <p className="text-sm text-gray-600">
                {data.address}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${getCapacityColor(data.capacityStatus)}`}>
            {getCapacityLabel(data.capacityStatus)}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">
          {getCenterTypeLabel(data.centerType)}
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
            {data.description && (
              <p className="text-gray-700">{data.description}</p>
            )}
            
            {data.criticalNeeds && (
              <p><span className="font-semibold">📦 Necesita urgentemente:</span> {data.criticalNeeds}</p>
            )}
            
            {data.contactPhone && (
              <p><span className="font-semibold">📞 Teléfono:</span> <a href={`tel:${data.contactPhone}`} className="text-blue-600 hover:underline">{data.contactPhone}</a></p>
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
