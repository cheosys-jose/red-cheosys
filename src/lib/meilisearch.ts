import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export const index = client.index('records')

export async function indexRecord(record: any) {
  try {
    return await index.addDocuments([record])
  } catch (error) {
    console.error('Error indexando en Meilisearch:', error)
    throw error
  }
}

export async function searchRecords(query: string, filters?: string[]) {
  try {
    const searchParams: any = {
      limit: 20,
      attributesToHighlight: ['titulo', 'descripcion'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    }
    
    if (filters && filters.length > 0) {
      searchParams.filter = filters
    }
    
    return await index.search(query, searchParams)
  } catch (error) {
    console.error('Error buscando en Meilisearch:', error)
    throw error
  }
}

export async function deleteRecord(id: string) {
  try {
    return await index.deleteDocument(id)
  } catch (error) {
    console.error('Error eliminando de Meilisearch:', error)
    throw error
  }
}
