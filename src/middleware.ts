import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si la petición es para /images, reescribir a /api/images
  // IMPORTANTE: quitar el prefijo /images antes de agregar /api/images
  if (pathname.startsWith('/images/')) {
    const imageSubPath = pathname.substring('/images'.length) // "/2026-06/file.webp"
    return NextResponse.rewrite(new URL(`/api/images${imageSubPath}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/images/:path*',
}
