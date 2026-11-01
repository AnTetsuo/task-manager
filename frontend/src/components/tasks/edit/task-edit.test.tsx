import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditBtn from "./task-edit";

const { refresh, mutate } = vi.hoisted(() => ({
  refresh: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: { tasks: { update: { mutate } } },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

function setup() {
  render(<EditBtn taskId={1} title="old title" description="old desc" />);
  const dialog = document.querySelector("dialog")!;
  return { dialog };
}

describe("Edit a Task", () => {
  it("keeps the dialog closed until Edit is clicked", async () => {
    const { dialog } = setup();
    expect(dialog).not.toHaveAttribute("open");

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(dialog).toHaveAttribute("open");
  });

  it("prefills the form with the task values", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByDisplayValue("old title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("old desc")).toBeInTheDocument();
  });

  it("sends the edited values, closes the dialog and refreshes", async () => {
    mutate.mockResolvedValue({});
    const { dialog } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    const title = screen.getByDisplayValue("old title");
    await userEvent.clear(title);
    await userEvent.type(title, "new title");
    const description = screen.getByDisplayValue("old desc");
    await userEvent.clear(description);
    await userEvent.type(description, "new desc");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    expect(mutate).toHaveBeenCalledWith({
      id: 1,
      title: "new title",
      description: "new desc",
    });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("does not submit when the title is empty", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    await userEvent.clear(screen.getByDisplayValue("old title"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows the error and keeps the dialog open when the update fails", async () => {
    mutate.mockRejectedValue(new Error("Task 1 not found"));
    const { dialog } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Task 1 not found")).toBeInTheDocument();
    expect(dialog).toHaveAttribute("open");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("re-enables Save after a failed update", async () => {
    mutate.mockRejectedValue(new Error("nope"));
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    const save = screen.getByRole("button", { name: "Save" });

    await userEvent.click(save);

    await waitFor(() => expect(save).toBeEnabled());
  });

  it("closes the dialog on Cancel without saving", async () => {
    const { dialog } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(dialog).not.toHaveAttribute("open");
    expect(mutate).not.toHaveBeenCalled();
  });
});
