// src/lib/eventTypes.ts

export const EVENT_TYPES = [
  { value: 'earthquake', label: 'Terremoto', icon: '🌍' },
  { value: 'flood', label: 'Inundación', icon: '🌊' },
  { value: 'hurricane', label: 'Huracán', icon: '🌀' },
  { value: 'tornado', label: 'Tornado', icon: '🌪️' },
  { value: 'wildfire', label: 'Incendio Forestal', icon: '🔥' },
  { value: 'volcanic_eruption', label: 'Erupción Volcánica', icon: '🌋' },
  { value: 'tsunami', label: 'Tsunami', icon: '🌊' },
  { value: 'landslide', label: 'Deslizamiento', icon: '⛰️' },
  { value: 'industrial_accident', label: 'Accidente Industrial', icon: '🏭' },
  { value: 'building_collapse', label: 'Derrumbe de Edificio', icon: '🏚️' },
  { value: 'chemical_spill', label: 'Derrame Químico', icon: '☣️' },
  { value: 'pandemic', label: 'Pandemia', icon: '' },
  { value: 'drought', label: 'Sequía', icon: '🏜️' },
  { value: 'extreme_heat', label: 'Ola de Calor', icon: '️' },
  { value: 'extreme_cold', label: 'Ola de Frío', icon: '❄️' },
  { value: 'other', label: 'Otro', icon: '⚠️' }
]

export const ALERT_TYPES = [
  { value: 'trapped_persons', label: 'Personas Atrapadas', icon: '👤' },
  { value: 'medical_emergency', label: 'Emergencia Médica', icon: '🏥' },
  { value: 'supply_shortage', label: 'Escasez de Suministros', icon: '' },
  { value: 'structural_damage', label: 'Daño Estructural', icon: '️' },
  { value: 'evacuation_needed', label: 'Evacuación Necesaria', icon: '🚨' },
  { value: 'search_and_rescue', label: 'Búsqueda y Rescate', icon: '🔍' },
  { value: 'infrastructure_damage', label: 'Daño a Infraestructura', icon: '' },
  { value: 'communication_blackout', label: 'Corte de Comunicaciones', icon: '📡' }
]