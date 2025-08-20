import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function getCurrentUserFromRequest(request: NextRequest) {
  console.log("🔍 getCurrentUserFromRequest called for job platform");
  
  try {
    console.log("🎫 Attempting to get token from request with shared secret");
    
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'next-auth.session-token'
    });

    console.log("🎫 Token retrieved:", { 
      hasToken: !!token, 
      userEmail: token?.email,
      userName: token?.name,
      tokenKeys: token ? Object.keys(token) : [] 
    });

    if (!token) {
      console.log("❌ No token found, returning null");
      return null;
    }

    const user = {
      id: token.sub,
      email: token.email,
      name: token.name,
      accessToken: token.accessToken
    };

    console.log("✅ User extracted from token:", { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      hasAccessToken: !!user.accessToken 
    });

    return user;
  } catch (error) {
    console.error('❌ Error getting user from token:', error);
    return null;
  }
}

// For client-side components, we'll use the session hook
export function getSessionUser() {
  // This will be used in client components with useSession
  return null; // Placeholder - actual implementation will use useSession hook
} 