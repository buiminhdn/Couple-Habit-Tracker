import { describe, expect, it, vi } from "vitest";
import { createHabitService } from "./habitService";

describe("createHabitService", () => {
  it("returns the expected service functions", () => {
    const service = createHabitService();

    expect(Object.keys(service).sort()).toEqual([
      "addHabit",
      "closePastDays",
      "deactivateHabit",
      "ensureTodayChecklist",
      "listHabits",
      "listMoneySummary",
      "listPeople",
      "listSevenDayHistory",
      "moveHabit",
      "recordPayment",
      "renameHabit",
      "toggleEntry"
    ]);
  });

  it("toggleEntry posts the matching daily entry update", async () => {
    const fetcher = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as Response));
    const service = createHabitService(fetcher as never);

    await service.toggleEntry("entry-1", true);

    expect(fetcher).toHaveBeenCalledWith(
      "/api/habits",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ action: "toggleEntry", entryId: "entry-1", isDone: true })
      })
    );
  });

  it("throws when the API returns an error", async () => {
    const fetcher = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) } as Response));
    const service = createHabitService(fetcher as never);

    await expect(service.listPeople()).rejects.toThrow("Google Sheets sync failed.");
  });
});
