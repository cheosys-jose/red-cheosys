import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { centerSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'
import { z } from 'zod'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

const centerSchemaWithImages = centerSchema.extend({
  imageUrls: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = centerSchemaWithImages.parse(body)
    
    const { imageUrls, ...centerData } = validatedData
    
    const center = await prisma.center.create({
      data: {
        ...centerData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        capacityStatus: 'RECEIVING'
      }
    })

    if (imageUrls && imageUrls.length > 0) {
      for (const url of imageUrls) {
        await prisma.image.create({
          data: {
            url,
            centerId: center.id
          }
        })
      }
    }
    
    try {
      await meilisearch.index('centers').addDocuments([{
        id: center.id,
        type: 'center',
        name: center.name,
        centerType: center.centerType,
        address: center.address,
        criticalNeeds: center.criticalNeeds,
        locationLat: center.locationLat,
        locationLng: center.locationLng,
        createdAt: center.createdAt.toISOString()
      }])
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(center, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    console.error('Error creating center:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerType = searchParams.get('centerType')
    const capacityStatus = searchParams.get('capacityStatus')
    
    const where: any = {}
    if (centerType) where.centerType = centerType
    if (capacityStatus) where.capacityStatus = capacityStatus
    
    const centers = await prisma.center.findMany({
      where,
      include: {
        images: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(centers)
  } catch (error) {
    console.error('Error fetching centers:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
