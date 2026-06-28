import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import { indexRecord } from '@/lib/meilisearch'
import { geocodeAddress } from '@/lib/geolocation'

export async function POST(request: NextRequest) {
  try {
    // Manejar tanto JSON como FormData
    const contentType = request.headers.get('content-type') || ''
    
    let data: any = {}
    let imagenesFiles: File[] = []
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      data.tipo = formData.get('tipo')
      data.ubicacion = formData.get('ubicacion')
      data.descripcion = formData.get('descripcion')
      data.contacto = formData.get('contacto')
      data.nombre = formData.get('nombre')
      data.titulo = formData.get('titulo')
      data.horario = formData.get('horario')
      
      // Obtener imágenes
      const files = formData.getAll('imagenes')
      imagenesFiles = files.filter(f => f instanceof File) as File[]
    } else {
      data = await request.json()
    }

    // Validación
    if (!data.ubicacion || !data.tipo || !data.descripcion || !data.contacto) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const salt = process.env.IP_SALT || 'default-salt-change-me'
    const ip_hash = crypto.createHash('sha256').update(ip + salt).digest('hex')

    // Geolocalizar
    let geoData: any = null
    try {
      geoData = await geocodeAddress(data.ubicacion)
    } catch (error) {
      console.error('Error geolocalizando:', error)
    }

    // Procesar imágenes si existen
    const imageUrls: string[] = []
    if (imagenesFiles.length > 0) {
      const yearMonth = new Date().toISOString().substring(0, 7)
      const imagesDir = path.join(process.cwd(), 'data', 'images', yearMonth)
      await mkdir(imagesDir, { recursive: true })

      for (let i = 0; i < Math.min(imagenesFiles.length, 3); i++) {
        const file = imagenesFiles[i]
        if (!file.type.startsWith('image/')) continue

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8)
        const filename = `${id}-${i + 1}-${hash}.webp`
        const filepath = path.join(imagesDir, filename)

        const processedImage = await sharp(buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 70 })
          .toBuffer()

        await writeFile(filepath, processedImage)
        imageUrls.push(`/images/${yearMonth}/${filename}`)
      }
    }

    // Crear registro
    const entry = {
      id,
      timestamp,
      nombre: data.nombre || '',
      ubicacion: data.ubicacion,
      tipo: data.tipo,
      descripcion: data.descripcion,
      contacto: data.contacto,
      ip_hash,
      titulo: data.titulo || `${data.tipo} en ${data.ubicacion}`,
      texto_ubicacion: data.ubicacion,
      ciudad: geoData?.city || '',
      estado: geoData?.state || '',
      pais: geoData?.country || 'Venezuela',
      lat: geoData?.lat || null,
      lng: geoData?.lng || null,
      geo_precision: geoData ? 'exacta' : 'texto',
      horario: data.horario || '',
      imagenes: imageUrls,
      tags: [data.tipo],
      prioridad: 'media',
      votos_confianza: 0,
      verificado: false,
      estado_moderacion: 'activo'
    }

    // Guardar en JSON
    const date = new Date().toISOString().split('T')[0]
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, `${date}.json`)

    let entries = []
    try {
      const existingData = await readFile(filePath, 'utf-8')
      entries = JSON.parse(existingData)
    } catch (error) {
      // Archivo no existe
    }

    entries.push(entry)
    await writeFile(filePath, JSON.stringify(entries, null, 2))

    // Indexar en Meilisearch
    try {
      await indexRecord(entry)
    } catch (error) {
      console.error('Error indexando:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Datos recibidos correctamente',
      id,
      geo: geoData,
      imagenes: imageUrls
    })
  } catch (error) {
    console.error('Error al procesar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
