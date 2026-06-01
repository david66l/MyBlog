import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { prisma } from "./lib/db.js";
import { registerAuthHook, registerAuthRoutes } from "./lib/auth.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerPublicRoutes } from "./routes/public.js";

const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((item) => item.trim()) ?? [
  "http://localhost:3000",
  "http://localhost:3001",
];

async function main() {
  const app = Fastify({ logger: true, trustProxy: true });
  app.decorate("prisma", prisma);

  await app.register(cors, {
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  registerAuthHook(app);
  await registerAuthRoutes(app);
  await registerPublicRoutes(app);
  await registerAdminRoutes(app);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
