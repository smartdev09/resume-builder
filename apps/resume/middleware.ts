import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import { auth } from 'utils/auth'
// This function can be marked `async` if using `await` inside

export async function middleware(req: NextRequest) {
    const token = await auth();
  
    if (!token) {
      return Response.redirect(new URL('/', req.url));
    }
  
    return NextResponse.next();
}

// Protect specific routes
export const config = {
    matcher: ['/resumes', '/editor'], // Adjust paths as needed
};