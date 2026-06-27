import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

interface FormData {
  nombre?: string
  ubicacion: string
  tipo: string
  descripcion: string
  contacto: string
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json()

    // Validación básica
    if (!body.ubicacion || !body.tipo || !body.descripcion || !body.contacto) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Validar longitudes
    if (body.nombre && body.nombre.length > 100) {
      return NextResponse.json({ error: 'Nombre muy largo' }, { status: 400 })
    }
    if (body.ubicacion.length > 200) {
      return NextResponse.json({ error: 'Ubicación muy larga' }, { status: 400 })
    }
    if (body.descripcion.length > 2000) {
      return NextResponse.json({ error: 'Descripción muy larga' }, { status: 400 })
    }
    if (body.contacto.length > 200) {
      return NextResponse.json({ error: 'Contacto muy largo' }, { status: 400 })
    }

    // Generar ID único
    const id = crypto.randomUUID()

    // Timestamp actual
    const timestamp = new Date().toISOString()

    // Hash de IP para privacidad
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const salt = process.env.IP_SALT || 'default-salt-change-me'
    const ip_hash = crypto.createHash('sha256').update(ip + salt).digest('hex')

    // Crear entrada
    const entry = {
      id,
      timestamp,
      nombre: body.nombre || '',
      ubicacion: body.ubicacion,
      tipo: body.tipo,
      descripcion: body.descripcion,
      contacto: body.contacto,
      ip_hash
    }

    // Nombre del archivo basado en fecha
    const today = new Date().toISOString().split('T')[0]
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, `${today}.json`)

    // Leer archivo existente o crear array vacío
    let entries = []
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      entries = JSON.parse(fileContent)
    } catch (error) {
      // Archivo no existe, empezar con array vacío
    }

    // Agregar nueva entrada
    entries.push(entry)

    // Escribir archivo
    await writeFile(filePath, JSON.stringify(entries, null, 2))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error al procesar formulario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
