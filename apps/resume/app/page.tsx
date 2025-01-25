'use client'


import Image from "next/image";
import { Button } from "@resume/ui/button";
import useAppShell from "@resume/ui/hooks/use-app-shell";
import { useSession } from "next-auth/react";
import ShimmerButton from "@resume/ui/shimmer-button";
import { Star } from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const { user, score, setUser } = useAppShell();
  const { data } = useSession();

  console.log(data)

  const url = data?.user ? `${process.env.DOMAIN}/editor` : `${process.env.DOMAIN}/api/auth/signin`;
 
  async function handleStar() {
    const res = await fetch(`${process.env.DOMAIN}/api/star`, {
      method: 'PUT'
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white  bg-black">
      <div className="absolute top-[68%] right-0 transform translate-x-1/4 -translate-y-1/2 w-[70vw] h-[70vw] bg-gradient-to-br from-[#242039] to-[#140a47] rounded-full" ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-[15%] items-center">
          <div className="space-y-8">

            <h1 className="text-[2.5rem] leading-[1.2] md:text-5xl lg:text-4xl font-semibold text-white">
              A free, open-source resume
              <br />
              builder online.
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-xl">
              If a sheet of paper represents your entire work life, personality,
              and skills, it better be a pretty amazing piece of paper — Let
              us do the heavy lifting.
            </p>

            <div className="flex gap-2">
              <Link href={url} className="z-10 w-48 whitespace-pre bg-gradient-to-b bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-gray-300 dark:from-white dark:to-slate-900/10 dark:text-transparent">
                <ShimmerButton>
                    Build your resume
                </ShimmerButton>
              </Link>
            <Button  onClick={() => window.open(process.env.GITHUB_REPO)}><Star /> Star us</Button>

            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src="/assets/images/hero-image.png"
              alt="CV Template Preview"
              width={400}
              height={600}
              className="rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}