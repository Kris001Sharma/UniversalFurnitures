import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './types';
import { authorize } from './lib/auth';

// This middleware runs on the Edge in a Next.js environment.
// It intercepts requests to protected routes and verifies the user's role.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Assume role is stored in a cookie named 'userRole'
  const roleCookie = request.cookies.get('userRole')?.value as UserRole | undefined;

  // Define route protection rules
  const routeRules: Record<string, UserRole[]> = {
    '/admin': ['admin'],
    '/supervisor': ['supervisor'],
    '/accounts': ['accountant'],
    '/sales': ['sales'],
    '/delivery': ['delivery'],
  };

  // Check if the current path matches any protected route
  for (const [route, allowedRoles] of Object.entries(routeRules)) {
    if (pathname.startsWith(route)) {
      // If no role or role is not authorized, redirect to unauthorized
      if (!roleCookie || !authorize(roleCookie, allowedRoles)) {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/supervisor/:path*',
    '/accounts/:path*',
    '/sales/:path*',
    '/delivery/:path*',
  ],
};
