import Link from "next/link";
import type { Topic } from "@/lib/types";

interface LandingTopicsProps {
  topics: Topic[];
}

export function LandingTopics({ topics }: LandingTopicsProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-black px-6 py-24">
      <div
        className="pointer-events-none absolute top-0 right-0 h-px w-1/3 bg-gradient-to-l from-white/20 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              index / topics
            </p>
            <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold uppercase tracking-[0.12em] text-white md:text-3xl">
              Topics
            </h2>
          </div>
          <Link
            href="/articles"
            className="hidden font-mono text-xs text-muted uppercase transition-colors hover:text-white sm:inline"
          >
            view_all →
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => {
            const isFeatured = i === 0;
            return (
              <Link
                key={topic.slug}
                href={`/articles?category=${topic.slug}`}
                className={`group relative bg-black p-6 transition-colors hover:bg-white/[0.02] md:p-8 ${
                  isFeatured ? "sm:col-span-2 lg:row-span-1" : ""
                }`}
              >
                <span className="absolute top-4 right-4 font-mono text-[10px] text-white/15 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)",
                  }}
                />
                <span className="text-2xl md:text-3xl" aria-hidden>
                  {topic.icon}
                </span>
                <h3
                  className={`mt-4 font-[family-name:var(--font-orbitron)] font-semibold uppercase tracking-[0.08em] text-foreground ${
                    isFeatured ? "text-sm md:text-base" : "text-xs"
                  }`}
                >
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{topic.description}</p>
                <span className="mt-6 inline-block font-mono text-[10px] tracking-wider text-white/30 opacity-0 transition-opacity group-hover:opacity-100">
                  enter →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
