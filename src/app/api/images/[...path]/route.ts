import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    const fullPath = path.join(process.cwd(), 'data', 'images', imagePath)

    if (!fullPath.startsWith(path.join(process.cwd(), 'data', 'images'))) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const imageBuffer = await readFile(fullPath)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
  }
}
