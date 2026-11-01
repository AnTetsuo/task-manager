import { router } from "./trpc.js";
import { tasksRouter } from "./routers/tasks.router.js";

export const appRouter = router({
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
