import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TodayScreen from "./TodayScreen";
import type { DailyEntry, MoneySummary } from "../types/domain";

const baseEntry = (personId: "partner" | "me", id: string, title: string, isDone: boolean): DailyEntry => ({
  id,
  personId,
  habitId: `habit-${id}`,
  date: "2026-07-31",
  isDone,
  title,
  sortOrder: 0
});

const money: MoneySummary[] = [
  { personId: "partner", debt: 20000, penalties: [], payments: [] },
  { personId: "me", debt: 40000, penalties: [], payments: [] }
];

describe("TodayScreen", () => {
  it("renders partner left and me right with Vietnamese labels", () => {
    render(
      <TodayScreen
        currentIdentity="me"
        entriesByPerson={{
          partner: [baseEntry("partner", "p1", "Workout", true)],
          me: [baseEntry("me", "m1", "Read", false)]
        }}
        moneySummaries={money}
        syncStatus="synced"
        onToggleEntry={vi.fn()}
      />
    );

    expect(screen.getByText("Người ấy")).toBeInTheDocument();
    expect(screen.getByText("Tôi")).toBeInTheDocument();
    expect(screen.getByText("Chưa hoàn thành checklist = phạt 20.000đ")).toBeInTheDocument();
  });

  it("only allows toggling the current user's checkbox", async () => {
    const onToggleEntry = vi.fn();
    render(
      <TodayScreen
        currentIdentity="me"
        entriesByPerson={{
          partner: [baseEntry("partner", "p1", "Workout", false)],
          me: [baseEntry("me", "m1", "Read", false)]
        }}
        moneySummaries={money}
        syncStatus="synced"
        onToggleEntry={onToggleEntry}
      />
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "Read" }));
    expect(onToggleEntry).toHaveBeenCalledWith("m1", true);
    expect(screen.getByRole("checkbox", { name: "Workout" })).toBeDisabled();
  });
});
