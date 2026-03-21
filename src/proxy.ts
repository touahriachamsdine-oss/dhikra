import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public paths — always allowed
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/articles') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')

  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('auth-token')?.value

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const payload = await verifyToken(token)

    // /admin is EXCLUSIVELY for ADMIN role
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // /api/admin endpoints also need ADMIN
    if (pathname.startsWith('/api/admin') && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pass user info downstream via headers
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.id)
    response.headers.set('x-user-role', payload.role)
    response.headers.set('x-user-email', payload.email)
    return response

  } catch {
    // Invalid/expired token → clear it and redirect
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
