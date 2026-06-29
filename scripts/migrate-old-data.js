const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Migrando datos antiguos...\n')
  
  const dataDir = path.join(process.cwd(), 'data')
  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('backup') && !f.includes('metrics'))
  
  let totalMigrated = 0
  
  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file)
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`📁 Procesando: ${file} (${data.length} registros)`)
      
      for (const record of data) {
        try {
          switch (record.tipo) {
            case 'centro':
              await prisma.center.create({
                data: {
                  name: record.nombre || record.titulo || 'Sin nombre',
                  address: record.ubicacion,
                  centerType: 'DONATION_HUB',
                  contactPhone: record.contacto || '',
                  description: record.descripcion || '',
                  locationLat: record.lat,
                  locationLng: record.lng,
                  verificationStatus: 'UNVERIFIED',
                  sourceType: 'INTERNAL',
                  criticalNeeds: record.tags?.join(', ') || null,
                  capacityStatus: 'RECEIVING'
                }
              })
              console.log(`  ✅ Centro creado: ${record.nombre}`)
              break
            
            case 'necesita':
              // Migrar como Alerta
              await prisma.alert.create({
                data: {
                  severity: 'URGENT',
                  alertType: 'SUPPLY_SHORTAGE',
                  exactLocation: record.ubicacion,
                  reporterContact: record.contacto || '',
                  description: record.descripcion || '',
                  locationLat: record.lat,
                  locationLng: record.lng,
                  verificationStatus: 'UNVERIFIED',
                  sourceType: 'INTERNAL',
                  isActive: true
                }
              })
              console.log(`  ✅ Alerta creada: ${record.nombre || 'Sin nombre'}`)
              break
            
            case 'ofrece':
              await prisma.resource.create({
                data: {
                  category: 'BULK_DONATION',
                  coverageArea: record.ubicacion,
                  providerContact: record.contacto || '',
                  description: record.descripcion || '',
                  locationLat: record.lat,
                  locationLng: record.lng,
                  verificationStatus: 'UNVERIFIED',
                  sourceType: 'INTERNAL',
                  availability: 'IMMEDIATE',
                  status: 'AVAILABLE'
                }
              })
              console.log(`  ✅ Recurso creado: ${record.nombre || 'Sin nombre'}`)
              break
            
            case 'desaparecido':
              await prisma.missingPerson.create({
                data: {
                  fullName: record.nombre || 'Desconocido',
                  lastSeenLocation: record.ubicacion,
                  clothingDescription: record.descripcion || '',
                  relativeContact: record.contacto || '',
                  locationLat: record.lat,
                  locationLng: record.lng,
                  verificationStatus: 'UNVERIFIED',
                  sourceType: 'INTERNAL',
                  ageGroup: 'ADULT',
                  gender: 'UNKNOWN'
                }
              })
              console.log(`  ✅ Persona buscada: ${record.nombre}`)
              break
            
            default:
              console.log(`  ⚠️  Tipo no reconocido: ${record.tipo}`)
          }
          totalMigrated++
        } catch (err) {
          console.error(`  ❌ Error migrando registro ${record.id}:`, err.message)
        }
      }
      
      console.log(`✅ ${file} procesado\n`)
    } catch (error) {
      console.error(`❌ Error leyendo ${file}:`, error.message)
    }
  }
  
  console.log(`\n🎉 Migración completada: ${totalMigrated} registros migrados`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
