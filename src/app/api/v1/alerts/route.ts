import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { alertSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar con Zod
    const validatedData = alertSchema.parse(body)
    
    // Crear en DB
    const alert = await prisma.alert.create({
      data: {
        ...validatedData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        isActive: true
      }
    })
    
    // Indexar en Meilisearch
    try {
      await meilisearch.index('alerts').addDocuments({
        id: alert.id,
        type: 'alert',
        severity: alert.severity,
        alertType: alert.alertType,
        exactLocation: alert.exactLocation,
        description: alert.description,
        locationLat: alert.locationLat,
        locationLng: alert.locationLng,
        createdAt: alert.createdAt.toISOString()
      })
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
      }
    }
    console.error('Error creating alert:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const alertType = searchParams.get('alertType')
    const isActive = searchParams.get('isActive')
    
    const where: any = {}
    if (severity) where.severity = severity
    if (alertType) where.alertType = alertType
    if (isActive !== null) where.isActive = isActive === 'true'
    
    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
