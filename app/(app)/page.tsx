"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  ScanSearch,
  LayoutPanelLeft,
  CircleCheck,
  CircleX,
  Diff,
  KeyRound,
  Cpu,
} from "lucide-react";

export default function Home() {
  async function signInWithGithub() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL!,
      },
    });
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden"
      style={{ fontFamily: "inherit" }}
    >
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2A2A2A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />

      {/* Subtle green glow top-center */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(16,122,77,0.13) 0%, transparent 70%)",
        }}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { opacity: 0; animation: fadeInUp 0.55s ease forwards; }
        .anim-1 { animation-delay: 0.05s; }
        .anim-2 { animation-delay: 0.15s; }
        .anim-3 { animation-delay: 0.25s; }
        .anim-4 { animation-delay: 0.35s; }
        .anim-5 { animation-delay: 0.45s; }
        .anim-6 { animation-delay: 0.55s; }
        .anim-7 { animation-delay: 0.65s; }
      `}</style>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-x-2 anim anim-1">
          <span className="font-mono text-sm tracking-[-0.05em] text-white font-medium">
            localit
          </span>
          <span className="font-mono text-[10px] tracking-[-0.05em] text-[#107A4D] border border-[#107A4D]/30 bg-[#107A4D]/10 px-1.5 py-0.5 rounded-xs">
            beta
          </span>
        </div>
        <Button
          size="sm"
          onClick={signInWithGithub}
          className="rounded-xs bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222] hover:border-[#3A3A3A] transition-colors cursor-pointer anim anim-1"
        >
          <Image
            src="/githubsymbol.png"
            alt="Github"
            width={13}
            height={13}
          />
          <span className="font-sans tracking-[-0.05em] text-xs font-normal text-[#A1A1A1]">
            Sign in
          </span>
        </Button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 gap-y-6">
        {/* Lingo badge */}
        <div className="anim anim-1 flex items-center gap-x-1.5 px-3 py-1 rounded-xs border border-[#2A2A2A] bg-[#111111]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#107A4D]" />
          <span className="font-mono text-[11px] tracking-[-0.05em] text-[#A1A1A1]">
            Powered by Lingo.dev
          </span>
        </div>

        {/* Headline */}
        <h1 className="anim anim-2 font-sans font-semibold tracking-[-0.05em] text-white max-w-2xl leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
        >
          i18n regression testing,{" "}
          <span className="text-[#107A4D]">on every PR.</span>
        </h1>

        {/* Subheadline */}
        <p className="anim anim-3 font-sans tracking-[-0.05em] text-[#666666] text-base max-w-lg leading-relaxed">
          Catch broken layouts, missing translation keys, and locale regressions
          automatically — before your users ever see them.
        </p>

        {/* CTA */}
        <div className="anim anim-4 flex items-center gap-x-3">
          <Button
            size="default"
            onClick={signInWithGithub}
            className="rounded-xs bg-[#107A4D] hover:bg-[#0e6b43] transition-colors cursor-pointer border border-[#107A4D]/60"
          >
            <Image
              src="/githubsymbol.png"
              alt="Github"
              width={15}
              height={15}
            />
            <span className="font-sans tracking-[-0.05em] text-sm font-normal text-white">
              Sign in with GitHub
            </span>
          </Button>
          <span className="font-mono text-xs text-[#444444] tracking-[-0.05em]">
            free during beta
          </span>
        </div>

        {/* Terminal mock — hero illustration */}
        <div className="anim anim-5 mt-6 w-full max-w-2xl rounded-xs border border-[#2A2A2A] bg-[#0E0E0E] overflow-hidden shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-x-1.5 px-3 py-2.5 border-b border-[#1A1A1A] bg-[#111111]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
            <span className="ml-3 font-mono text-[11px] text-[#444444] tracking-[-0.05em]">
              localit · run #a3f9c1
            </span>
          </div>
          {/* Log lines */}
          <div className="px-4 py-3 flex flex-col gap-y-1.5">
            {[
              { prefix: "✓", color: "#22C55E", text: "Cloned repo — acme/storefront @ main" },
              { prefix: "✓", color: "#22C55E", text: "Detected next-intl · prefix strategy · 4 locales" },
              { prefix: "✓", color: "#22C55E", text: "Coverage — de 98%  fr 100%  ja 91%  es 100%" },
              { prefix: "✓", color: "#22C55E", text: "Screenshots captured — 16 total (4 locales × 4 routes)" },
              { prefix: "✗", color: "#EF4444", text: "Visual regression — ja / /checkout · 12.3% pixel diff" },
              { prefix: "→", color: "#F59E0B", text: 'AI: "Button text overflows container · raw key hero.cta visible"' },
              { prefix: "✗", color: "#EF4444", text: "Run failed — 1 visual issue across 4 locales" },
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-x-2.5">
                <span
                  className="font-mono text-xs shrink-0 mt-px"
                  style={{ color: line.color }}
                >
                  {line.prefix}
                </span>
                <span className="font-mono text-xs text-[#666666] tracking-[-0.05em] leading-relaxed">
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 py-16 border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto flex flex-col gap-y-10">
          <div className="anim anim-1 flex flex-col gap-y-1">
            <span className="font-mono text-[11px] text-[#107A4D] tracking-[-0.05em] uppercase">
              How it works
            </span>
            <h2 className="font-sans font-medium tracking-[-0.05em] text-white text-2xl">
              Three steps. Zero config.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                icon: <GitBranch size={16} color="#107A4D" />,
                title: "Connect your repo",
                description:
                  "Link your GitHub repository. Localit installs a GitHub Action that triggers on every pull request.",
                illustration: (
                  <div className="flex flex-col gap-y-1 mt-3">
                    <div className="flex items-center gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#2A2A2A]">
                      <GitBranch size={11} color="#444444" />
                      <span className="font-mono text-[11px] text-[#555555] tracking-[-0.05em]">
                        main ← feat/german-locale
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#107A4D]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#107A4D]" />
                      <span className="font-mono text-[11px] text-[#107A4D] tracking-[-0.05em]">
                        localit check triggered
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                step: "02",
                icon: <ScanSearch size={16} color="#107A4D" />,
                title: "Worker audits every locale",
                description:
                  "A cloud worker clones your repo, builds it, and runs Playwright across every locale and route.",
                illustration: (
                  <div className="flex flex-col gap-y-1 mt-3">
                    {["en", "de", "fr", "ja"].map((loc, i) => (
                      <div
                        key={loc}
                        className="flex items-center justify-between px-2 py-1 rounded-xs bg-[#0A0A0A] border border-[#2A2A2A]"
                      >
                        <span className="font-mono text-[11px] text-[#555555] tracking-[-0.05em]">
                          /{loc}/checkout
                        </span>
                        <span
                          className="font-mono text-[11px] tracking-[-0.05em]"
                          style={{
                            color: i === 3 ? "#F59E0B" : "#22C55E",
                          }}
                        >
                          {i === 3 ? "12.3%" : "0.0%"}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: "03",
                icon: <LayoutPanelLeft size={16} color="#107A4D" />,
                title: "Review the diff report",
                description:
                  "See baseline vs current screenshots, pixel diffs, missing keys, and AI analysis — all in one place.",
                illustration: (
                  <div className="flex flex-col gap-y-1 mt-3">
                    <div className="flex items-center gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#EF4444]/30">
                      <CircleX size={11} color="#EF4444" />
                      <span className="font-mono text-[11px] text-[#EF4444] tracking-[-0.05em]">
                        ja / /checkout — 12.3% diff
                      </span>
                    </div>
                    <div className="flex items-start gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#2A2A2A] ml-3">
                      <span className="font-mono text-[10px] text-[#F59E0B] mt-px">›</span>
                      <span className="font-mono text-[11px] text-[#555555] tracking-[-0.05em]">
                        Button text overflows container
                      </span>
                    </div>
                    <div className="flex items-start gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#2A2A2A] ml-3">
                      <span className="font-mono text-[10px] text-[#F59E0B] mt-px">›</span>
                      <span className="font-mono text-[11px] text-[#555555] tracking-[-0.05em]">
                        Raw key hero.cta still visible
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2 px-2 py-1.5 rounded-xs bg-[#0A0A0A] border border-[#22C55E]/30">
                      <CircleCheck size={11} color="#22C55E" />
                      <span className="font-mono text-[11px] text-[#22C55E] tracking-[-0.05em]">
                        de, fr, es — all passed
                      </span>
                    </div>
                  </div>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`anim anim-${i + 2} flex flex-col p-4 rounded-xs border border-[#1A1A1A] bg-[#0E0E0E]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    {item.icon}
                    <span className="font-sans text-sm font-medium tracking-[-0.05em] text-white">
                      {item.title}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#2A2A2A] tracking-[-0.05em]">
                    {item.step}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#555555] tracking-[-0.05em] leading-relaxed mt-2">
                  {item.description}
                </p>
                {item.illustration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ───────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 py-16 border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto flex flex-col gap-y-10">
          <div className="anim anim-1 flex flex-col gap-y-1">
            <span className="font-mono text-[11px] text-[#107A4D] tracking-[-0.05em] uppercase">
              What it catches
            </span>
            <h2 className="font-sans font-medium tracking-[-0.05em] text-white text-2xl">
              Every class of i18n failure.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A]">
            {[
              {
                icon: <Diff size={15} color="#107A4D" />,
                title: "Visual regression",
                description:
                  "Pixel-level screenshot diffs between your source locale and every target. Catches layout shifts, overflow, and broken components caused by longer translated strings.",
              },
              {
                icon: <KeyRound size={15} color="#107A4D" />,
                title: "Translation coverage",
                description:
                  "Scans every locale JSON file and reports missing or untranslated keys before they ship. Per-locale coverage percentage tracked on every run.",
              },
              {
                icon: <Cpu size={15} color="#107A4D" />,
                title: "AI diff analysis",
                description:
                  "When a pixel diff is detected, a vision model inspects baseline vs current and returns a plain-language list of exactly what changed and why.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className={`anim anim-${i + 2} flex flex-col gap-y-3 p-5 bg-[#0A0A0A]`}
              >
                <div className="flex items-center gap-x-2">
                  {feat.icon}
                  <span className="font-sans text-sm font-medium tracking-[-0.05em] text-white">
                    {feat.title}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#555555] tracking-[-0.05em] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────────────── */}
      <section className="relative z-10 px-8 py-16 border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-y-6">
          <div className="flex flex-col gap-y-1 anim anim-1">
            <h2 className="font-sans font-medium tracking-[-0.05em] text-white text-xl">
              Ready to ship globally with confidence?
            </h2>
            <p className="font-sans text-xs text-[#555555] tracking-[-0.05em]">
              Connect your repo in under a minute. No credit card required.
            </p>
          </div>
          <Button
            size="default"
            onClick={signInWithGithub}
            className="rounded-xs bg-[#107A4D] hover:bg-[#0e6b43] transition-colors cursor-pointer border border-[#107A4D]/60 shrink-0 anim anim-2"
          >
            <Image
              src="/githubsymbol.png"
              alt="Github"
              width={15}
              height={15}
            />
            <span className="font-sans tracking-[-0.05em] text-sm font-normal text-white">
              Sign in with GitHub
            </span>
          </Button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-8 py-5 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="font-mono text-[11px] text-[#333333] tracking-[-0.05em]">
          localit © 2025
        </span>
        <span className="font-mono text-[11px] text-[#333333] tracking-[-0.05em]">
          built for the lingo.dev hackathon
        </span>
      </footer>
    </div>
  );
}