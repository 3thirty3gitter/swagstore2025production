import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  console.log(`🌐 Middleware: ${hostname}${pathname}`);
  
  // Skip middleware for admin, API routes, and main domain
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login-admin') ||
    pathname.startsWith('/request-store') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    hostname === 'swagstore.ca' ||
    hostname === 'www.swagstore.ca' ||
    hostname.includes('localhost') ||
    hostname.includes('vercel.app')
  ) {
    console.log(`⏭️  Skipping middleware for: ${hostname}${pathname}`);
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  if (hostname.includes('swagstore.ca')) {
    const subdomain = hostname.split('.')[0];
    
    if (subdomain && subdomain !== 'www' && subdomain !== 'swagstore') {
      console.log(`🔍 Detected subdomain: ${subdomain}`);
      
      // Rewrite to tenant slug route
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}${pathname}`;
      
      console.log(`🔄 Rewriting: ${hostname}${pathname} → ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }

  console.log(`➡️  No rewrite needed for: ${hostname}${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
