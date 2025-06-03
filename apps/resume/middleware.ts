import { auth } from "utils/auth"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Add pathname to headers for conditional navbar rendering
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);

  // Your existing auth logic here
  if (request.nextUrl.pathname.startsWith('/editor') && !session?.user) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
    }
  
  return response;
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
}