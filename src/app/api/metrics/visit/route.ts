import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || 'unknown'
    const country = request.headers.get('cf-ipcountry') || 'Unknown'

    const dataDir = path.join(process.cwd(), 'data')
    const metricsFile = path.join(dataDir, 'metrics.json')

    let metrics: any = { totalVisits: 0, uniqueVisitors: [], countries: {}, dailyVisits: {} }

    try {
      const existingData = await readFile(metricsFile, 'utf-8')
      metrics = JSON.parse(existingData)
    } catch (e) {
      await mkdir(dataDir, { recursive: true })
    }

    const today = new Date().toISOString().split('T')[0]
    metrics.totalVisits++

    if (!metrics.uniqueVisitors.includes(ip)) {
      metrics.uniqueVisitors.push(ip)
    }

    metrics.countries[country] = (metrics.countries[country] || 0) + 1
    metrics.dailyVisits[today] = (metrics.dailyVisits[today] || 0) + 1

    if (metrics.uniqueVisitors.length > 1000) {
      metrics.uniqueVisitors = metrics.uniqueVisitors.slice(-1000)
    }

    await writeFile(metricsFile, JSON.stringify(metrics, null, 2))

    return NextResponse.json({
      success: true,
      country,
      totalVisits: metrics.totalVisits,
      uniqueVisitors: metrics.uniqueVisitors.length
    })
  } catch (error) {
    console.error('Error registrando visita:', error)
    return NextResponse.json({ success: false })
  }
}

export async function GET() {
  try {
    const metricsFile = path.join(process.cwd(), 'data', 'metrics.json')
    let metrics: any = { totalVisits: 0, uniqueVisitors: [], countries: {}, dailyVisits: {} }

    try {
      const existingData = await readFile(metricsFile, 'utf-8')
      metrics = JSON.parse(existingData)
    } catch (e) {}

    return NextResponse.json({
      totalVisits: metrics.totalVisits || 0,
      uniqueVisitors: metrics.uniqueVisitors?.length || 0,
      countries: metrics.countries || {},
      dailyVisits: metrics.dailyVisits || {}
    })
  } catch (error) {
    return NextResponse.json({ totalVisits: 0, uniqueVisitors: 0 })
  }
}
