import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HabitsScreen from "./HabitsScreen";

describe("HabitsScreen", () => {
  it("adds a habit for the current user", async () => {
    const onAddHabit = vi.fn();
    render(
      <HabitsScreen
        currentIdentity="me"
        habits={[]}
        onAddHabit={onAddHabit}
        onRenameHabit={vi.fn()}
        onDeactivateHabit={vi.fn()}
        onMoveHabit={vi.fn()}
      />
    );

    await userEvent.type(screen.getByLabelText("Tên thói quen"), "Đọc sách");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));

    expect(onAddHabit).toHaveBeenCalledWith("me", "Đọc sách");
  });
});
