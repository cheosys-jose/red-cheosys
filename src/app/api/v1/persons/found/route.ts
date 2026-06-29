import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { foundPersonSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = foundPersonSchema.parse(body)
    
    const foundPerson = await prisma.foundPerson.create({
      data: {
        ...validatedData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED'
      }
    })
    
    try {
      await meilisearch.index('found_persons').addDocuments([{
        id: foundPerson.id,
        type: 'found',
        condition: foundPerson.condition,
        declaredName: foundPerson.declaredName,
        currentSafeLocation: foundPerson.currentSafeLocation,
        estimatedAgeGroup: foundPerson.estimatedAgeGroup,
        estimatedGender: foundPerson.estimatedGender,
        locationLat: foundPerson.locationLat,
        locationLng: foundPerson.locationLng,
        createdAt: foundPerson.createdAt.toISOString()
      }])
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(foundPerson, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    console.error('Error creating found person:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condition = searchParams.get('condition')
    const estimatedAgeGroup = searchParams.get('estimatedAgeGroup')
    
    const where: any = {}
    if (condition) where.condition = condition
    if (estimatedAgeGroup) where.estimatedAgeGroup = estimatedAgeGroup
    
    const foundPersons = await prisma.foundPerson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(foundPersons)
  } catch (error) {
    console.error('Error fetching found persons:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
