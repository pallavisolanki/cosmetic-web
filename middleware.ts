import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isRootPage = pathname === '/';

  // Redirect logged-in users from public pages
  if (token) {
    if (isRootPage || isAuthPage) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  // Custom redirection logic for /about/*
  if (pathname.startsWith('/about')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/', '/login', '/signup', '/about/:path*'],
};
