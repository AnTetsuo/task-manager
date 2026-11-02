"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function DeleteBtn({
  taskId,
  onDeleted,
}: {
  taskId: number;
  onDeleted: (taskId: number) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function deleteTask() {
    setSaving(true);
    setError(null);

    try {
      await trpc.tasks.delete.mutate(taskId);
      onDeleted(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={deleteTask}
        disabled={saving}
        className="button is-danger rounded bg-black px-4 py-2 text-white"
      >
        Delete
      </button>
    </>
  );
}
