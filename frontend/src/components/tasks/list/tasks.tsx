import { trpc } from "@/lib/trpc";
import DeleteBtn from "../delete/task-delete";
import EditBtn from "../edit/task-edit";

export default async function Tasks() {
  const tasks = await trpc.tasks.list.query();
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <ul className="w-full max-w-md space-y-1">
      {tasks.map((t) => {
        const rawDate = new Date(t.createdAt);
        const parsedDate = dateFormatter.format(rawDate).replaceAll(",", "");
        return (
          <li key={t.id} className="list-item">
            <span className="list-item-icon">📄</span>
            <div className="list-item-content min-w-0 flex-1">
              <div className="list-item-title truncate">{t.title}</div>
              {t.description && (
                <div
                  className="list-item-description line-clamp-2 wrap-break-words"
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
                />
                <DeleteBtn taskId={t.id} />
              </div>
              <div className="list-item-meta shrink-0 whitespace-nowrap">
                {parsedDate}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
