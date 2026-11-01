"use client";

import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function EditBtn({
  taskId,
  title,
  description,
}: {
  taskId: number;
  title: string;
  description?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSaving(true);
    setError(null);

    try {
      await trpc.tasks.update.mutate({
        id: taskId,
        title: String(data.get("title")),
        description: String(data.get("description")),
      });
      dialogRef.current?.close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        className="button is-primary"
        onClick={() => {
          setError(null);
          dialogRef.current?.showModal();
        }}
      >
        Edit
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md border border-line bg-surface p-4 text-fg backdrop:bg-black/60"
      >
        <form onSubmit={save} className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-primary">Edit task</h2>

          <label className="flex flex-col gap-1 text-sm text-muted">
            Title
            <input
              name="title"
              defaultValue={title}
              required
              className="border border-line bg-base px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-muted">
            Description
            <textarea
              name="description"
              defaultValue={description}
              rows={4}
              className="resize-none border border-line bg-base px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button"
              onClick={(e) => {
                dialogRef.current?.close();
                e.currentTarget.form?.reset();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button is-primary"
              disabled={saving}
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
