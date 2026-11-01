import z from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

type Task = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
};

const tasks: Task[] = [];
let id = 0;

export const tasksRouter = router({
  list: publicProcedure.query(() => tasks),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(280),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => {
      id += 1;
      const task: Task = {
        id: id,
        title: input.title,
        description: input.description,
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(280),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);

      if (index === -1)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task ${input.id} not found`,
        });

      tasks[index] = {
        ...tasks[index],
        title: input.title,
        description: input.description,
      };

      return tasks[index];
    }),

  delete: publicProcedure.input(z.number()).mutation(({ input: taskId }) => {
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Task ${taskId} not found`,
      });

    tasks.splice(index, 1);
  }),
});

export const resetTasks = () => {
  tasks.length = 0;
};
