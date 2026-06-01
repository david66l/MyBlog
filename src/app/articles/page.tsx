import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { categoryFilters } from "@/lib/data";
import { fetchArticles } from "@/lib/api";
import type { Category } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { category: categoryParam } = await searchParams;
  const activeCategory = categoryFilters.some((f) => f.slug === categoryParam)
    ? (categoryParam as Category | "all")
    : "all";

  const filtered = await fetchArticles(activeCategory);

  return (
    <PageShell
      tag="// read"
      title="Articles"
      subtitle="Notes on AI, engineering, and things worth building."
      maxWidth="4xl"
    >
      <div className="mb-12 flex flex-wrap gap-2">
        {categoryFilters.map((filter) => {
          const isActive = filter.slug === activeCategory;
          const href =
            filter.slug === "all"
              ? "/articles"
              : `/articles?category=${filter.slug}`;
          return (
            <Link
              key={filter.slug}
              href={href}
              className={`rounded-sm border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                isActive
                  ? "border-white/30 bg-white/5 text-white"
                  : "border-white/[0.08] text-muted hover:border-white/20 hover:text-white"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="divide-y divide-white/[0.06]">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group grid gap-4 py-8 transition-colors hover:bg-white/[0.01] md:grid-cols-[120px_1fr_auto] md:gap-8"
          >
            <time
              dateTime={article.date}
              className="font-mono text-lg tabular-nums text-white/25 transition-colors group-hover:text-white/40"
            >
              {article.date.slice(5).replace("-", ".")}
            </time>
            <div>
              <h2 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition-colors group-hover:text-white">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                {article.excerpt}
              </p>
              <p className="mt-3 font-mono text-[10px] text-white/30 uppercase">
                {article.readTime}
              </p>
            </div>
            <span className="self-start rounded-sm border border-white/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted uppercase">
              {article.categoryLabel}
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center font-mono text-sm text-white/40 uppercase">
          no entries
        </p>
      )}
    </PageShell>
  );
}
