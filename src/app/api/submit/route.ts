import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import { indexRecord } from '@/lib/meilisearch'
import { geocodeAddress } from '@/lib/geolocation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 [SUBMIT] Iniciando...')
    const formData = await request.formData()
    
    const tipo = formData.get('tipo') as string
    const ubicacion = formData.get('ubicacion') as string
    const descripcion = formData.get('descripcion') as string
    const contacto = formData.get('contacto') as string
    const nombre = (formData.get('nombre') as string) || ''
    const titulo = (formData.get('titulo') as string) || ''
    const horario = (formData.get('horario') as string) || ''

    console.log('📋 Datos:', { tipo, ubicacion })

    if (!ubicacion || !descripcion || !contacto) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    
    // Geolocalizar
    let geoData: any = null
    try {
      geoData = await geocodeAddress(ubicacion)
    } catch (error) {
      console.error('Error geo:', error)
    }

    // Procesar imágenes
    const imageUrls: string[] = []
    const files = formData.getAll('imagenes')
    console.log(`📷 Archivos: ${files.length}`)
    
    if (files.length > 0) {
      const yearMonth = new Date().toISOString().substring(0, 7)
      const imagesDir = path.join(process.cwd(), 'data', 'images', yearMonth)
      await mkdir(imagesDir, { recursive: true })

      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file: any = files[i]
        
        // Verificar si es un archivo válido
        if (!file || !file.type || !file.arrayBuffer) {
          console.log(`⚠️ Archivo ${i} inválido`)
          continue
        }
        
        console.log(`📄 File ${i}: ${(file.size/1024).toFixed(1)}KB, type: ${file.type}`)
        
        if (file.size > 2 * 1024 * 1024) {
          console.log('⚠️ Muy grande')
          continue
        }
        
        if (!file.type.startsWith('image/')) {
          console.log('⚠️ No es imagen')
          continue
        }

        try {
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
          console.log(`✅ Imagen guardada: ${filename}`)
        } catch (err) {
          console.error('❌ Error procesando imagen:', err)
        }
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
    } catch (e) {}
    
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
    console.error('❌ ERROR:', error)
    return NextResponse.json(
      { error: 'Error interno', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
