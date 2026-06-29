export interface ConvertedImage {
  file: File
  preview: string
  originalSize: number
  convertedSize: number
  width: number
  height: number
}

export async function convertImageToWebP(
  file: File,
  maxSize: number = 800,
  quality: number = 0.7
): Promise<ConvertedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calcular dimensiones manteniendo aspect ratio
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        // Crear canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto 2D'))
          return
        }
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al convertir imagen'))
              return
            }
            
            const convertedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp'
            })
            
            resolve({
              file: convertedFile,
              preview: canvas.toDataURL('image/webp', quality),
              originalSize: file.size,
              convertedSize: blob.size,
              width,
              height
            })
          },
          'image/webp',
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Error al leer archivo'))
    reader.readAsDataURL(file)
  })
}

export async function convertMultipleImages(
  files: File[],
  maxSize: number = 800,
  quality: number = 0.7
): Promise<ConvertedImage[]> {
  const results: ConvertedImage[] = []
  
  for (const file of files) {
    try {
      const converted = await convertImageToWebP(file, maxSize, quality)
      results.push(converted)
    } catch (error) {
      console.error(`Error convirtiendo ${file.name}:`, error)
    }
  }
  
  return results
}
