import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for admin, API routes, and main domain
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/login-admin') ||
    request.nextUrl.pathname.startsWith('/request-store') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    hostname === 'swagstore.ca' ||
    hostname === 'www.swagstore.ca' ||
    hostname.includes('localhost') ||
    hostname.includes('vercel.app')
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  
  if (subdomain && subdomain !== 'www' && hostname.includes('swagstore.ca')) {
    // Rewrite subdomain to tenant slug route
    const url = request.nextUrl.clone();
    url.pathname = `/${subdomain}${request.nextUrl.pathname}`;
    
    console.log(`Subdomain routing: ${hostname} → ${url.pathname}`);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
