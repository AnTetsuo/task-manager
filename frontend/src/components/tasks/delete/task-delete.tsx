"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBtn({ taskId }: { taskId: number }) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function deleteTask() {
    setSaving(true);
    setError(null);

    try {
      await trpc.tasks.delete.mutate(taskId);
      router.refresh();
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
