import { NextRequest, NextResponse } from 'next/server'
import { MeiliSearch } from 'meilisearch'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const tipo = searchParams.get('tipo') || ''

    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
    })

    const index = client.index('records')

    const filters: string[] = []
    if (tipo) filters.push(`tipo = "${tipo}"`)

    const results = await index.search(q, {
      limit: 50,
      filter: filters.length > 0 ? filters : undefined
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error en búsqueda:', error)
    return NextResponse.json({ hits: [], estimatedTotalHits: 0, processingTimeMs: 0 })
  }
}
