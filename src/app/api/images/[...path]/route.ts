import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    const fullPath = path.join(process.cwd(), 'data', 'images', imagePath)

    console.log('🖼️ Buscando imagen:', fullPath)

    // Verificar que el archivo existe
    if (!existsSync(fullPath)) {
      console.error('❌ Imagen no encontrada:', fullPath)
      return new NextResponse('Imagen no encontrada', { status: 404 })
    }

    // Verificar que no salga del directorio de imágenes
    const imagesDir = path.join(process.cwd(), 'data', 'images')
    if (!fullPath.startsWith(imagesDir)) {
      console.error('❌ Acceso denegado:', fullPath)
      return new NextResponse('Acceso denegado', { status: 403 })
    }

    const imageBuffer = await readFile(fullPath)
    console.log('✅ Imagen servida:', imagePath, `(${imageBuffer.length} bytes)`)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('❌ Error sirviendo imagen:', error)
    return new NextResponse('Error interno', { status: 500 })
  }
}
