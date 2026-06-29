import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const linkSchema = z.object({
  title: z.string().max(100),
  url: z.string().url(),
  description: z.string().max(300),
  category: z.enum(['official', 'missing', 'centers', 'news']),
  submitterName: z.string().max(100).optional(),
  submitterEmail: z.string().email().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = linkSchema.parse(body)
    
    const link = await prisma.externalLink.create({
      data: {
        ...validatedData,
        status: 'pending',
        verified: false
      }
    })
    
    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 })
    }
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'approved' // Solo mostrar aprobados por defecto
    
    const where: any = {}
    if (category) where.category = category
    if (status) where.status = status
    
    const links = await prisma.externalLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
