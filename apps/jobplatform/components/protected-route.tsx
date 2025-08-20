'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      console.log("🚫 User not authenticated, redirecting to main app sign-in");
      // Redirect to the main app's sign-in page
      const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';
      const signInUrl = `${mainAppUrl}/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
      window.location.href = signInUrl;
    }
  });

  useEffect(() => {
    console.log("🔒 ProtectedRoute status:", status);
    console.log("👤 ProtectedRoute session:", session);
  }, [status, session]);

  if (status === "loading") {
    console.log("⏳ Session loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
}; 