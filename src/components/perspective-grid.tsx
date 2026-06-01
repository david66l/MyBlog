export function PerspectiveGrid() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[45vh] overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 animate-grid-drift"
        style={{
          perspective: "500px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          className="absolute top-0 left-[-50%] h-[200%] w-[200%] origin-top"
          style={{
            transform: "rotateX(72deg)",
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      <div className="animate-scan-line absolute right-0 left-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
    </div>
  );
}
