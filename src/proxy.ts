import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple check for our hardcoded admin session
export function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  
  // Get the session cookie
  const hasSession = request.cookies.has('admin_session')

  // If accessing /admin/* (but not login) and no session, redirect to login
  if (isAdminRoute && !isLoginPage && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If already logged in and trying to go to /admin or /admin/login, go to dashboard
  if ((request.nextUrl.pathname === '/admin' || isLoginPage) && hasSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  
  // Root /admin redirects to dashboard
  if (request.nextUrl.pathname === '/admin' && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

// Config to only run middleware on /admin paths
export const config = {
  matcher: '/admin/:path*',
}
