import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { collectVisit } from "../lib/analytics.js";
import { getClientIp } from "../lib/client-ip.js";
import { formatArticleDate, toAdminArticle, toPublicArticle } from "../lib/db.js";

const collectVisitSchema = z.object({
  path: z.string().min(1).max(512),
  referer: z.string().max(512).optional(),
});

export async function registerPublicRoutes(app: FastifyInstance) {
  app.get("/api/health", async () => ({ ok: true }));

  app.post("/api/analytics/collect", async (request, reply) => {
    const parsed = collectVisitSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid payload" });
    }

    const userAgent =
      typeof request.headers["user-agent"] === "string" ? request.headers["user-agent"] : "";

    await collectVisit(app.prisma, {
      ip: getClientIp(request),
      path: parsed.data.path,
      userAgent,
      referer: parsed.data.referer ?? "",
    });

    return reply.status(204).send();
  });

  app.get("/api/articles", async (request) => {
    const category =
      typeof request.query === "object" &&
      request.query !== null &&
      "category" in request.query &&
      typeof request.query.category === "string"
        ? request.query.category
        : undefined;

    const articles = await app.prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { category } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });

    return articles.map((article) => ({
      ...toPublicArticle(article),
      date: formatArticleDate(article.publishedAt),
    }));
  });

  app.get("/api/articles/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const article = await app.prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" },
    });

    if (!article) {
      return reply.status(404).send({ error: "Article not found" });
    }

    return toPublicArticle(article);
  });

  app.get("/api/articles/:slug/adjacent", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const published = await app.prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      select: { slug: true, title: true },
    });

    const index = published.findIndex((item) => item.slug === slug);
    if (index === -1) {
      return reply.status(404).send({ error: "Article not found" });
    }

    return {
      prev: index > 0 ? published[index - 1] : null,
      next: index < published.length - 1 ? published[index + 1] : null,
    };
  });

  app.get("/api/topics", async () => {
    const topics = await app.prisma.topic.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return topics.map(({ slug, icon, title, description }) => ({
      slug,
      icon,
      title,
      description,
    }));
  });

  app.get("/api/projects", async () => {
    const projects = await app.prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return projects.map((project) => ({
      name: project.name,
      description: project.description,
      stars: project.stars,
      url: project.url,
      tags: JSON.parse(project.tags) as string[],
    }));
  });
}
