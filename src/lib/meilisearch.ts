import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

const index = client.index('records')

// Configurar atributos buscables al iniciar
async function configureIndex() {
  try {
    await index.updateSearchableAttributes([
      'titulo',
      'descripcion',
      'texto_ubicacion',
      'ciudad',
      'tags',
      'nombre'
    ])
    
    await index.updateFilterableAttributes([
      'tipo',
      'ciudad',
      'estado',
      'pais',
      'prioridad',
      'tags'
    ])
    
    await index.updateSortableAttributes([
      'timestamp',
      'votos_confianza'
    ])
    
    console.log('✅ Configuración de Meilisearch actualizada')
  } catch (error) {
    console.error('Error configurando Meilisearch:', error)
  }
}

// Ejecutar configuración al cargar
configureIndex()

export async function searchRecords(query: string, filters?: string[]) {
  try {
    const searchParams: any = {
      limit: 50,
    }

    if (query) {
      searchParams.q = query
    }

    if (filters && filters.length > 0) {
      searchParams.filter = filters
    }

    const results = await index.search(query, searchParams)
    return results
  } catch (error) {
    console.error('Error buscando en Meilisearch:', error)
    return { hits: [], estimatedTotalHits: 0, processingTimeMs: 0 }
  }
}

export async function indexRecord(record: any) {
  try {
    await index.addDocuments([record])
  } catch (error) {
    console.error('Error indexando en Meilisearch:', error)
  }
}

export async function deleteRecord(id: string) {
  try {
    await index.deleteDocument(id)
  } catch (error) {
    console.error('Error eliminando de Meilisearch:', error)
  }
}
