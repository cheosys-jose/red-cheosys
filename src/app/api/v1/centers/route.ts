import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { centerSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = centerSchema.parse(body)
    
    const center = await prisma.center.create({
      data: {
        ...validatedData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        capacityStatus: 'RECEIVING'
      }
    })
    
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
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(centers)
  } catch (error) {
    console.error('Error fetching centers:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
