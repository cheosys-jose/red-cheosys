import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || 'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const referer = request.headers.get('referer') || 'Direct'
    const country = request.headers.get('cf-ipcountry') || 'Unknown'
    const city = request.headers.get('cf-ipcity') || 'Unknown'
    const region = request.headers.get('cf-ipregion') || 'Unknown'
    
    // Parsear user agent para obtener dispositivo y navegador
    const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
    const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                    userAgent.includes('Firefox') ? 'Firefox' :
                    userAgent.includes('Safari') ? 'Safari' :
                    userAgent.includes('Edge') ? 'Edge' : 'Other'
    const os = userAgent.includes('Windows') ? 'Windows' :
               userAgent.includes('Mac') ? 'MacOS' :
               userAgent.includes('Linux') ? 'Linux' :
               userAgent.includes('Android') ? 'Android' :
               userAgent.includes('iOS') ? 'iOS' : 'Other'

    const dataDir = path.join(process.cwd(), 'data')
    const metricsFile = path.join(dataDir, 'metrics.json')

    let metrics: any = {
      totalVisits: 0,
      uniqueVisitors: [],
      countries: {},
      cities: {},
      devices: {},
      browsers: {},
      operatingSystems: {},
      referers: {},
      dailyVisits: {},
      hourlyVisits: {},
      visitsByDate: {}
    }

    try {
      const existingData = await readFile(metricsFile, 'utf-8')
      metrics = JSON.parse(existingData)
    } catch (e) {
      await mkdir(dataDir, { recursive: true })
    }

    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const hour = now.getHours()
    const month = now.toISOString().substring(0, 7) // YYYY-MM

    // Incrementar visitas totales
    metrics.totalVisits++

    // Registrar visita única (por IP)
    if (!metrics.uniqueVisitors.includes(ip)) {
      metrics.uniqueVisitors.push(ip)
      if (metrics.uniqueVisitors.length > 5000) {
        metrics.uniqueVisitors = metrics.uniqueVisitors.slice(-5000)
      }
    }

    // Contar por país
    metrics.countries[country] = (metrics.countries[country] || 0) + 1

    // Contar por ciudad
    if (city !== 'Unknown') {
      metrics.cities[`${city}, ${country}`] = (metrics.cities[`${city}, ${country}`] || 0) + 1
    }

    // Contar por dispositivo
    metrics.devices[device] = (metrics.devices[device] || 0) + 1

    // Contar por navegador
    metrics.browsers[browser] = (metrics.browsers[browser] || 0) + 1

    // Contar por sistema operativo
    metrics.operatingSystems[os] = (metrics.operatingSystems[os] || 0) + 1

    // Contar por referer
    const refererDomain = referer !== 'Direct' ? new URL(referer).hostname : 'Direct'
    metrics.referers[refererDomain] = (metrics.referers[refererDomain] || 0) + 1

    // Visitas diarias
    metrics.dailyVisits[today] = (metrics.dailyVisits[today] || 0) + 1

    // Visitas por hora
    const hourKey = `${today}-${hour.toString().padStart(2, '0')}`
    metrics.hourlyVisits[hourKey] = (metrics.hourlyVisits[hourKey] || 0) + 1

    // Visitas organizadas por fecha (estructura detallada)
    if (!metrics.visitsByDate[today]) {
      metrics.visitsByDate[today] = {
        total: 0,
        unique: 0,
        countries: {},
        devices: {},
        browsers: {},
        hours: {}
      }
    }
    
    metrics.visitsByDate[today].total++
    if (!metrics.visitsByDate[today].uniqueIPs) {
      metrics.visitsByDate[today].uniqueIPs = []
    }
    if (!metrics.visitsByDate[today].uniqueIPs.includes(ip)) {
      metrics.visitsByDate[today].uniqueIPs.push(ip)
      metrics.visitsByDate[today].unique = metrics.visitsByDate[today].uniqueIPs.length
    }
    
    metrics.visitsByDate[today].countries[country] = 
      (metrics.visitsByDate[today].countries[country] || 0) + 1
    metrics.visitsByDate[today].devices[device] = 
      (metrics.visitsByDate[today].devices[device] || 0) + 1
    metrics.visitsByDate[today].browsers[browser] = 
      (metrics.visitsByDate[today].browsers[browser] || 0) + 1
    metrics.visitsByDate[today].hours[hour] = 
      (metrics.visitsByDate[today].hours[hour] || 0) + 1

    // Limpiar IPs antiguas de visitas por fecha (mantener solo últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]
    
    Object.keys(metrics.visitsByDate).forEach(date => {
      if (date < cutoffDate) {
        delete metrics.visitsByDate[date].uniqueIPs
      }
    })

    await writeFile(metricsFile, JSON.stringify(metrics, null, 2))

    return NextResponse.json({
      success: true,
      country,
      city,
      totalVisits: metrics.totalVisits,
      uniqueVisitors: metrics.uniqueVisitors.length
    })
  } catch (error) {
    console.error('Error registrando visita:', error)
    return NextResponse.json({ success: false, error: 'Error interno' })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    const metricsFile = path.join(process.cwd(), 'data', 'metrics.json')
    let metrics: any = {
      totalVisits: 0,
      uniqueVisitors: [],
      countries: {},
      cities: {},
      devices: {},
      browsers: {},
      operatingSystems: {},
      referers: {},
      dailyVisits: {},
      hourlyVisits: {},
      visitsByDate: {}
    }

    try {
      const existingData = await readFile(metricsFile, 'utf-8')
      metrics = JSON.parse(existingData)
    } catch (e) {}

    // Si se solicita una fecha específica
    if (date && metrics.visitsByDate[date]) {
      const dateData = { ...metrics.visitsByDate[date] }
      delete dateData.uniqueIPs // No enviar IPs por seguridad
      return NextResponse.json({
        date,
        ...dateData
      })
    }

    // Retornar resumen general
    return NextResponse.json({
      totalVisits: metrics.totalVisits || 0,
      uniqueVisitors: metrics.uniqueVisitors?.length || 0,
      countries: metrics.countries || {},
      cities: metrics.cities || {},
      devices: metrics.devices || {},
      browsers: metrics.browsers || {},
      operatingSystems: metrics.operatingSystems || {},
      referers: metrics.referers || {},
      dailyVisits: metrics.dailyVisits || {},
      hourlyVisits: metrics.hourlyVisits || {},
      visitsByDate: Object.keys(metrics.visitsByDate || {}).reduce((acc, date) => {
        const dateData = { ...metrics.visitsByDate[date] }
        delete dateData.uniqueIPs
        acc[date] = dateData
        return acc
      }, {} as any)
    })
  } catch (error) {
    console.error('Error obteniendo métricas:', error)
    return NextResponse.json({ totalVisits: 0, uniqueVisitors: 0 })
  }
}
