import { Suspense } from "react";
import TaskForm from "../components/tasks/add/task-form";
import Tasks from "@/components/tasks/list/tasks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="title is-1 has-text-primary">Add a Task</h1>
      <TaskForm />
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <Tasks />
      </Suspense>
    </main>
  );
}
