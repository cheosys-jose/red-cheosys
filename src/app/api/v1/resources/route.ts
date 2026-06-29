import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { resourceSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'
import { z } from 'zod'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

const resourceSchemaWithImages = resourceSchema.extend({
  imageUrls: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resourceSchemaWithImages.parse(body)
    
    const { imageUrls, ...resourceData } = validatedData
    
    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED',
        status: 'AVAILABLE'
      }
    })

    if (imageUrls && imageUrls.length > 0) {
      for (const url of imageUrls) {
        await prisma.image.create({
          data: {
            url,
            resourceId: resource.id
          }
        })
      }
    }
    
    try {
      await meilisearch.index('resources').addDocuments([{
        id: resource.id,
        type: 'resource',
        category: resource.category,
        coverageArea: resource.coverageArea,
        description: resource.description,
        locationLat: resource.locationLat,
        locationLng: resource.locationLng,
        createdAt: resource.createdAt.toISOString()
      }])
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
      include: {
        images: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
