import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Si la petición es para /images, redirigir al API
  if (pathname.startsWith('/images/')) {
    return NextResponse.rewrite(new URL(`/api/images${pathname}`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/images/:path*',
}
