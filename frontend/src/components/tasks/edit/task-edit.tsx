"use client";

import { trpc, type Task } from "@/lib/trpc";
import { useRef, useState } from "react";

export default function EditBtn({
  taskId,
  title,
  description,
  onChanged,
}: {
  taskId: number;
  title: string;
  description?: string;
  onChanged: (task: Task) => void | Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState(title);
  const [formDescription, setFormDescription] = useState(description ?? "");
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updatedTask = await trpc.tasks.update.mutate({
        id: taskId,
        title: formTitle,
        description: formDescription,
      });
      dialogRef.current?.close();
      await onChanged(updatedTask);
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
          setFormTitle(title);
          setFormDescription(description ?? "");
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
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              className="border border-line bg-base px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-muted">
            Description
            <textarea
              name="description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={4}
              className="resize-none border border-line bg-base px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button"
              onClick={() => {
                dialogRef.current?.close();
                setFormTitle(title);
                setFormDescription(description ?? "");
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
