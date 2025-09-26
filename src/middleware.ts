
import {type NextRequest, NextResponse} from 'next/server';

const protectedRoutes = [
  '/',
  '/scheduling',
  '/consultations',
  '/booking',
  '/resources',
  '/forum',
  '/profile',
  '/admin',
];
const authRoutes = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const sessionCookie = request.cookies.get('firebase-session');

  // If trying to access an auth page (login/signup) while logged in, redirect to home
  if (sessionCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access a protected page while not logged in, redirect to login
  if (!sessionCookie && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
