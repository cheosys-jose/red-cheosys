import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { resourceSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resourceSchema.parse(body)
    
    const resource = await prisma.resource.create({
      data: {
        ...validatedData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        status: 'AVAILABLE'
      }
    })
    
    try {
      await meilisearch.index('resources').addDocuments({
        id: resource.id,
        type: 'resource',
        category: resource.category,
        coverageArea: resource.coverageArea,
        description: resource.description,
        locationLat: resource.locationLat,
        locationLng: resource.locationLng,
        createdAt: resource.createdAt.toISOString()
      })
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    console.error('Error creating resource:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    
    const where: any = {}
    if (category) where.category = category
    if (status) where.status = status
    
    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
