import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup') ||
                    request.nextUrl.pathname.startsWith('/verify')

  console.log('Middleware - Current path:', request.nextUrl.pathname)
  console.log('Middleware - Has token:', !!token)
  console.log('Middleware - Is auth page:', isAuthPage)

  if (!token && !isAuthPage) {
    console.log('Middleware - Redirecting to login (no token)')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    console.log('Middleware - Redirecting to dashboard (has token)')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/verify/:path*',
    '/'
  ]
} 