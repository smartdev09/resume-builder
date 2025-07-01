import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log("🔒 Middleware checking authentication for job platform...");
  
  // Get the session token using the correct environment variable
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Fixed: use NEXTAUTH_SECRET not NEXT_AUTH_SECRET
    // Use the same cookie name as configured in NextAuth
    cookieName: 'next-auth.session-token'
  });
  
  console.log("🎫 Middleware token check:", { 
    hasToken: !!token, 
    userEmail: token?.email,
    userName: token?.name 
  });
  
  // If no token is found, redirect to the main app's sign-in page
  if (!token) {
    console.log("❌ No token found, redirecting to main app sign-in");
    const mainAppUrl = process.env.MAIN_APP_URL || 'http://localhost:3000';
    const signInUrl = new URL('/api/auth/signin', mainAppUrl);
    
    // Add the current URL as a callback to return after authentication
    signInUrl.searchParams.set('callbackUrl', request.url);
    
    return NextResponse.redirect(signInUrl);
  }

  console.log("✅ Token found, allowing access to job platform");
  // If authenticated, continue to the requested page
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except:
  // - API auth routes (needed for NextAuth to work)
  // - Static files
  // - Next.js internals
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ]
}; 