"use client";

import Link from "next/link";
import { AgentNodeGraphic } from "@/components/agent-node-graphic";
import { HeroHud } from "@/components/hero-hud";
import { PerspectiveGrid } from "@/components/perspective-grid";
import { TypingText } from "@/components/typing-text";
import { siteConfig } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#060608]">
      {/* Ambient layers */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 70% 40%, rgba(59,130,246,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(59,130,246,0.04) 0%, transparent 50%),
            linear-gradient(180deg, #060608 0%, #0a0a14 50%, #0a0a0a 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <PerspectiveGrid />
      <HeroHud />

      {/* Main content — asymmetric split */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-[1400px] items-center gap-8 px-6 pt-16 pb-24 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:px-10 lg:pt-20">
        {/* Left — typography */}
        <div className="flex flex-col lg:pr-8">
          <p className="mb-6 font-mono text-[11px] tracking-[0.25em] text-accent/70 uppercase animate-fade-up">
            // ai agent developer
          </p>

          <h1 className="animate-fade-up font-[family-name:var(--font-space-grotesk)] leading-[0.88] font-bold tracking-[-0.03em] [animation-delay:80ms]">
            <span
              className="block text-[clamp(3rem,10vw,7.5rem)] text-transparent uppercase"
              style={{
                WebkitTextStroke: "1px rgba(232,232,232,0.35)",
              }}
            >
              Building
            </span>
            <span className="relative block text-[clamp(3.5rem,12vw,9rem)] uppercase text-foreground">
              <span
                className="absolute inset-0 text-accent opacity-40 blur-2xl select-none"
                aria-hidden
              >
                Agents
              </span>
              <span className="relative bg-gradient-to-r from-white via-white to-accent/80 bg-clip-text text-transparent">
                Agents
              </span>
            </span>
          </h1>

          <div className="mt-8 min-h-[1.75rem] animate-fade-up text-sm text-muted [animation-delay:160ms]">
            <TypingText
              phrases={[
                siteConfig.tagline,
                "LangChain · CrewAI · MCP · RAG",
                "multi-agent orchestration",
                "from prototype to production",
              ]}
            />
          </div>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link
              href="/articles"
              className="group relative overflow-hidden rounded-sm bg-foreground px-7 py-3 text-sm font-medium text-background transition-shadow hover:shadow-[0_0_24px_rgba(59,130,246,0.35)]"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors group-hover:text-white">
                阅读文章
              </span>
            </Link>
            <Link
              href="/about"
              className="rounded-sm border border-white/[0.15] px-7 py-3 font-mono text-sm text-foreground transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
            >
              about_
            </Link>
          </div>

          {/* Mini metrics row */}
          <div className="mt-14 hidden animate-fade-up gap-8 border-t border-white/[0.06] pt-6 font-mono text-[11px] sm:flex [animation-delay:320ms]">
            {[
              { k: "posts", v: "12+" },
              { k: "topics", v: "06" },
              { k: "repos", v: "03" },
            ].map((m) => (
              <div key={m.k}>
                <span className="text-muted/50">{m.k}</span>
                <span className="ml-2 tabular-nums text-foreground">{m.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — agent visualization */}
        <div className="relative flex items-center justify-center animate-fade-up [animation-delay:120ms]">
          <div className="absolute inset-0 rounded-full bg-accent/[0.03] blur-3xl" />
          <AgentNodeGraphic />
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">
          scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10">
          <div className="animate-scroll-cue absolute h-3 w-full bg-accent/80" />
        </div>
      </div>
    </section>
  );
}
