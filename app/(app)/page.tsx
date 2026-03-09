"use client";

import Image from "next/image";
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
// import { cookies } from "next/headers";

export default function Home() {
  // const cookieStore = cookies()
  
  async function signInWithGithub() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `https://jnmyaqlmiizebvfflctd.supabase.co/auth/v1/callback`,
      },
    })
    
  }
  
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="flex flex-col gap-y-4 min-h-screen w-full justify-center items-center">
        <span className="font-sans tracking-[-0.05em] text-black text-4xl font-medium">
          Build for teams who ship globally. Powered by Lingo.dev
        </span>
        <span className="font-sans tracking-[-0.05em] text-base text-black w-100 text-center">
          Catch broken layouts, missing translations, and locale regressions automatically — on every PR, before your users ever see them.
        </span>
        <Button size="default" onClick={signInWithGithub} className="rounded-lg bg-[#107A4D] cursor-pointer">
          <Image src="/Github_Symbol_0.svg" alt="Github logo" width={16} height={16} />
          <span className="font-sans tracking-[-0.05em] text-base font-normal text-white">Sign in using Github</span>
        </Button>
      </main>
    </div>
  );
}
