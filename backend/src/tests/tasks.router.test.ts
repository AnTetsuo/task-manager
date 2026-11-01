import { beforeEach, describe, expect, it } from "vitest";
import { createCallerFactory } from "../trpc";
import { resetTasks, tasksRouter } from "../routers/tasks.router";

const createCaller = createCallerFactory(tasksRouter);
const caller = createCaller({}); // pass a fake ctx here once you add auth

beforeEach(() => resetTasks());

describe("task router", () => {
  it("creates and lists tasks", async () => {
    const task = await caller.create({ title: "write tests" });
    expect(task).toMatchObject({ id: 1, title: "write tests" });

    const list = await caller.list();
    expect(list).toHaveLength(1);
  });

  it("rejects invalid input", async () => {
    await expect(caller.create({ title: "" })).rejects.toThrow();
  });

  it("deletes a task", async () => {
    const task = await caller.create({ title: "temp" });
    await caller.delete(task.id);
    expect(await caller.list()).toHaveLength(0);
  });

  it("throws NOT_FOUND for a missing task", async () => {
    await expect(caller.delete(999)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
