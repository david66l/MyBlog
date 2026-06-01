import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { articles, projects, topics } from "../../src/lib/data.js";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@louis.dev";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash },
    create: { email, password: passwordHash, role: "admin" },
  });

  await prisma.topic.deleteMany();
  await prisma.project.deleteMany();

  await prisma.topic.createMany({
    data: topics.map((topic, index) => ({
      slug: topic.slug,
      icon: topic.icon,
      title: topic.title,
      description: topic.description,
      sortOrder: index,
    })),
  });

  await prisma.project.createMany({
    data: projects.map((project, index) => ({
      name: project.name,
      description: project.description,
      stars: project.stars,
      url: project.url,
      tags: JSON.stringify(project.tags),
      sortOrder: index,
    })),
  });

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        categoryLabel: article.categoryLabel,
        readTime: article.readTime,
        coverGradient: article.coverGradient,
        status: "PUBLISHED",
        publishedAt: new Date(`${article.date}T12:00:00.000Z`),
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        categoryLabel: article.categoryLabel,
        readTime: article.readTime,
        coverGradient: article.coverGradient,
        status: "PUBLISHED",
        publishedAt: new Date(`${article.date}T12:00:00.000Z`),
      },
    });
  }

  console.log(`Seeded admin user: ${email}`);
  console.log(`Seeded ${topics.length} topics, ${projects.length} projects, ${articles.length} articles`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
