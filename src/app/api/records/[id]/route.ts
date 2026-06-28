import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Buscar en todos los archivos JSON del día
    const dataDir = path.join(process.cwd(), 'data')
    const today = new Date().toISOString().split('T')[0]
    const filePath = path.join(dataDir, `${today}.json`)
    
    const data = await readFile(filePath, 'utf-8')
    const records = JSON.parse(data)
    
    // Encontrar y actualizar el registro
    const index = records.findIndex((r: any) => r.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 })
    }
    
    // Actualizar solo los campos enviados
    records[index] = { ...records[index], ...body }
    
    // Guardar
    await writeFile(filePath, JSON.stringify(records, null, 2))
    
    return NextResponse.json({ success: true, record: records[index] })
  } catch (error) {
    console.error('Error actualizando registro:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
