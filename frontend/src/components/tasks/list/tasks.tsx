import { trpc } from "@/lib/trpc";
import TaskList from "./task-list";
import { PAGE_SIZE } from "./constants";

export default async function Tasks() {
  const { tasks, nextCursor } = await trpc.tasks.list.query({
    limit: PAGE_SIZE,
  });

  return (
    <TaskList
      key={tasks[0]?.id ?? "empty"}
      initialTasks={tasks}
      initialCursor={nextCursor}
    />
  );
}
