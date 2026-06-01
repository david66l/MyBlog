import Link from "next/link";
import type { Topic } from "@/lib/types";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link
      href={`/articles?category=${topic.slug}`}
      className="group flex flex-col rounded-sm border border-white/[0.08] bg-black p-6 transition-colors hover:border-white/20 hover:bg-white/[0.02]"
    >
      <span className="text-2xl" aria-hidden>
        {topic.icon}
      </span>
      <h3 className="mt-4 font-[family-name:var(--font-orbitron)] text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
        {topic.title}
      </h3>
      <p className="mt-2 text-sm text-white/45">{topic.description}</p>
      <span className="mt-auto pt-4 font-mono text-[10px] tracking-wider text-white/30 opacity-0 transition-opacity group-hover:opacity-100">
        enter →
      </span>
    </Link>
  );
}
