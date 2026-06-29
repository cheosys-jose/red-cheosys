'use client'

interface FoundPersonCardProps {
  data: any
  expanded: boolean
  onToggle: () => void
}

export default function FoundPersonCard({ data, expanded, onToggle }: FoundPersonCardProps) {
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'CONSCIOUS_DISORIENTED': return 'Consciente pero desorientado'
      case 'UNCONSCIOUS': return 'Inconsciente'
      case 'UNACCOMPANIED_MINOR': return 'Menor no acompañado'
      case 'DECEASED': return 'Fallecido'
      default: return condition
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'CONSCIOUS_DISORIENTED': return '😵'
      case 'UNCONSCIOUS': return '🚑'
      case 'UNACCOMPANIED_MINOR': return '👶'
      case 'DECEASED': return '⚰️'
      default: return '🤝'
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
            <span className="text-2xl">{getConditionIcon(data.condition)}</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {data.declaredName || 'Persona no identificada'}
              </h3>
              <p className="text-sm text-gray-600">
                Ubicación: {data.currentSafeLocation}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
            ENCONTRADO
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">
          Estado: {getConditionLabel(data.condition)}
        </p>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <p><span className="font-semibold">👤 Edad estimada:</span> {data.estimatedAgeGroup}</p>
            <p><span className="font-semibold">👤 Género estimado:</span> {data.estimatedGender}</p>
            
            {data.clothingDescription && (
              <p><span className="font-semibold">👕 Ropa:</span> {data.clothingDescription}</p>
            )}
            
            {data.additionalInfo && (
              <p><span className="font-semibold">ℹ️ Información adicional:</span> {data.additionalInfo}</p>
            )}
            
            {data.custodianContact && (
              <p><span className="font-semibold">📞 Contacto del custodio:</span> <a href={`tel:${data.custodianContact}`} className="text-blue-600 hover:underline">{data.custodianContact}</a></p>
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
