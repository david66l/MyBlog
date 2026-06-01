"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_FADE_DURATION_MS } from "@/lib/motion";

interface HeroQuoteTypewriterProps {
  en: string;
  zh: string;
  author: string;
  /** Start typing once (e.g. after canvas is ready). */
  started?: boolean;
  /** Pause/resume RAF while off-screen without resetting progress. */
  running?: boolean;
  charDelayMs?: number;
}

export function HeroQuoteTypewriter({
  en,
  zh,
  author,
  started = true,
  running = true,
  charDelayMs = 28,
}: HeroQuoteTypewriterProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef(0);

  useEffect(() => {
    setCharIndex(0);
    setTypingDone(false);
    setLine2Visible(false);
    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
  }, [en]);

  useEffect(() => {
    if (!started || typingDone) return;

    if (!running) {
      if (startTimeRef.current !== null) {
        pausedElapsedRef.current += performance.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
      return;
    }

    if (en.length === 0) {
      setTypingDone(true);
      return;
    }

    let rafId = 0;

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsed = pausedElapsedRef.current + (now - startTimeRef.current);
      const nextIndex = Math.min(en.length, Math.floor(elapsed / charDelayMs));

      setCharIndex((prev) => (prev === nextIndex ? prev : nextIndex));

      if (nextIndex >= en.length) {
        setTypingDone(true);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (startTimeRef.current !== null) {
        pausedElapsedRef.current += performance.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    };
  }, [started, running, en, charDelayMs, typingDone]);

  useEffect(() => {
    if (!typingDone) return;
    const timer = window.setTimeout(() => setLine2Visible(true), 80);
    return () => window.clearTimeout(timer);
  }, [typingDone]);

  const typed = en.slice(0, charIndex);

  return (
    <blockquote className="mx-auto mt-8 max-w-[min(100%,640px)]">
      <p
        className="relative text-[clamp(0.8rem,1.6vw,0.95rem)] leading-relaxed italic"
        style={{ color: "rgba(255,255,255,0.72)" }}
      >
        <span className="invisible block select-none" aria-hidden>
          &ldquo;{en}&rdquo;
        </span>
        <span className="absolute inset-x-0 top-0">
          &ldquo;{typed}
          {!typingDone && (
            <span className="animate-blink ml-px inline-block text-white/60">|</span>
          )}
          {typingDone && <>&rdquo;</>}
        </span>
      </p>

      <p
        className={`mt-3 text-[clamp(0.75rem,1.4vw,0.875rem)] leading-relaxed transition-opacity ease-in-out ${
          line2Visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          color: "rgba(255,255,255,0.45)",
          transitionDuration: `${PAGE_FADE_DURATION_MS}ms`,
        }}
      >
        {zh}
        <span
          className="ml-2 font-mono text-[11px] tracking-[0.12em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          — {author}
        </span>
      </p>
    </blockquote>
  );
}
