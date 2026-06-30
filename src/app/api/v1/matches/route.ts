import { PrismaClient } from '@prisma/client'
import { MeiliSearch } from 'meilisearch'
import { haversineDistance, normalizeText } from './matching'

const prisma = new PrismaClient()
const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'red-cheosys-2026-change-me'
})

export interface MatchCandidate {
  id: string
  score: number
  reason: string
  data: any
}

/**
 * Sistema de matching determinístico para reunir familias
 * NO usa LLMs - solo algoritmos matemáticos
 */
export async function findMatches(
  searchType: 'missing' | 'found',
  entityId: string
): Promise<MatchCandidate[]> {
  const matches: MatchCandidate[] = []
  
  if (searchType === 'missing') {
    // Buscar personas encontradas que coincidan con esta persona desaparecida
    const missing = await prisma.missingPerson.findUnique({
      where: { id: entityId }
    })
    
    if (!missing) return []
    
    // Buscar en Meilisearch
    const searchResults = await meilisearch.index('found_persons').search(
      missing.fullName,
      {
        limit: 50,
        attributesToRetrieve: ['*']
      }
    )
    
    for (const found of searchResults.hits) {
      const score = calculateMatchScore(missing, found)
      
      if (score > 30) { // Umbral mínimo de similitud
        matches.push({
          id: found.id,
          score,
          reason: generateMatchReason(missing, found, score),
          data: found
        })
      }
    }
  } else {
    // Buscar personas desaparecidas que coincidan con esta persona encontrada
    const found = await prisma.foundPerson.findUnique({
      where: { id: entityId }
    })
    
    if (!found) return []
    
    const searchResults = await meilisearch.index('missing_persons').search(
      found.declaredName || '',
      {
        limit: 50,
        attributesToRetrieve: ['*']
      }
    )
    
    for (const missing of searchResults.hits) {
      const score = calculateMatchScore(missing, found)
      
      if (score > 30) {
        matches.push({
          id: missing.id,
          score,
          reason: generateMatchReason(missing, found, score),
          data: missing
        })
      }
    }
  }
  
  // Ordenar por score descendente
  return matches.sort((a, b) => b.score - a.score)
}

function calculateMatchScore(missing: any, found: any): number {
  let score = 0
  const weights = {
    name: 40,
    age: 25,
    location: 20,
    description: 15
  }
  
  // 1. Coincidencia de nombre (40 puntos)
  if (missing.fullName && found.declaredName) {
    const missingNorm = normalizeText(missing.fullName)
    const foundNorm = normalizeText(found.declaredName)
    
    // Coincidencia exacta
    if (missingNorm === foundNorm) {
      score += weights.name
    } 
    // Coincidencia parcial (tokens compartidos)
    else {
      const missingTokens = new Set(missingNorm.split(' '))
      const foundTokens = new Set(foundNorm.split(' '))
      const intersection = [...missingTokens].filter(t => foundTokens.has(t))
      const union = new Set([...missingTokens, ...foundTokens])
      
      const jaccardSimilarity = intersection.length / union.size
      score += weights.name * jaccardSimilarity
    }
  }
  
  // 2. Coincidencia de edad (25 puntos)
  if (missing.ageGroup && found.estimatedAgeGroup) {
    if (missing.ageGroup === found.estimatedAgeGroup) {
      score += weights.age
    } else {
      // Grupos adyacentes (CHILD/TEEN, BABY/CHILD)
      const adjacent = [
        ['BABY', 'CHILD'],
        ['CHILD', 'TEEN'],
        ['TEEN', 'ADULT']
      ]
      
      if (adjacent.some(pair => 
        pair.includes(missing.ageGroup) && pair.includes(found.estimatedAgeGroup)
      )) {
        score += weights.age * 0.5
      }
    }
  }
  
  // 3. Proximidad geográfica (20 puntos)
  if (missing.locationLat && missing.locationLng && 
      found.locationLat && found.locationLng) {
    const distance = haversineDistance(
      missing.locationLat, missing.locationLng,
      found.locationLat, found.locationLng
    )
    
    if (distance < 10) score += weights.location // < 10km
    else if (distance < 50) score += weights.location * 0.7 // < 50km
    else if (distance < 100) score += weights.location * 0.3 // < 100km
  }
  
  // 4. Coincidencia de descripción (15 puntos)
  if (missing.clothingDescription && found.clothingDescription) {
    const missingTokens = new Set(
      normalizeText(missing.clothingDescription).split(' ').filter(t => t.length > 3)
    )
    const foundTokens = new Set(
      normalizeText(found.clothingDescription).split(' ').filter(t => t.length > 3)
    )
    
    const intersection = [...missingTokens].filter(t => foundTokens.has(t))
    
    if (intersection.length > 0) {
      score += weights.location * Math.min(intersection.length / 3, 1)
    }
  }
  
  return Math.round(score)
}

function generateMatchReason(missing: any, found: any, score: number): string {
  const reasons: string[] = []
  
  if (score >= 80) {
    reasons.push('🎯 Coincidencia muy alta')
  } else if (score >= 60) {
    reasons.push('⚠️ Coincidencia probable')
  } else {
    reasons.push('🔍 Posible coincidencia')
  }
  
  if (missing.fullName && found.declaredName) {
    const missingNorm = normalizeText(missing.fullName)
    const foundNorm = normalizeText(found.declaredName)
    
    if (missingNorm === foundNorm) {
      reasons.push('Nombre exacto')
    } else {
      reasons.push('Nombre similar')
    }
  }
  
  if (missing.ageGroup === found.estimatedAgeGroup) {
    reasons.push('Misma edad')
  }
  
  return reasons.join(' | ')
}

/**
 * Endpoint API para obtener matches
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type') as 'missing' | 'found'
  
  if (!id || !type) {
    return Response.json(
      { error: 'Missing id or type parameter' },
      { status: 400 }
    )
  }
  
  try {
    const matches = await findMatches(type, id)
    
    return Response.json({
      entityId: id,
      entityType: type,
      totalMatches: matches.length,
      matches: matches.map(m => ({
        id: m.id,
        score: m.score,
        reason: m.reason,
        ...m.data
      }))
    })
  } catch (error) {
    console.error('Error finding matches:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
