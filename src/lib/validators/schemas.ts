import { z } from 'zod'

// Schema para Alertas
export const alertSchema = z.object({
  severity: z.enum(['CRITICAL', 'URGENT', 'SUPPORT']),
  alertType: z.enum(['TRAPPED', 'FLOOD', 'MEDICAL_EMERGENCY', 'SUPPLY_SHORTAGE', 'STRUCTURAL_DAMAGE']),
  affectedPeople: z.enum(['1-5', '5-10', '10-50', '50+']).optional(),
  exactLocation: z.string().max(150),
  reporterContact: z.string().max(50).optional(),
  description: z.string().max(500),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
})

// Schema para Recursos
export const resourceSchema = z.object({
  category: z.enum(['TRANSPORT_4X4', 'MEDICAL_STAFF', 'RESCUE_STAFF', 'SHELTER_SPACE', 'BULK_DONATION']),
  coverageArea: z.string().max(100),
  availability: z.enum(['IMMEDIATE', 'NIGHT_SHIFT', 'WEEKENDS_ONLY']),
  providerContact: z.string().max(50),
  description: z.string().max(500),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
})

// Schema para Personas Buscadas
export const missingPersonSchema = z.object({
  fullName: z.string().max(100),
  alias: z.string().max(50).optional(),
  ageGroup: z.enum(['BABY', 'CHILD', 'TEEN', 'ADULT', 'ELDERLY']),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']),
  lastSeenLocation: z.string().max(150),
  clothingDescription: z.string().max(100).optional(),
  distinctiveFeatures: z.string().max(300).optional(),
  relativeContact: z.string().max(50),
  additionalInfo: z.string().max(500).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
})

// Schema para Personas Encontradas
export const foundPersonSchema = z.object({
  condition: z.enum(['CONSCIOUS_DISORIENTED', 'UNCONSCIOUS', 'UNACCOMPANIED_MINOR', 'DECEASED']),
  declaredName: z.string().max(100).optional(),
  currentSafeLocation: z.string().max(150),
  estimatedAgeGroup: z.enum(['BABY', 'CHILD', 'TEEN', 'ADULT', 'ELDERLY']),
  estimatedGender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']),
  clothingDescription: z.string().max(100).optional(),
  custodianContact: z.string().max(50),
  additionalInfo: z.string().max(500).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
})

// Schema para Centros
export const centerSchema = z.object({
  centerType: z.enum(['DONATION_HUB', 'TEMPORARY_SHELTER', 'MEDICAL_POINT']),
  name: z.string().max(100),
  address: z.string().max(150),
  criticalNeeds: z.string().max(300).optional(),
  contactPhone: z.string().max(50),
  description: z.string().max(500).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
})

export type AlertInput = z.infer<typeof alertSchema>
export type ResourceInput = z.infer<typeof resourceSchema>
export type MissingPersonInput = z.infer<typeof missingPersonSchema>
export type FoundPersonInput = z.infer<typeof foundPersonSchema>
export type CenterInput = z.infer<typeof centerSchema>
