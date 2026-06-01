import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type ArticleRecord = Awaited<
  ReturnType<typeof prisma.article.findFirst>
> & { id: string };

export function formatArticleDate(publishedAt: Date | null | undefined): string {
  if (!publishedAt) return "";
  return publishedAt.toISOString().slice(0, 10);
}

export function toPublicArticle(article: NonNullable<ArticleRecord>) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: article.categoryLabel,
    date: formatArticleDate(article.publishedAt),
    readTime: article.readTime,
    coverGradient: article.coverGradient,
    content: article.content,
  };
}

export function toAdminArticle(article: NonNullable<ArticleRecord>) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: article.categoryLabel,
    readTime: article.readTime,
    coverGradient: article.coverGradient,
    content: article.content,
    status: article.status,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}
