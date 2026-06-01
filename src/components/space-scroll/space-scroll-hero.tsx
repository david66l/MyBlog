"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageFadeIn } from "@/components/page-fade-in";
import {
  elonMuskQuoteAuthor,
  pickSequentialMuskQuote,
  type MuskQuote,
} from "@/lib/elon-musk-quotes";
import { HeroQuoteTypewriter } from "./hero-quote-typewriter";
import { spaceScenes } from "./scene-config";

const SpaceCanvas = dynamic(
  () => import("./space-canvas").then((m) => m.SpaceCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> },
);

export function SpaceScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [quote, setQuote] = useState<MuskQuote | null>(null);
  const scene = spaceScenes[0];

  useEffect(() => {
    setMounted(true);
    setQuote(pickSequentialMuskQuote());
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCanvasReady = useCallback(() => {
    setCanvasReady(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[calc(100vh-3.5rem)] overflow-hidden bg-black"
    >
      <PageFadeIn ready={canvasReady} className="absolute inset-0">
        <div className="absolute inset-0 z-0">
          {mounted && <SpaceCanvas onReady={handleCanvasReady} active={inView} />}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 38%, transparent 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-6 z-[2] hidden md:block" aria-hidden>
          <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-white/15" />
          <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/15" />
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/15" />
          <span className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-white/15" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center px-6 pt-[10vh] pb-10 text-center md:pt-[12vh]">
          <h1
            className="w-full max-w-[min(100%,960px)] font-[family-name:var(--font-orbitron)] uppercase"
            style={{ color: "#ffffff" }}
          >
            <span
              className="block text-[clamp(2.25rem,6.5vw,4rem)] font-medium leading-none tracking-[0.28em]"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              {scene.title[0]}
            </span>
            <span
              className="mt-3 block text-[clamp(1.375rem,3.8vw,2.5rem)] font-semibold leading-none tracking-[0.18em]"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              {scene.title[1]}
            </span>
          </h1>

          {quote && (
            <HeroQuoteTypewriter
              key={quote.en}
              en={quote.en}
              zh={quote.zh}
              author={elonMuskQuoteAuthor}
              started={canvasReady}
              running={inView}
            />
          )}

          <p
            className="mt-auto max-w-md text-sm leading-relaxed md:text-base"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {scene.subtitle}
          </p>

          <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/articles"
              className="rounded-sm bg-white px-6 py-2.5 font-mono text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              read_
            </Link>
            <Link
              href="/about"
              className="rounded-sm border border-white/20 px-6 py-2.5 font-mono text-sm transition-colors hover:border-white/40"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              about_
            </Link>
          </div>
        </div>
      </PageFadeIn>
    </section>
  );
}
