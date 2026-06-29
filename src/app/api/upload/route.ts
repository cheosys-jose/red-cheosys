import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'data', 'images')
    await mkdir(uploadDir, { recursive: true })

    const uploadedFiles: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Generar nombre único
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const extension = file.name.split('.').pop() || 'webp'
      const filename = `${timestamp}-${random}.${extension}`
      
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      
      // Retornar URL relativa
      uploadedFiles.push(`/images/${filename}`)
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles 
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json({ 
      error: 'Error uploading files' 
    }, { status: 500 })
  }
}
