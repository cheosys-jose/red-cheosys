import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { indexRecord } from '@/lib/meilisearch'
import { geocodeAddress } from '@/lib/geolocation'

interface FormData {
  nombre?: string
  ubicacion: string
  tipo: string
  descripcion: string
  contacto: string
  titulo?: string
  horario?: string
  imagenes?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json()

    // Validación básica
    if (!body.ubicacion || !body.tipo || !body.descripcion || !body.contacto) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Generar ID único
    const id = crypto.randomUUID()

    // Timestamp actual
    const timestamp = new Date().toISOString()

    // Hash de IP para privacidad
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const salt = process.env.IP_SALT || 'default-salt-change-me'
    const ip_hash = crypto.createHash('sha256').update(ip + salt).digest('hex')

    // Geolocalizar la dirección
    let geoData: any = null
    try {
      geoData = await geocodeAddress(body.ubicacion)
    } catch (error) {
      console.error('Error geolocalizando:', error)
    }

    // Crear entrada
    const entry = {
      id,
      timestamp,
      nombre: body.nombre || '',
      ubicacion: body.ubicacion,
      tipo: body.tipo,
      descripcion: body.descripcion,
      contacto: body.contacto,
      ip_hash,
      // Campos para Meilisearch
      titulo: body.titulo || `${body.tipo} en ${body.ubicacion}`,
      texto_ubicacion: body.ubicacion,
      ciudad: geoData?.city || '',
      estado: geoData?.state || '',
      pais: geoData?.country || 'Venezuela',
      // Coordenadas para búsqueda geográfica
      lat: geoData?.lat || null,
      lng: geoData?.lng || null,
      geo_precision: geoData ? 'exacta' : 'texto',
      // Imágenes
      imagenes: body.imagenes || [],
      // Metadatos
      tags: [body.tipo],
      prioridad: 'media',
      votos_confianza: 0,
      verificado: false,
      estado_moderacion: 'activo'
    }

    // Nombre del archivo basado en fecha
    const date = new Date().toISOString().split('T')[0]
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, `${date}.json`)

    // Leer datos existentes o crear array vacío
    let entries = []
    try {
      const existingData = await readFile(filePath, 'utf-8')
      entries = JSON.parse(existingData)
    } catch (error) {
      // Archivo no existe, empezar con array vacío
    }

    // Agregar nueva entrada
    entries.push(entry)

    // Escribir archivo
    await writeFile(filePath, JSON.stringify(entries, null, 2))

    // Indexar en Meilisearch
    try {
      await indexRecord(entry)
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Datos recibidos correctamente',
      id,
      geo: geoData ? {
        lat: geoData.lat,
        lng: geoData.lng,
        ciudad: geoData.city,
        estado: geoData.state
      } : null
    })
  } catch (error) {
    console.error('Error al procesar datos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
