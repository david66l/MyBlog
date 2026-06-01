export function ParticleBackground() {
  const dots = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 23 + 11) % 100}%`,
    size: i % 3 === 0 ? 2 : 1,
    opacity: 0.15 + (i % 5) * 0.08,
    delay: `${(i % 8) * 0.5}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #0a0a18 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="absolute rounded-full bg-white animate-pulse-glow"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}
