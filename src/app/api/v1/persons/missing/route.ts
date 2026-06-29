import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { missingPersonSchema } from '@/lib/validators/schemas'
import { MeiliSearch } from 'meilisearch'

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = missingPersonSchema.parse(body)
    
    const missingPerson = await prisma.missingPerson.create({
      data: {
        ...validatedData,
        sourceType: 'INTERNAL',
        verificationStatus: 'UNVERIFIED'
      }
    })
    
    try {
      await meilisearch.index('missing_persons').addDocuments([{
        id: missingPerson.id,
        type: 'missing',
        fullName: missingPerson.fullName,
        ageGroup: missingPerson.ageGroup,
        gender: missingPerson.gender,
        lastSeenLocation: missingPerson.lastSeenLocation,
        clothingDescription: missingPerson.clothingDescription,
        locationLat: missingPerson.locationLat,
        locationLng: missingPerson.locationLng,
        createdAt: missingPerson.createdAt.toISOString()
      }])
    } catch (error) {
      console.error('Error indexando en Meilisearch:', error)
    }
    
    return NextResponse.json(missingPerson, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    console.error('Error creating missing person:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ageGroup = searchParams.get('ageGroup')
    const gender = searchParams.get('gender')
    
    const where: any = {}
    if (ageGroup) where.ageGroup = ageGroup
    if (gender) where.gender = gender
    
    const missingPersons = await prisma.missingPerson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(missingPersons)
  } catch (error) {
    console.error('Error fetching missing persons:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
