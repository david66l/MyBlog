interface StatsBarProps {
  stats: { label: string; value: string }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="border-y border-white/[0.06] bg-black">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-black px-6 py-8 text-center">
            <p className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold tracking-[0.08em] text-white md:text-3xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-wider text-muted uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
