"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trpc, type Task } from "@/lib/trpc";
import DeleteBtn from "../delete/task-delete";
import EditBtn from "../edit/task-edit";
import { PAGE_SIZE } from "./constants";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "numeric",
  year: "2-digit",
  hour: "numeric",
  minute: "numeric",
});

type Props = {
  initialTasks: Task[];
  initialCursor: number | null;
};

export default function TaskList({ initialTasks, initialCursor }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<{
    task: Task;
    top: number;
    left: number;
  } | null>(null);

  const cursorRef = useRef(initialCursor);
  const scrollRef = useRef<HTMLUListElement>(null);
  const loadingRef = useRef(false);
  const failedRef = useRef(false);
  const sentinelRef = useRef<HTMLLIElement>(null);

  const loadMore = useCallback(async () => {
    if (
      cursorRef.current === null ||
      loadingRef.current ||
      failedRef.current
    ) {
      return;
    }
    loadingRef.current = true;
    try {
      const page = await trpc.tasks.list.query({
        cursor: cursorRef.current,
        limit: PAGE_SIZE,
      });
      cursorRef.current = page.nextCursor;
      setTasks((prev) => [...prev, ...page.tasks]);
      setCursor(page.nextCursor);
    } catch (err) {
      failedRef.current = true;
      setError(
        err instanceof Error ? err.message : "Could not load more tasks",
      );
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || error) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadMore();
      },
      {
        root: scrollRef.current,
        rootMargin: "200px",
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [error, loadMore]);

  return (
    <>
      <ul
        ref={scrollRef}
        className="max-h-70 w-full max-w-md overflow-y-auto space-y-1"
      >
        {tasks.map((t) => {
          const parsedDate = dateFormatter
            .format(new Date(t.createdAt))
            .replaceAll(",", "");
          return (
            <li
              key={t.id}
              className="list-item"
              onMouseEnter={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                setHoveredTask({
                  task: t,
                  top: bounds.top,
                  left: bounds.left - 8,
                });
              }}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <span className="list-item-icon">📄</span>
              <div className="list-item-content min-w-0 flex-1">
                <div className="list-item-title truncate">{t.title}</div>
                {t.description && (
                  <div
                    className="list-item-description line-clamp-2 wrap-break-word"
                    title={t.description}
                  >
                    {t.description}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex shrink-0 gap-2">
                  <EditBtn
                    taskId={t.id}
                    title={t.title}
                    description={t.description}
                    onChanged={(updatedTask) => {
                      setTasks((currentTasks) =>
                        currentTasks.map((task) =>
                          task.id === updatedTask.id ? updatedTask : task,
                        ),
                      );
                    }}
                  />
                  <DeleteBtn
                    taskId={t.id}
                    onDeleted={(deletedTaskId) => {
                      setTasks((currentTasks) =>
                        currentTasks.filter(
                          (task) => task.id !== deletedTaskId,
                        ),
                      );
                      if (cursorRef.current !== null) {
                        const nextCursor = Math.max(
                          0,
                          cursorRef.current - 1,
                        );
                        cursorRef.current = nextCursor;
                        setCursor(nextCursor);
                      }
                    }}
                  />
                </div>
                <div className="list-item-meta shrink-0 whitespace-nowrap">
                  {parsedDate}
                </div>
              </div>
            </li>
          );
        })}

        {cursor !== null && (
          <li ref={sentinelRef} className="list-item">
            {error ? (
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm text-danger">{error}</span>
                <button
                  className="button"
                  onClick={() => {
                    failedRef.current = false;
                    setError(null);
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <span className="list-item-description">Loading...</span>
            )}
          </li>
        )}
      </ul>

      {hoveredTask && (
        <aside
          className="pointer-events-none fixed z-20 w-56 -translate-x-full border border-line bg-surface p-3 text-left text-sm text-fg shadow-lg"
          style={{ left: hoveredTask.left, top: hoveredTask.top }}
        >
          <div className="mb-2 break-words font-bold text-primary">
            {hoveredTask.task.title}
          </div>
          <div className="break-words text-muted">
            {hoveredTask.task.description || "No description"}
          </div>
        </aside>
      )}
    </>
  );
}
