import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /affiliate and its subroutes
  if (pathname.startsWith('/affiliate')) {
    const authCookie = request.cookies.get('stivard_auth');

    if (!authCookie || authCookie.value !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Config to match only the paths we want to protect
export const config = {
  matcher: ['/affiliate/:path*'],
};
