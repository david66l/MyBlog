import type { Article, Category, Project, Topic } from "@/lib/types";
import { apiFetch } from "./config";

export async function fetchArticles(category?: Category | "all"): Promise<Article[]> {
  const query =
    category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<Article[]>(`/api/articles${query}`, { revalidate: 0 });
}

export async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    return await apiFetch<Article>(`/api/articles/${encodeURIComponent(slug)}`, {
      revalidate: 0,
    });
  } catch {
    return null;
  }
}

export async function fetchArticleSlugs(): Promise<string[]> {
  const articles = await fetchArticles();
  return articles.map((article) => article.slug);
}

export async function fetchAdjacentArticles(slug: string): Promise<{
  prev: Pick<Article, "slug" | "title"> | null;
  next: Pick<Article, "slug" | "title"> | null;
}> {
  try {
    return await apiFetch(`/api/articles/${encodeURIComponent(slug)}/adjacent`, {
      revalidate: 0,
    });
  } catch {
    return { prev: null, next: null };
  }
}

export async function fetchTopics(): Promise<Topic[]> {
  return apiFetch<Topic[]>("/api/topics");
}

export async function fetchProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/api/projects");
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/health`,
      { cache: "no-store" },
    );
    return response.ok;
  } catch {
    return false;
  }
}
