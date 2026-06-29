const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function verifyMigration() {
  console.log('🔍 Verificando integridad de datos migrados...\n')
  
  try {
    await prisma.$connect()
    
    // Leer JSONs originales para comparar
    const dataDir = path.join(process.cwd(), 'data')
    const jsonFiles = ['2026-06-28.json', '2026-06-29.json']
    
    let originalRecords = []
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        originalRecords = originalRecords.concat(data)
      }
    }
    
    console.log(`📁 Registros en JSONs originales: ${originalRecords.length}`)
    
    // Contar en DB
    const dbCount = {
      alerts: await prisma.alert.count(),
      resources: await prisma.resource.count(),
      missing: await prisma.missingPerson.count(),
      found: await prisma.foundPerson.count(),
      centers: await prisma.center.count()
    }
    
    const totalDb = dbCount.alerts + dbCount.resources + dbCount.missing + dbCount.found + dbCount.centers
    
    console.log(`📊 Registros en base de datos: ${totalDb}`)
    console.log(`   - Alertas: ${dbCount.alerts}`)
    console.log(`   - Recursos: ${dbCount.resources}`)
    console.log(`   - Personas Buscadas: ${dbCount.missing}`)
    console.log(`   - Personas Encontradas: ${dbCount.found}`)
    console.log(`   - Centros: ${dbCount.centers}`)
    
    // Verificar que todos los registros tengan los campos requeridos
    console.log('\n🔎 Verificando campos requeridos:')
    
    // Centros
    const centers = await prisma.center.findMany()
    let centersOk = true
    for (const c of centers) {
      if (!c.name || !c.address || !c.contactPhone) {
        console.log(`   ❌ Centro ${c.id} tiene campos vacíos`)
        centersOk = false
      }
    }
    if (centersOk) console.log('   ✅ Centros: todos los campos requeridos presentes')
    
    // Personas Buscadas
    const missing = await prisma.missingPerson.findMany()
    let missingOk = true
    for (const m of missing) {
      if (!m.fullName || !m.lastSeenLocation || !m.relativeContact) {
        console.log(`   ❌ Persona buscada ${m.id} tiene campos vacíos`)
        missingOk = false
      }
    }
    if (missingOk) console.log('   ✅ Personas Buscadas: todos los campos requeridos presentes')
    
    // Recursos
    const resources = await prisma.resource.findMany()
    let resourcesOk = true
    for (const r of resources) {
      if (!r.category || !r.coverageArea || !r.providerContact) {
        console.log(`   ❌ Recurso ${r.id} tiene campos vacíos`)
        resourcesOk = false
      }
    }
    if (resourcesOk) console.log('   ✅ Recursos: todos los campos requeridos presentes')
    
    // Alertas
    const alerts = await prisma.alert.findMany()
    let alertsOk = true
    for (const a of alerts) {
      if (!a.severity || !a.alertType || !a.exactLocation) {
        console.log(`   ❌ Alerta ${a.id} tiene campos vacíos`)
        alertsOk = false
      }
    }
    if (alertsOk) console.log('   ✅ Alertas: todos los campos requeridos presentes')
    
    console.log('\n✅ Verificación de integridad completada')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyMigration()
