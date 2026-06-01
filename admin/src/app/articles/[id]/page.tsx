"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  AdminArticle,
  categoryOptions,
  deleteArticle,
  getArticle,
  getToken,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "@/lib/api";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function showSuccess(message: string) {
    setError("");
    setSuccess(message);
  }

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), 4000);
    return () => window.clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    getArticle(params.id)
      .then(setArticle)
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!article) return;
    setSaving(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category") ?? article.category);
    const categoryLabel =
      categoryOptions.find((item) => item.slug === category)?.label ?? category;

    try {
      const updated = await updateArticle(article.id, {
        slug: String(form.get("slug") ?? article.slug).trim(),
        title: String(form.get("title") ?? article.title).trim(),
        excerpt: String(form.get("excerpt") ?? article.excerpt).trim(),
        content: String(form.get("content") ?? article.content),
        category,
        categoryLabel,
        readTime:
          String(form.get("readTime") ?? article.readTime).trim() || article.readTime,
      });
      setArticle(updated);
      showSuccess("保存成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    if (!article) return;
    setError("");
    setSuccess("");
    try {
      const updated = await publishArticle(article.id);
      setArticle(updated);
      showSuccess("发布成功，前台刷新即可看到最新内容");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败");
    }
  }

  async function onUnpublish() {
    if (!article) return;
    setError("");
    setSuccess("");
    try {
      const updated = await unpublishArticle(article.id);
      setArticle(updated);
      showSuccess("已撤回为草稿");
    } catch (err) {
      setError(err instanceof Error ? err.message : "撤回失败");
    }
  }

  async function onDelete() {
    if (!article || !confirm("确定删除这篇文章？")) return;
    setError("");
    try {
      await deleteArticle(article.id);
      router.push("/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    }
  }

  if (loading) {
    return (
      <main className="shell">
        <p>loading...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="shell">
        <p className="error">{error || "Not found"}</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <Link href="/articles" style={{ color: "rgba(255,255,255,0.45)" }}>
        ← back
      </Link>
      <div className="row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Edit article</h1>
        <span className={`badge ${article.status === "PUBLISHED" ? "badge-published" : "badge-draft"}`}>
          {article.status}
        </span>
      </div>

      <form className="card" style={{ marginTop: "1.5rem" }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="title">title</label>
          <input id="title" name="title" defaultValue={article.title} required />
        </div>
        <div className="field">
          <label htmlFor="slug">slug</label>
          <input id="slug" name="slug" defaultValue={article.slug} required />
        </div>
        <div className="field">
          <label htmlFor="category">category</label>
          <select id="category" name="category" defaultValue={article.category}>
            {categoryOptions.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="readTime">read time</label>
          <input id="readTime" name="readTime" defaultValue={article.readTime} />
        </div>
        <div className="field">
          <label htmlFor="excerpt">excerpt</label>
          <textarea id="excerpt" name="excerpt" defaultValue={article.excerpt} required />
        </div>
        <div className="field">
          <label htmlFor="content">content (markdown)</label>
          <textarea id="content" name="content" defaultValue={article.content} required />
        </div>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "saving..." : "save_"}
          </button>
          {article.status === "PUBLISHED" ? (
            <button className="btn" type="button" onClick={onUnpublish}>
              unpublish_
            </button>
          ) : (
            <button className="btn" type="button" onClick={onPublish}>
              publish_
            </button>
          )}
          <button className="btn btn-danger" type="button" onClick={onDelete}>
            delete_
          </button>
        </div>
      </form>
    </main>
  );
}
