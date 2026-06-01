import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import {
  fetchAdjacentArticles,
  fetchArticle,
  fetchArticleSlugs,
} from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

function renderContent(content: string) {
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, i) => {
    const codeMatch = block.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (codeMatch) {
      const [, lang, code] = codeMatch;
      return <CodeBlock key={i} language={lang || "code"} code={code.trim()} />;
    }

    return (
      <div
        key={i}
        className="prose-article"
        dangerouslySetInnerHTML={{
          __html: block
            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
            .replace(/^### (.+)$/gm, "<h3>$1</h3>")
            .replace(/^\d+\. \*\*(.+?)\*\* — (.+)$/gm, "<li><strong>$1</strong> — $2</li>")
            .replace(/^- \*\*(.+?)\*\* — (.+)$/gm, "<li><strong>$1</strong> — $2</li>")
            .replace(/^- (.+)$/gm, "<li>$1</li>")
            .replace(/^\|(.+)\|$/gm, (_, row) => {
              const cells = row.split("|").map((c: string) => c.trim());
              if (cells.every((c: string) => /^[-:]+$/.test(c))) return "";
              const tag = cells.some((c: string) => c.includes("---")) ? "" : "td";
              if (!tag) return "";
              return `<tr>${cells.map((c: string) => `<${tag}>${c}</${tag}>`).join("")}</tr>`;
            })
            .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
            .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
            .split("\n\n")
            .filter(Boolean)
            .map((p) => {
              if (p.startsWith("<")) return p;
              return `<p>${p}</p>`;
            })
            .join(""),
        }}
      />
    );
  });
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchArticleSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return { title: "文章未找到" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) notFound();

  const { prev, next } = await fetchAdjacentArticles(slug);

  return (
    <main className="bg-black">
      <header className="border-b border-white/[0.06] px-6 py-14 lg:px-10">
        <div className="relative mx-auto w-full max-w-[720px]">
          <div className="pointer-events-none absolute -inset-6 hidden md:block" aria-hidden>
            <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-white/15" />
            <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/15" />
          </div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase">
            // {article.categoryLabel}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-orbitron)] text-[clamp(1.25rem,3vw,1.75rem)] font-semibold uppercase leading-snug tracking-[0.08em] text-white">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 font-mono text-[10px] tracking-wider text-white/35 uppercase">
            <time dateTime={article.date}>{article.date}</time>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-[720px] px-6 py-16 lg:px-10">
        {renderContent(article.content)}
      </article>

      <nav className="mx-auto grid max-w-[720px] grid-cols-2 gap-4 border-t border-white/[0.06] px-6 py-12 lg:px-10">
        {prev ? (
          <Link
            href={`/articles/${prev.slug}`}
            className="group rounded-sm border border-white/[0.08] p-4 transition-colors hover:border-white/20"
          >
            <span className="font-mono text-[10px] tracking-wider text-white/35 uppercase">← prev</span>
            <p className="mt-2 text-sm text-foreground transition-colors group-hover:text-white">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/articles/${next.slug}`}
            className="group rounded-sm border border-white/[0.08] p-4 text-right transition-colors hover:border-white/20"
          >
            <span className="font-mono text-[10px] tracking-wider text-white/35 uppercase">next →</span>
            <p className="mt-2 text-sm text-foreground transition-colors group-hover:text-white">
              {next.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
