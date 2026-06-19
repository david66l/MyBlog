import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  fetchAdjacentArticles,
  fetchArticle,
  fetchArticleSlugs,
} from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await fetchArticleSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600; // ISR: 1小时缓存，减轻 RSC 传输压力

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
            {"// "}{article.categoryLabel}
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

      <article className="prose-article mx-auto max-w-[720px] px-6 py-16 lg:px-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // 阻止 react-markdown 的默认 <pre> 包裹（CodeBlock 自己管理）
            pre({ children }) {
              return <>{children}</>;
            },
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const lang = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");

              // Mermaid 图表
              if (lang === "mermaid") {
                return (
                  <div className="group relative my-6 overflow-hidden rounded-sm border border-white/[0.08] bg-[#050505]">
                    <div className="flex items-center border-b border-white/[0.06] px-4 py-2">
                      <span className="font-mono text-[10px] tracking-[0.15em] text-white/35 uppercase">mermaid</span>
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                      <code className="font-mono text-white/50">{code}</code>
                    </pre>
                  </div>
                );
              }

              // 行内代码
              if (!lang && !String(children).includes("\n")) {
                return (
                  <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-white/70" {...props}>
                    {children}
                  </code>
                );
              }

              // 代码块：用 CodeBlock 外壳 + rehype-highlight 的高亮 HTML
              // rehype-highlight 已经把 children 转成了 <span class="hljs-*"> 结构
              return (
                <div className="group relative overflow-hidden rounded-sm border border-white/[0.08] bg-[#050505]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-white/35 uppercase">{lang || "code"}</span>
                    <button
                      type="button"
                      className="font-mono text-[10px] tracking-wider text-white/35 uppercase transition-colors hover:text-white"
                      onClick={async (e) => {
                        await navigator.clipboard.writeText(code);
                        const btn = e.currentTarget;
                        btn.textContent = "copied";
                        setTimeout(() => { btn.textContent = "copy"; }, 2000);
                      }}
                    >
                      copy
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                    <code className={className} {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto">
                  <table>{children}</table>
                </div>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/50">
                  {children}
                </blockquote>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
                >
                  {children}
                </a>
              );
            },
            hr() {
              return <hr className="my-8 border-white/[0.08]" />;
            },
            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="my-6 rounded-sm border border-white/[0.08]"
                />
              );
            },
          }}
        >
          {article.content}
        </ReactMarkdown>
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
