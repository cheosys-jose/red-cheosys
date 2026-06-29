'use client'

import Image from 'next/image'

interface AlertCardProps {
  data: any
  expanded: boolean
  onToggle: () => void
}

export default function AlertCard({ data, expanded, onToggle }: AlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-l-red-600 bg-red-50'
      case 'URGENT': return 'border-l-orange-500 bg-orange-50'
      case 'SUPPORT': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '🚨 CRÍTICA'
      case 'URGENT': return '⚠️ URGENTE'
      case 'SUPPORT': return '🆘 APOYO'
      default: return severity
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'TRAPPED': return 'Persona Atrapada'
      case 'FLOOD': return 'Inundación'
      case 'MEDICAL_EMERGENCY': return 'Emergencia Médica'
      case 'SUPPLY_SHORTAGE': return 'Escasez de Suministros'
      case 'STRUCTURAL_DAMAGE': return 'Daño Estructural'
      default: return type
    }
  }

  return (
    <article 
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 cursor-pointer ${getSeverityColor(data.severity)}`}
      onClick={onToggle}
    >
      <div className="p-4">
        {/* Header compacto */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {getAlertTypeLabel(data.alertType)}
              </h3>
              <p className="text-sm text-gray-600">
                {data.exactLocation}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            data.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
            data.severity === 'URGENT' ? 'bg-orange-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {getSeverityLabel(data.severity)}
          </span>
        </div>

        {/* Descripción corta */}
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

        {/* Detalles expandidos */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <p className="text-gray-700">{data.description}</p>
            
            {data.affectedPeople && (
              <p><span className="font-semibold">👥 Personas afectadas:</span> {data.affectedPeople}</p>
            )}
            
            {data.reporterContact && (
              <p><span className="font-semibold">📞 Contacto:</span> <a href={`tel:${data.reporterContact}`} className="text-blue-600 hover:underline">{data.reporterContact}</a></p>
            )}
            
            <p className="text-xs text-gray-500">
               {new Date(data.createdAt).toLocaleString('es-VE')}
            </p>
          </div>
        )}

        {/* Toggle */}
        <div className="mt-2 text-center">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            {expanded ? '▲ Mostrar menos' : '▼ Ver más detalles'}
          </button>
        </div>
      </div>
    </article>
  )
}
