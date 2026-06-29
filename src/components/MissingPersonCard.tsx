'use client'

import Image from 'next/image'

interface MissingPersonCardProps {
  data: any
  expanded: boolean
  onToggle: () => void
}

export default function MissingPersonCard({ data, expanded, onToggle }: MissingPersonCardProps) {
  const getAgeGroupLabel = (age: string) => {
    switch (age) {
      case 'BABY': return 'Bebé'
      case 'CHILD': return 'Niño'
      case 'TEEN': return 'Joven'
      case 'ADULT': return 'Adulto'
      case 'ELDERLY': return 'Anciano'
      default: return age
    }
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Masculino'
      case 'FEMALE': return 'Femenino'
      case 'OTHER': return 'Otro'
      case 'UNKNOWN': return 'Desconocido'
      default: return gender
    }
  }

  return (
    <article 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-l-yellow-500 hover:bg-yellow-50 cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {data.fullName} {data.alias && `(${data.alias})`}
              </h3>
              <p className="text-sm text-gray-600">
                Visto por última vez en: {data.lastSeenLocation}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-600 text-white">
            BUSCADO
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">
          {getAgeGroupLabel(data.ageGroup)} - {getGenderLabel(data.gender)}
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
            {data.clothingDescription && (
              <p><span className="font-semibold">👕 Ropa:</span> {data.clothingDescription}</p>
            )}
            
            {data.distinctiveFeatures && (
              <p><span className="font-semibold">⭐ Rasgos distintivos:</span> {data.distinctiveFeatures}</p>
            )}
            
            {data.additionalInfo && (
              <p><span className="font-semibold">ℹ️ Información adicional:</span> {data.additionalInfo}</p>
            )}
            
            {data.relativeContact && (
              <p><span className="font-semibold">📞 Contacto familiar:</span> <a href={`tel:${data.relativeContact}`} className="text-blue-600 hover:underline">{data.relativeContact}</a></p>
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
