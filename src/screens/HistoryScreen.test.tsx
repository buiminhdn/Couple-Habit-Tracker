import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryScreen from "./HistoryScreen";

describe("HistoryScreen", () => {
  it("shows seven-day completion summaries", () => {
    render(
      <HistoryScreen
        summaries={[
          {
            date: "2026-07-31",
            personId: "me",
            completion: { total: 5, done: 4, percent: 80, isComplete: false },
            hasPenalty: true
          }
        ]}
      />
    );

    expect(screen.getByText("Lịch sử 7 ngày")).toBeInTheDocument();
    expect(screen.getByText("4/5 thói quen")).toBeInTheDocument();
    expect(screen.getByText("Đã phạt")).toBeInTheDocument();
  });
});
