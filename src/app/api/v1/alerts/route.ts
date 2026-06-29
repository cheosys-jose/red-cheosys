import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { alertSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'
import { z } from 'zod'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

const alertSchemaWithImages = alertSchema.extend({
  imageUrls: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Recibiendo POST /api/v1/alerts')
    const body = await request.json()
    console.log('📋 Body recibido:', JSON.stringify(body, null, 2))
    
    const validatedData = alertSchemaWithImages.parse(body)
    console.log('✅ Datos validados:', validatedData)
    
    const { imageUrls, ...alertData } = validatedData
    
    const alert = await prisma.alert.create({
      data: {
        ...alertData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        isActive: true
      }
    })
    console.log('✅ Alert creada en DB:', alert.id)

    // Crear registros de imágenes si hay URLs
    if (imageUrls && imageUrls.length > 0) {
      for (const url of imageUrls) {
        await prisma.image.create({
          data: {
            url,
            alertId: alert.id
          }
        })
      }
      console.log(`✅ ${imageUrls.length} imágenes asociadas`)
    }
    
    try {
      await meilisearch.index('alerts').addDocuments([{
        id: alert.id,
        type: 'alert',
        severity: alert.severity,
        alertType: alert.alertType,
        exactLocation: alert.exactLocation,
        description: alert.description,
        locationLat: alert.locationLat,
        locationLng: alert.locationLng,
        createdAt: alert.createdAt.toISOString()
      }])
      console.log('✅ Indexada en Meilisearch')
    } catch (error) {
      console.error('❌ Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('❌ Error completo:', error)
    console.error('❌ Tipo de error:', error instanceof Error ? error.name : 'Unknown')
    console.error('❌ Mensaje:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
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
      include: {
        images: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
