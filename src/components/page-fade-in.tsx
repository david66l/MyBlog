"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PAGE_FADE_DURATION_MS } from "@/lib/motion";

export { PAGE_FADE_DURATION_MS };

interface PageFadeInProps {
  children: ReactNode;
  /** When omitted, fades in after mount. When provided, waits until true. */
  ready?: boolean;
  durationMs?: number;
  className?: string;
  style?: CSSProperties;
}

/** Double rAF so the browser paints opacity-0 before transitioning. */
export function schedulePageFadeIn(callback: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

export function PageFadeIn({
  children,
  ready,
  durationMs = PAGE_FADE_DURATION_MS,
  className = "",
  style,
}: PageFadeInProps) {
  const [visible, setVisible] = useState(false);
  const autoReady = ready === undefined;

  useEffect(() => {
    if (!autoReady) return;
    schedulePageFadeIn(() => setVisible(true));
  }, [autoReady]);

  useEffect(() => {
    if (autoReady) return;
    if (ready) {
      schedulePageFadeIn(() => setVisible(true));
      return;
    }
    setVisible(false);
  }, [autoReady, ready]);

  return (
    <div
      className={`transition-opacity ease-in-out ${className} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: `${durationMs}ms`, ...style }}
    >
      {children}
    </div>
  );
}
