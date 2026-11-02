import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeleteBtn from "./task-delete";

const { onDeleted, mutate } = vi.hoisted(() => ({
  onDeleted: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: { tasks: { delete: { mutate } } },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Delete a Task", () => {
  it("deletes the task by id and reports the deleted task", async () => {
    mutate.mockResolvedValue(undefined);
    render(<DeleteBtn taskId={5} onDeleted={onDeleted} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mutate).toHaveBeenCalledWith(5);
    expect(onDeleted).toHaveBeenCalledWith(5);
  });

  it("shows the error and does not report deletion when the delete fails", async () => {
    mutate.mockRejectedValue(new Error("Task 5 not found"));
    render(<DeleteBtn taskId={5} onDeleted={onDeleted} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Task 5 not found")).toBeInTheDocument();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("falls back to a generic message for non-Error rejections", async () => {
    mutate.mockRejectedValue("boom");
    render(<DeleteBtn taskId={5} onDeleted={onDeleted} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("disables the button while the request is in flight", async () => {
    let finish!: () => void;
    mutate.mockReturnValue(new Promise<void>((resolve) => (finish = resolve)));
    render(<DeleteBtn taskId={5} onDeleted={onDeleted} />);
    const button = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(button);
    expect(button).toBeDisabled();

    // A second click while pending must not send a second request
    await userEvent.click(button);
    expect(mutate).toHaveBeenCalledTimes(1);

    finish();
    await waitFor(() => expect(button).toBeEnabled());
  });

  it("re-enables the button after a failure", async () => {
    mutate.mockRejectedValue(new Error("nope"));
    render(<DeleteBtn taskId={5} onDeleted={onDeleted} />);
    const button = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
  });
});
