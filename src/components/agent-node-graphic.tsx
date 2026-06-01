"use client";

import { useEffect, useState } from "react";

export function AgentNodeGraphic() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[420px] transition-all duration-1000 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      aria-hidden
    >
      {/* Outer rotating ring */}
      <div className="absolute inset-[8%] animate-spin-slow rounded-full border border-dashed border-accent/20" />
      <div className="absolute inset-[18%] animate-spin-reverse rounded-full border border-white/[0.06]" />

      {/* Glow core */}
      <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-xl animate-pulse-glow" />

      <svg viewBox="0 0 400 400" fill="none" className="relative h-full w-full">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit paths */}
        <circle cx="200" cy="200" r="120" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

        {/* Connection lines with dash animation */}
        {[
          { x: 200, y: 60 },
          { x: 321, y: 270 },
          { x: 79, y: 270 },
          { x: 320, y: 130 },
          { x: 80, y: 130 },
        ].map((node, i) => (
          <g key={i}>
            <line
              x1="200"
              y1="200"
              x2={node.x}
              y2={node.y}
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="0.75"
              strokeDasharray="4 6"
              className="animate-dash-flow"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
            <circle cx={node.x} cy={node.y} r="5" fill="#e8e8e8" opacity="0.85">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={node.x} cy={node.y} r="12" stroke="rgba(232,232,232,0.15)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Core */}
        <circle cx="200" cy="200" r="40" fill="url(#coreGlow)" opacity="0.5" />
        <circle cx="200" cy="200" r="10" fill="#3b82f6" className="animate-pulse-glow" />
        <circle cx="200" cy="200" r="18" stroke="#3b82f6" strokeWidth="0.75" opacity="0.5" />

        {/* Crosshair */}
        <line x1="200" y1="170" x2="200" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="200" y1="230" x2="200" y2="245" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="170" y1="200" x2="155" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="230" y1="200" x2="245" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Floating data readouts */}
      <div className="absolute top-[12%] right-[5%] rounded-sm border border-white/[0.08] bg-black/60 px-2 py-1 font-mono text-[9px] text-accent/80 backdrop-blur-sm">
        inference: 847 tok/s
      </div>
      <div className="absolute bottom-[18%] left-[0%] rounded-sm border border-white/[0.08] bg-black/60 px-2 py-1 font-mono text-[9px] text-muted backdrop-blur-sm">
        mesh.sync ✓
      </div>
    </div>
  );
}
