import { beforeEach, describe, expect, it } from "vitest";
import { createCallerFactory } from "../trpc";
import { resetTasks, tasksRouter } from "../routers/tasks.router";

const createCaller = createCallerFactory(tasksRouter);
const caller = createCaller({});

beforeEach(() => resetTasks());

describe("task router", () => {
  it("creates and lists tasks", async () => {
    const task = await caller.create({ title: "write tests" });
    expect(task).toMatchObject({ id: 1, title: "write tests" });

    const list = await caller.list({});
    expect(list).toMatchObject({
      tasks: [expect.objectContaining({ id: 1, title: "write tests" })],
      nextCursor: null,
    });
  });

  it("rejects invalid input", async () => {
    await expect(caller.create({ title: "" })).rejects.toThrow();
  });

  it("deletes a task", async () => {
    const task = await caller.create({ title: "temp" });
    await caller.delete(task.id);
    await expect(caller.list()).resolves.toMatchObject({
      tasks: [],
      nextCursor: null,
    });
  });

  it("throws NOT_FOUND for a missing task", async () => {
    await expect(caller.delete(999)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("returns the next offset cursor for partial pages", async () => {
    await Promise.all(
      ["first", "second", "third"].map((title) => caller.create({ title })),
    );

    await expect(caller.list({ limit: 2 })).resolves.toMatchObject({
      tasks: [
        expect.objectContaining({ title: "third" }),
        expect.objectContaining({ title: "second" }),
      ],
      nextCursor: 2,
    });

    await expect(caller.list({ cursor: 2, limit: 2 })).resolves.toMatchObject({
      tasks: [expect.objectContaining({ title: "first" })],
      nextCursor: null,
    });
  });
});
