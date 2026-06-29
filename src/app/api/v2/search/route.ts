import { NextRequest, NextResponse } from 'next/server'
import { MeiliSearch } from 'meilisearch'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const type = searchParams.get('type') || '' // alerts, resources, missing, found, centers
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const indices = type ? [type] : ['alerts', 'resources', 'missing_persons', 'found_persons', 'centers']
    
    const allHits: any[] = []
    let totalHits = 0

    // Consultar cada índice
    for (const indexName of indices) {
      try {
        const index = meilisearch.index(indexName)
        const results = await index.search(q, {
          limit,
          offset,
          attributesToRetrieve: ['*']
        })
        
        // Agregar tipo a cada hit
        const hitsWithType = results.hits.map(hit => ({
          ...hit,
          entityType: indexName
        }))
        
        allHits.push(...hitsWithType)
        totalHits += results.estimatedTotalHits
      } catch (error) {
        console.error(`Error buscando en ${indexName}:`, error)
      }
    }

    // Ordenar por fecha de creación (más reciente primero)
    allHits.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })

    return NextResponse.json({
      hits: allHits,
      estimatedTotalHits: totalHits,
      processingTimeMs: 0
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error en búsqueda unificada:', error)
    return NextResponse.json({ 
      hits: [], 
      estimatedTotalHits: 0, 
      processingTimeMs: 0 
    })
  }
}
