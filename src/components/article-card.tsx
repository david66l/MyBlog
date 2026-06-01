import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-sm border border-white/[0.08] bg-black p-6 transition-colors hover:border-white/20 hover:bg-white/[0.02]"
    >
      <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
        {article.categoryLabel}
      </span>
      <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-sm font-semibold uppercase tracking-[0.08em] leading-snug text-foreground transition-colors group-hover:text-white">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-white/45">{article.excerpt}</p>
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tabular-nums text-white/25">
        <time dateTime={article.date}>{article.date}</time>
        <span>·</span>
        <span>{article.readTime}</span>
      </div>
    </Link>
  );
}
