'use client'

import { useState, useRef } from 'react'
import { convertMultipleImages, ConvertedImage } from '@/lib/imageConverter'

interface ImageUploadProps {
  onImagesSelected: (images: ConvertedImage[]) => void
  maxImages?: number
}

export default function ImageUpload({ 
  onImagesSelected, 
  maxImages = 3 
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<ConvertedImage[]>([])
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes`)
      return
    }

    setConverting(true)
    
    try {
      const converted = await convertMultipleImages(files, 800, 0.7)
      setPreviews(converted)
      onImagesSelected(converted)
    } catch (error) {
      console.error('Error convirtiendo imágenes:', error)
      alert('Error al procesar imágenes')
    } finally {
      setConverting(false)
    }
  }

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    onImagesSelected(newPreviews)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {converting ? (
              <>
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500">Convirtiendo imágenes...</p>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra las imágenes
                </p>
                <p className="text-xs text-gray-500">
                  Se convertirán automáticamente a WebP 800x800
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={converting}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="mt-1 text-xs text-gray-500">
                {img.width}x{img.height} • {(img.convertedSize / 1024).toFixed(1)}KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
