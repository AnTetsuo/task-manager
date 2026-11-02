"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function TaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const field =
    "border border-line bg-base px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none";

  async function add(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError(
        "Title is required, and needs to be at least 1 and max 280 character(s) long",
      );
      return;
    }

    setSaving(true);

    try {
      await trpc.tasks.create.mutate({
        title: trimmedTitle,
        description,
      });
      setTitle("");
      setError(null);
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="w-full max-w-md">
      <form
        onSubmit={add}
        className="flex flex-col gap-3 border border-line bg-surface p-4"
      >
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name your task"
          className={field}
        />
        <input
          aria-label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any details? Drop them here"
          className={field}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={saving} className="button is-primary self-end">
          Save
        </button>
      </form>
    </section>
  );
}
