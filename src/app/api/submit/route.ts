import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { indexRecord } from '@/lib/meilisearch'
import { geocodeAddress } from '@/lib/geolocation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const tipo = formData.get('tipo') as string
    const ubicacion = formData.get('ubicacion') as string
    const descripcion = formData.get('descripcion') as string
    const contacto = formData.get('contacto') as string
    const nombre = (formData.get('nombre') as string) || ''
    const titulo = (formData.get('titulo') as string) || ''
    const horario = (formData.get('horario') as string) || ''

    if (!ubicacion || !descripcion || !contacto) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    
    // Geolocalizar
    let geoData: any = null
    try {
      geoData = await geocodeAddress(ubicacion)
    } catch (error) {
      console.error('Error geolocalizando:', error)
    }

    // Procesar imágenes - SIN SHARP por ahora
    const imageUrls: string[] = []
    const files = formData.getAll('imagenes')
    
    if (files.length > 0) {
      const yearMonth = new Date().toISOString().substring(0, 7)
      const imagesDir = path.join(process.cwd(), 'data', 'images', yearMonth)
      await mkdir(imagesDir, { recursive: true })

      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i]
        if (!(file instanceof File)) continue
        
        // Validar tamaño (2MB máximo)
        if (file.size > 2 * 1024 * 1024) {
          console.log(`⚠️ Imagen ${i + 1} muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
          continue
        }
        
        if (!file.type.startsWith('image/')) continue

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8)
        
        // Detectar extensión
        const ext = file.type.split('/')[1] || 'jpg'
        const filename = `${id}-${i + 1}-${hash}.${ext}`
        const filepath = path.join(imagesDir, filename)

        await writeFile(filepath, buffer)
        imageUrls.push(`/images/${yearMonth}/${filename}`)
      }
    }

    const entry = {
      id,
      timestamp,
      nombre,
      ubicacion,
      tipo: tipo || 'otro',
      descripcion,
      contacto,
      titulo: titulo || `${tipo || 'registro'} en ${ubicacion}`,
      texto_ubicacion: ubicacion,
      ciudad: geoData?.city || '',
      estado: geoData?.state || '',
      pais: geoData?.country || '',
      lat: geoData?.lat || null,
      lng: geoData?.lng || null,
      horario,
      imagenes: imageUrls,
      tags: [tipo || 'otro'],
      prioridad: 'media',
      votos_confianza: 0,
      verificado: false,
      estado_moderacion: 'activo'
    }

    // Guardar
    const date = new Date().toISOString().split('T')[0]
    const filePath = path.join(process.cwd(), 'data', `${date}.json`)

    let entries = []
    try {
      entries = JSON.parse(await readFile(filePath, 'utf-8'))
    } catch (error) {}

    entries.push(entry)
    await writeFile(filePath, JSON.stringify(entries, null, 2))

    // Indexar
    try {
      await indexRecord(entry)
    } catch (error) {
      console.error('Error indexando:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Datos recibidos',
      id,
      geo: geoData,
      imagenes: imageUrls
    })
  } catch (error) {
    console.error('ERROR:', error)
    return NextResponse.json(
      { error: 'Error interno', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
