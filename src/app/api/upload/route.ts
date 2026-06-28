import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const recordId = formData.get('recordId') as string

    if (!recordId || !files || files.length === 0) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const imageUrls: string[] = []
    const yearMonth = new Date().toISOString().substring(0, 7)
    const imagesDir = path.join(process.cwd(), 'data', 'images', yearMonth)

    await mkdir(imagesDir, { recursive: true })

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8)
      const filename = `${recordId}-${i + 1}-${hash}.webp`
      const filepath = path.join(imagesDir, filename)

      const processedImage = await sharp(buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer()

      await writeFile(filepath, processedImage)
      imageUrls.push(`/images/${yearMonth}/${filename}`)
    }

    return NextResponse.json({ success: true, images: imageUrls })
  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json({ error: 'Error procesando imágenes' }, { status: 500 })
  }
}
