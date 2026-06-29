'use client'

import { useState, useEffect } from 'react'

interface ImageLightboxProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function ImageLightbox({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentIndex, images.length, onClose])

  if (!isOpen) return null

  const currentImage = images[currentIndex]
  const imageUrl = currentImage.startsWith('/api/') ? currentImage : `/api${currentImage}`

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-50"
      >
        ×
      </button>

      {/* Imagen anterior */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex(currentIndex - 1)
          }}
          className="absolute left-4 text-white text-5xl hover:text-gray-300 transition-colors p-4"
        >
        ‹
        </button>
      )}

      {/* Imagen siguiente */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex(currentIndex + 1)
          }}
          className="absolute right-4 text-white text-5xl hover:text-gray-300 transition-colors p-4"
        >
        ›
        </button>
      )}

      {/* Imagen principal */}
      <div 
        className="max-w-6xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={`Imagen ${currentIndex + 1} de ${images.length}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        
        {/* Contador */}
        {images.length > 1 && (
          <div className="text-white text-center mt-4 text-lg">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((img, idx) => {
            const thumbUrl = img.startsWith('/api/') ? img : `/api${img}`
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  currentIndex === idx ? 'border-white scale-110' : 'border-gray-600 opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
