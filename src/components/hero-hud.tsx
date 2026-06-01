export function HeroHud() {
  return (
    <>
      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-6 z-20 hidden md:block" aria-hidden>
        <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-white/20" />
        <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/20" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/20" />
        <span className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-white/20" />
      </div>

      {/* Top telemetry strip */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 border-b border-white/[0.06] bg-black/40 backdrop-blur-sm" aria-hidden>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 font-mono text-[10px] tracking-[0.15em] text-muted/70 uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
              sys.online
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">agents.active: 3</span>
          </div>
          <span>dev.log / v0.1</span>
          <span className="hidden md:inline tabular-nums">47.001°N 8.545°E</span>
        </div>
      </div>

      {/* Vertical side labels */}
      <div
        className="pointer-events-none absolute top-1/2 left-3 z-20 hidden -translate-y-1/2 font-mono text-[9px] tracking-[0.3em] text-white/15 uppercase lg:block"
        aria-hidden
        style={{ writingMode: "vertical-rl" }}
      >
        autonomous systems
      </div>
      <div
        className="pointer-events-none absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 font-mono text-[9px] tracking-[0.3em] text-white/15 uppercase lg:block"
        aria-hidden
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
      >
        neural orchestration
      </div>
    </>
  );
}
