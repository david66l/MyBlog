import Link from "next/link";
import type { Article } from "@/lib/types";

interface LandingArticlesProps {
  articles: Article[];
}

export function LandingArticles({ articles }: LandingArticlesProps) {
  return (
    <section className="border-t border-white/[0.06] bg-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              latest / feed
            </p>
            <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold uppercase tracking-[0.12em] text-white">
              Articles
            </h2>
          </div>
          <Link
            href="/articles"
            className="font-mono text-xs text-muted uppercase transition-colors hover:text-white"
          >
            view_all →
          </Link>
        </div>

        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group grid gap-4 py-8 transition-colors hover:bg-white/[0.015] md:grid-cols-[4rem_1fr_auto] md:items-center md:gap-8 md:py-10"
            >
              <span className="font-mono text-2xl tabular-nums text-white/[0.08] transition-colors group-hover:text-white/20 md:text-3xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-orbitron)] text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition-colors group-hover:text-white md:text-sm">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-1 text-sm text-white/45">{article.excerpt}</p>
              </div>
              <div className="flex flex-col items-start gap-1 md:items-end">
                <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                  {article.categoryLabel}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-white/25">
                  {article.date} · {article.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
