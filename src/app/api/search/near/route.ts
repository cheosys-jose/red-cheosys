import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { calculateDistance } from '@/lib/geolocation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '10') // km por defecto

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Se requieren coordenadas (lat, lng)' },
        { status: 400 }
      )
    }

    // Leer todos los archivos JSON de los últimos 30 días
    const dataDir = path.join(process.cwd(), 'data')
    let allRecords: any[] = []

    try {
      const files = await readFile(path.join(dataDir, 'files.txt'), 'utf-8')
      const jsonFiles = files.split('\n').filter(f => f.endsWith('.json'))
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(dataDir, file)
          const data = await readFile(filePath, 'utf-8')
          const records = JSON.parse(data)
          allRecords = allRecords.concat(records)
        } catch (error) {
          // Ignorar archivos que no se puedan leer
        }
      }
    } catch (error) {
      // Si no existe files.txt, leer archivos manualmente
      const fs = require('fs')
      const files = fs.readdirSync(dataDir).filter((f: string) => f.endsWith('.json'))
      
      for (const file of files) {
        try {
          const filePath = path.join(dataDir, file)
          const data = await readFile(filePath, 'utf-8')
          const records = JSON.parse(data)
          allRecords = allRecords.concat(records)
        } catch (error) {
          // Ignorar archivos que no se puedan leer
        }
      }
    }

    // Filtrar registros con coordenadas y calcular distancia
    const nearbyRecords = allRecords
      .filter(record => record.lat && record.lng)
      .map(record => ({
        ...record,
        distance: calculateDistance(lat, lng, record.lat, record.lng)
      }))
      .filter(record => record.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      results: nearbyRecords,
      total: nearbyRecords.length,
      center: { lat, lng },
      radius
    })
  } catch (error) {
    console.error('Error en búsqueda por cercanía:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
