import { slugify } from "./slugify.js";

const CATEGORY_LABELS: Record<string, string> = {
  astrobiology: "天体生物学",
  exoplanets: "系外行星",
  extremophiles: "极端微生物",
  "ai-agent": "AI Agent",
  llm: "大模型",
  toolchain: "工具链",
  engineering: "工程实践",
  reading: "读书笔记",
  thoughts: "随笔",
};

export type ParsedMarkdownArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryLabel: string;
  readTime: string;
  status: "DRAFT" | "PUBLISHED";
};

function parseFrontmatter(block: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }
  return result;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(content: string): string {
  const plain = stripMarkdown(content);
  const minutes = Math.max(1, Math.ceil(plain.length / 450));
  return `${minutes} min`;
}

function extractExcerpt(content: string, metaExcerpt?: string): string {
  if (metaExcerpt?.trim()) return metaExcerpt.trim().slice(0, 280);

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of paragraphs) {
    if (part.startsWith("#")) continue;
    if (part.startsWith("```")) continue;
    const plain = stripMarkdown(part);
    if (plain.length >= 12) return plain.slice(0, 280);
  }

  return stripMarkdown(content).slice(0, 280) || "暂无摘要";
}

function normalizeCategory(raw?: string): { category: string; categoryLabel: string } {
  const category = (raw ?? "thoughts").trim().toLowerCase();
  if (CATEGORY_LABELS[category]) {
    return { category, categoryLabel: CATEGORY_LABELS[category] };
  }
  return { category: "thoughts", categoryLabel: CATEGORY_LABELS.thoughts };
}

function stripLeadingTitle(content: string, title: string): string {
  const lines = content.split("\n");
  const first = lines.findIndex((line) => line.trim().length > 0);
  if (first === -1) return content;

  const headingMatch = lines[first].match(/^#\s+(.+)$/);
  if (!headingMatch) return content;

  const heading = headingMatch[1].trim();
  if (heading !== title && !heading.includes(title) && !title.includes(heading)) {
    return content;
  }

  const rest = lines.slice(first + 1).join("\n").trim();
  return rest || content;
}

export function parseMarkdownDocument(
  raw: string,
  filename?: string,
): ParsedMarkdownArticle {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  let meta: Record<string, string> = {};
  let content = trimmed;

  const frontmatterMatch = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (frontmatterMatch) {
    meta = parseFrontmatter(frontmatterMatch[1]);
    content = frontmatterMatch[2].trim();
  }

  const headingMatch = content.match(/^#\s+(.+)$/m);
  const filenameTitle = filename?.replace(/\.(md|markdown)$/i, "").replace(/[-_]+/g, " ");
  const title = (meta.title || headingMatch?.[1] || filenameTitle || "未命名文章").trim();

  content = stripLeadingTitle(content, title);

  const { category, categoryLabel } = normalizeCategory(meta.category);
  const slug = slugify(meta.slug || filename?.replace(/\.(md|markdown)$/i, "") || title);
  const excerpt = extractExcerpt(content, meta.excerpt);
  const readTime = meta.readtime || meta["read-time"] || estimateReadTime(content);
  const status =
    meta.status?.toLowerCase() === "published" ? "PUBLISHED" : "DRAFT";

  return {
    slug,
    title,
    excerpt,
    content,
    category,
    categoryLabel,
    readTime,
    status,
  };
}
