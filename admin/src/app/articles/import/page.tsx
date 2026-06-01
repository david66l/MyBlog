"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ParsedMarkdown,
  getToken,
  importMarkdown,
  parseMarkdown,
} from "@/lib/api";

export default function ImportMarkdownPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [parsed, setParsed] = useState<ParsedMarkdown | null>(null);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setParsed(null);
    setFilename(file.name);

    try {
      const markdown = await file.text();
      const result = await parseMarkdown(markdown, file.name);
      setParsed(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败，请检查 Markdown 格式。");
    } finally {
      setLoading(false);
    }
  }

  async function onImport() {
    if (!parsed) return;
    const fileInput = document.getElementById("md-file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file) {
      setError("请重新选择 Markdown 文件。");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const markdown = await file.text();
      const article = await importMarkdown(markdown, file.name);
      router.push(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败，可能是 slug 已存在。");
    } finally {
      setImporting(false);
    }
  }

  if (!ready) return null;

  return (
    <main className="shell">
      <Link href="/articles" style={{ color: "rgba(255,255,255,0.45)" }}>
        ← back
      </Link>
      <h1 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>Import Markdown</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "0.75rem", lineHeight: 1.7 }}>
        上传 `.md` 文件，后台会自动识别标题、slug、分类、摘要和正文。
        支持 YAML frontmatter。
      </p>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="field">
          <label htmlFor="md-file">markdown file</label>
          <input
            id="md-file"
            type="file"
            accept=".md,.markdown,text/markdown"
            onChange={onFileChange}
          />
        </div>

        {loading && <p>parsing...</p>}
        {error && <p className="error">{error}</p>}

        {parsed && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: "1rem" }}>
              来源：{filename}
            </p>
            <dl className="preview-list">
              <dt>title</dt>
              <dd>{parsed.title}</dd>
              <dt>slug</dt>
              <dd>{parsed.slug}</dd>
              <dt>category</dt>
              <dd>
                {parsed.categoryLabel} ({parsed.category})
              </dd>
              <dt>read time</dt>
              <dd>{parsed.readTime}</dd>
              <dt>status</dt>
              <dd>{parsed.status}</dd>
              <dt>excerpt</dt>
              <dd>{parsed.excerpt}</dd>
            </dl>
            <div className="field" style={{ marginTop: "1rem" }}>
              <label>content preview</label>
              <textarea readOnly value={parsed.content.slice(0, 1200)} />
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onImport}
              disabled={importing}
            >
              {importing ? "importing..." : "import_as_draft_"}
            </button>
          </div>
        )}
      </div>

      <pre className="card" style={{ marginTop: "1.5rem", whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.55)" }}>
{`---
title: 文章标题
slug: my-article
category: astrobiology
excerpt: 可选摘要
readTime: 8 min
status: draft
---

## 第一节

正文内容...`}
      </pre>
    </main>
  );
}
