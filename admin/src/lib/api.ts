const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryLabel: string;
  readTime: string;
  coverGradient: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("louis_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("louis_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("louis_admin_token");
}

async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers ?? {});

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    let message = body || `Request failed: ${response.status}`;
    try {
      const parsed = JSON.parse(body) as { error?: string | { fieldErrors?: Record<string, string[]> } };
      if (typeof parsed.error === "string") {
        message = parsed.error;
      } else if (parsed.error && typeof parsed.error === "object") {
        const fields = Object.entries(parsed.error.fieldErrors ?? {})
          .flatMap(([key, values]) => values.map((value) => `${key}: ${value}`))
          .join("; ");
        if (fields) message = fields;
      }
    } catch {
      // keep raw body
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json() as Promise<{ token: string }>;
}

export async function listArticles() {
  return adminFetch<AdminArticle[]>("/admin/articles");
}

export async function getArticle(id: string) {
  return adminFetch<AdminArticle>(`/admin/articles/${id}`);
}

export async function createArticle(data: Partial<AdminArticle>) {
  return adminFetch<AdminArticle>("/admin/articles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateArticle(id: string, data: Partial<AdminArticle>) {
  return adminFetch<AdminArticle>(`/admin/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function publishArticle(id: string) {
  return adminFetch<AdminArticle>(`/admin/articles/${id}/publish`, { method: "POST" });
}

export async function unpublishArticle(id: string) {
  return adminFetch<AdminArticle>(`/admin/articles/${id}/unpublish`, { method: "POST" });
}

export async function deleteArticle(id: string) {
  return adminFetch<void>(`/admin/articles/${id}`, { method: "DELETE" });
}

export type ParsedMarkdown = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryLabel: string;
  readTime: string;
  status: "DRAFT" | "PUBLISHED";
};

export async function parseMarkdown(markdown: string, filename?: string) {
  return adminFetch<ParsedMarkdown>("/admin/articles/parse-markdown", {
    method: "POST",
    body: JSON.stringify({ markdown, filename }),
  });
}

export async function importMarkdown(markdown: string, filename?: string) {
  return adminFetch<AdminArticle>("/admin/articles/import-markdown", {
    method: "POST",
    body: JSON.stringify({ markdown, filename }),
  });
}

export const categoryOptions = [
  { slug: "astrobiology", label: "天体生物学" },
  { slug: "exoplanets", label: "系外行星" },
  { slug: "extremophiles", label: "极端微生物" },
  { slug: "ai-agent", label: "AI Agent" },
  { slug: "llm", label: "大模型" },
  { slug: "toolchain", label: "工具链" },
  { slug: "engineering", label: "工程实践" },
  { slug: "reading", label: "读书笔记" },
  { slug: "thoughts", label: "随笔" },
];
