const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...\n')
  
  try {
    // Test 1: Conexión básica
    await prisma.$connect()
    console.log('✅ Conexión exitosa a SQLite\n')
    
    // Test 2: Contar registros en cada tabla
    console.log('📊 Contando registros:')
    
    const alertCount = await prisma.alert.count()
    console.log(`   Alertas: ${alertCount}`)
    
    const resourceCount = await prisma.resource.count()
    console.log(`   Recursos: ${resourceCount}`)
    
    const missingCount = await prisma.missingPerson.count()
    console.log(`   Personas Buscadas: ${missingCount}`)
    
    const foundCount = await prisma.foundPerson.count()
    console.log(`   Personas Encontradas: ${foundCount}`)
    
    const centerCount = await prisma.center.count()
    console.log(`   Centros: ${centerCount}`)
    
    const imageCount = await prisma.image.count()
    console.log(`   Imágenes: ${imageCount}`)
    
    const total = alertCount + resourceCount + missingCount + foundCount + centerCount
    console.log(`\n   TOTAL: ${total} registros\n`)
    
    // Test 3: Ver datos de ejemplo
    console.log('📋 Datos de ejemplo:')
    
    if (centerCount > 0) {
      const center = await prisma.center.findFirst()
      console.log(`   Centro: ${center.name} - ${center.address}`)
    }
    
    if (missingCount > 0) {
      const missing = await prisma.missingPerson.findFirst()
      console.log(`   Persona Buscada: ${missing.fullName} - ${missing.lastSeenLocation}`)
    }
    
    if (resourceCount > 0) {
      const resource = await prisma.resource.findFirst()
      console.log(`   Recurso: ${resource.category} - ${resource.coverageArea}`)
    }
    
    if (alertCount > 0) {
      const alert = await prisma.alert.findFirst()
      console.log(`   Alerta: ${alert.severity} - ${alert.alertType}`)
    }
    
    console.log('\n✅ Todas las pruebas pasaron correctamente')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
