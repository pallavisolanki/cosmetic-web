import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next(); // Allow API routes to proceed
  }
  return NextResponse.redirect(new URL('/home', request.url));
}
 
export const config = {
  matcher: '/about/:path*',
}