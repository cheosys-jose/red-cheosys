import axios from 'axios'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

interface GeocodingResult {
  lat: number
  lng: number
  display_name: string
  city?: string
  state?: string
  country?: string
}

/**
 * Convierte una dirección en coordenadas geográficas
 * @param address - Dirección o lugar a buscar
 * @returns Coordenadas y datos de ubicación
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'RedCheoSys/1.0 (https://red.cheosys.com)'
      }
    })

    if (response.data && response.data.length > 0) {
      const result = response.data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        state: result.address?.state,
        country: result.address?.country
      }
    }

    return null
  } catch (error) {
    console.error('Error en geocodificación:', error)
    return null
  }
}

/**
 * Convierte coordenadas en dirección (reverse geocoding)
 * @param lat - Latitud
 * @param lng - Longitud
 * @returns Dirección y datos de ubicación
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'RedCheoSys/1.0 (https://red.cheosys.com)'
      }
    })

    if (response.data) {
      const result = response.data
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        state: result.address?.state,
        country: result.address?.country
      }
    }

    return null
  } catch (error) {
    console.error('Error en geocodificación inversa:', error)
    return null
  }
}

/**
 * Calcula distancia entre dos puntos (fórmula de Haversine)
 * @returns Distancia en kilómetros
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
