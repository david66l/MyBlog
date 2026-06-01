"use client";

import { useEffect, useRef, useState } from "react";

const items = [
  "ASTROBIOLOGY",
  "EXOPLANETS",
  "EUROPA",
  "HABITABLE ZONE",
  "DEEP SPACE",
  "EXTREMOPHILES",
  "ORBITAL MECHANICS",
  "SUBSURFACE OCEAN",
];

export function SignalMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const track = [...items, ...items];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-y border-white/[0.06] bg-black py-3"
      aria-hidden
    >
      <div
        className={`flex w-max gap-12 whitespace-nowrap ${inView ? "animate-marquee" : ""}`}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-12 font-mono text-[11px] tracking-[0.2em] text-white/25 uppercase"
          >
            {item}
            <span className="text-white/20">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
