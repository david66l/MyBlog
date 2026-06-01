"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categoryOptions, createArticle } from "@/lib/api";

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(categoryOptions[0].slug);
  const categoryLabel =
    categoryOptions.find((item) => item.slug === category)?.label ?? category;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const article = await createArticle({
        slug: String(form.get("slug") ?? ""),
        title: String(form.get("title") ?? ""),
        excerpt: String(form.get("excerpt") ?? ""),
        content: String(form.get("content") ?? ""),
        category,
        categoryLabel,
        readTime: String(form.get("readTime") ?? "5 min"),
        status: "DRAFT",
      });
      router.push(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败，请检查 slug 是否重复。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <Link href="/articles" style={{ color: "rgba(255,255,255,0.45)" }}>
        ← back
      </Link>
      <h1 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>New article</h1>
      <form className="card" style={{ marginTop: "1.5rem" }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="title">title</label>
          <input id="title" name="title" required />
        </div>
        <div className="field">
          <label htmlFor="slug">slug</label>
          <input id="slug" name="slug" placeholder="my-new-post" required />
        </div>
        <div className="field">
          <label htmlFor="category">category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categoryOptions.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="readTime">read time</label>
          <input id="readTime" name="readTime" defaultValue="8 min" />
        </div>
        <div className="field">
          <label htmlFor="excerpt">excerpt</label>
          <textarea id="excerpt" name="excerpt" required />
        </div>
        <div className="field">
          <label htmlFor="content">content (markdown)</label>
          <textarea id="content" name="content" required />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "saving..." : "save_draft_"}
        </button>
      </form>
    </main>
  );
}
