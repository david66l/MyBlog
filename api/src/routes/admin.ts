import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toAdminArticle } from "../lib/db.js";
import { parseMarkdownDocument } from "../lib/markdown-import.js";
import { slugify } from "../lib/slugify.js";

const articleInputSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  readTime: z.string().min(1),
  coverGradient: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

const articleUpdateSchema = articleInputSchema
  .partial()
  .transform((data) => {
    const next = { ...data };
    if (next.readTime !== undefined && next.readTime.trim() === "") {
      delete next.readTime;
    }
    if (next.slug !== undefined && next.slug.trim() === "") {
      delete next.slug;
    }
    if (next.title !== undefined && next.title.trim() === "") {
      delete next.title;
    }
    if (next.excerpt !== undefined && next.excerpt.trim() === "") {
      delete next.excerpt;
    }
    return next;
  });

const markdownBodySchema = z.object({
  markdown: z.string().min(1),
  filename: z.string().optional(),
});

function slugifyInput(input: string) {
  return slugify(input);
}

export async function registerAdminRoutes(app: FastifyInstance) {
  await app.register(async (admin) => {
    admin.addHook("preHandler", admin.authenticate);

    admin.get("/articles", async () => {
      const articles = await admin.prisma.article.findMany({
        orderBy: [{ updatedAt: "desc" }],
      });
      return articles.map(toAdminArticle);
    });

    admin.post("/articles/parse-markdown", async (request, reply) => {
      const parsed = markdownBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      return parseMarkdownDocument(parsed.data.markdown, parsed.data.filename);
    });

    admin.post("/articles/import-markdown", async (request, reply) => {
      const parsedBody = markdownBodySchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.status(400).send({ error: parsedBody.error.flatten() });
      }

      const parsed = parseMarkdownDocument(
        parsedBody.data.markdown,
        parsedBody.data.filename,
      );

      try {
        const article = await admin.prisma.article.create({
          data: {
            slug: parsed.slug,
            title: parsed.title,
            excerpt: parsed.excerpt,
            content: parsed.content,
            category: parsed.category,
            categoryLabel: parsed.categoryLabel,
            readTime: parsed.readTime,
            coverGradient: "from-zinc-950/80 via-slate-900 to-black",
            status: parsed.status,
            publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
          },
        });
        return reply.status(201).send(toAdminArticle(article));
      } catch {
        return reply.status(409).send({ error: "Slug already exists" });
      }
    });

    admin.get("/articles/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      const article = await admin.prisma.article.findUnique({ where: { id } });
      if (!article) return reply.status(404).send({ error: "Article not found" });
      return toAdminArticle(article);
    });

    admin.post("/articles", async (request, reply) => {
      const parsed = articleInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const data = parsed.data;
      const status = data.status ?? "DRAFT";
      const slug = slugifyInput(data.slug);

      try {
        const article = await admin.prisma.article.create({
          data: {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            categoryLabel: data.categoryLabel,
            readTime: data.readTime,
            coverGradient:
              data.coverGradient ?? "from-zinc-950/80 via-slate-900 to-black",
            status,
            publishedAt: status === "PUBLISHED" ? new Date() : null,
          },
        });
        return reply.status(201).send(toAdminArticle(article));
      } catch {
        return reply.status(409).send({ error: "Slug already exists" });
      }
    });

    admin.put("/articles/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = articleUpdateSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const existing = await admin.prisma.article.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ error: "Article not found" });

      const data = parsed.data;
      const nextStatus = data.status ?? existing.status;
      const publishedAt =
        nextStatus === "PUBLISHED"
          ? (existing.publishedAt ?? new Date())
          : nextStatus === "DRAFT"
            ? null
            : existing.publishedAt;

      try {
        const article = await admin.prisma.article.update({
          where: { id },
          data: {
            ...(data.slug ? { slug: slugifyInput(data.slug) } : {}),
            ...(data.title ? { title: data.title } : {}),
            ...(data.excerpt ? { excerpt: data.excerpt } : {}),
            ...(data.content ? { content: data.content } : {}),
            ...(data.category ? { category: data.category } : {}),
            ...(data.categoryLabel ? { categoryLabel: data.categoryLabel } : {}),
            ...(data.readTime ? { readTime: data.readTime } : {}),
            ...(data.coverGradient ? { coverGradient: data.coverGradient } : {}),
            status: nextStatus,
            publishedAt,
          },
        });
        return toAdminArticle(article);
      } catch {
        return reply.status(409).send({ error: "Slug already exists" });
      }
    });

    admin.post("/articles/:id/publish", async (request, reply) => {
      const { id } = request.params as { id: string };
      const existing = await admin.prisma.article.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ error: "Article not found" });

      const article = await admin.prisma.article.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: existing.publishedAt ?? new Date(),
        },
      });
      return toAdminArticle(article);
    });

    admin.post("/articles/:id/unpublish", async (request, reply) => {
      const { id } = request.params as { id: string };
      const existing = await admin.prisma.article.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ error: "Article not found" });

      const article = await admin.prisma.article.update({
        where: { id },
        data: { status: "DRAFT" },
      });
      return toAdminArticle(article);
    });

    admin.delete("/articles/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      const existing = await admin.prisma.article.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ error: "Article not found" });
      await admin.prisma.article.delete({ where: { id } });
      return reply.status(204).send();
    });
  }, { prefix: "/admin" });
}
