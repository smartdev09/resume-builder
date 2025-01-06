'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';

type ProvidersType = Awaited<ReturnType<typeof getProviders>>

export default function SignUp() {
    const [providers, setProviders] = useState<ProvidersType | null>(null);


  async function initProviders() {
    const p = await getProviders();
    setProviders(p);
  }

  useEffect(() => {
    initProviders();
  }, []);


  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back!</h1>
        <p className="text-gray-500 text-center mb-8">
          Glad to see you again!
        </p>
        {providers && Object.values(providers).map((provider) => (
        <div key={provider.name}>
            <button type="button" onClick={() => signIn(provider.id)}>
            Sign in with
            {provider.name}
            </button>
        </div>
        ))}
        <p className="text-center text-sm text-gray-500 mt-4">
          By signing in, I agree to the
          <Link
            href="/privacy-policy"
            className="text-purple-500 hover:underline"
          >
            Privacy Policy
          </Link>
          and
          <Link href="/terms" className="text-purple-500 hover:underline">
            Terms and Conditions
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="text-purple-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
