import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TaskForm from "./task-form";

const { refresh, mutate } = vi.hoisted(() => ({
  refresh: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: { tasks: { create: { mutate } } },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

function fields() {
  return {
    title: screen.getByRole("textbox", { name: "Title" }),
    description: screen.getByRole("textbox", { name: "Description" }),
    save: screen.getByRole("button", { name: "Save" }),
  };
}

describe("Add a Task", () => {
  it("creates the task, clears the inputs and refreshes", async () => {
    mutate.mockResolvedValue({});
    render(<TaskForm />);
    const { title, description, save } = fields();

    await userEvent.type(title, "Buy milk");
    await userEvent.type(description, "2 liters");
    await userEvent.click(save);

    expect(mutate).toHaveBeenCalledWith({
      title: "Buy milk",
      description: "2 liters",
    });
    expect(title).toHaveValue("");
    expect(description).toHaveValue("");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("allows an empty description", async () => {
    mutate.mockResolvedValue({});
    render(<TaskForm />);
    const { title, save } = fields();

    await userEvent.type(title, "Only a title");
    await userEvent.click(save);

    expect(mutate).toHaveBeenCalledWith({
      title: "Only a title",
      description: "",
    });
  });

  it("does nothing when the title is empty or only whitespace", async () => {
    render(<TaskForm />);
    const { title, save } = fields();

    await userEvent.click(save);
    await userEvent.type(title, "   ");
    await userEvent.click(save);

    expect(mutate).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("shows the error and keeps what the user typed when creating fails", async () => {
    mutate.mockRejectedValue(new Error("Could not create task"));
    render(<TaskForm />);
    const { title, description, save } = fields();

    await userEvent.type(title, "Buy milk");
    await userEvent.type(description, "2 liters");
    await userEvent.click(save);

    expect(
      await screen.findByText("Could not create task"),
    ).toBeInTheDocument();
    expect(title).toHaveValue("Buy milk");
    expect(description).toHaveValue("2 liters");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("clears an old error after a successful retry", async () => {
    mutate.mockRejectedValueOnce(new Error("Could not create task"));
    mutate.mockResolvedValueOnce({});
    render(<TaskForm />);
    const { title, save } = fields();

    await userEvent.type(title, "Buy milk");
    await userEvent.click(save);
    expect(
      await screen.findByText("Could not create task"),
    ).toBeInTheDocument();

    await userEvent.click(save);

    expect(screen.queryByText("Could not create task")).not.toBeInTheDocument();
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
