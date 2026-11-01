import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./router.js";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    maxAge: 600,
  }),
);

app.get("/", (c) => c.json({ status: "ok", service: "hono-backend" }));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Hono API running on http://localhost:${info.port}`);
});

export type { AppRouter } from "./router.js";
