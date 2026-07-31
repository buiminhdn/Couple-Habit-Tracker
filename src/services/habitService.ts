import type { DailyEntry, DailySummary, Habit, MoneySummary, Person, PersonSlug } from "../types/domain";

export type HabitService = {
  listPeople(): Promise<Person[]>;
  ensureTodayChecklist(date: string): Promise<DailyEntry[]>;
  toggleEntry(entryId: string, isDone: boolean): Promise<void>;
  listSevenDayHistory(today: string): Promise<DailySummary[]>;
  listMoneySummary(): Promise<MoneySummary[]>;
  recordPayment(personId: PersonSlug, amount: number, note: string): Promise<void>;
  closePastDays(today: string): Promise<void>;
  listHabits(personId: PersonSlug): Promise<Habit[]>;
  addHabit(personId: PersonSlug, title: string): Promise<Habit>;
  renameHabit(habitId: string, title: string): Promise<void>;
  deactivateHabit(habitId: string): Promise<void>;
  moveHabit(habitId: string, sortOrder: number): Promise<void>;
};

async function requestJson<T>(fetcher: typeof fetch, payload: Record<string, unknown>): Promise<T> {
  const response = await fetcher("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Google Sheets sync failed.");
  }

  return response.json() as Promise<T>;
}

export function createHabitService(fetcher: typeof fetch = fetch): HabitService {
  return {
    listPeople() {
      return requestJson<Person[]>(fetcher, { action: "listPeople" });
    },
    ensureTodayChecklist(date) {
      return requestJson<DailyEntry[]>(fetcher, { action: "ensureTodayChecklist", date });
    },
    async toggleEntry(entryId, isDone) {
      await requestJson<void>(fetcher, { action: "toggleEntry", entryId, isDone });
    },
    listSevenDayHistory(today) {
      return requestJson<DailySummary[]>(fetcher, { action: "listSevenDayHistory", today });
    },
    listMoneySummary() {
      return requestJson<MoneySummary[]>(fetcher, { action: "listMoneySummary" });
    },
    async recordPayment(personId, amount, note) {
      await requestJson<void>(fetcher, { action: "recordPayment", personId, amount, note });
    },
    async closePastDays(today) {
      await requestJson<void>(fetcher, { action: "closePastDays", today });
    },
    listHabits(personId) {
      return requestJson<Habit[]>(fetcher, { action: "listHabits", personId });
    },
    addHabit(personId, title) {
      return requestJson<Habit>(fetcher, { action: "addHabit", personId, title });
    },
    async renameHabit(habitId, title) {
      await requestJson<void>(fetcher, { action: "renameHabit", habitId, title });
    },
    async deactivateHabit(habitId) {
      await requestJson<void>(fetcher, { action: "deactivateHabit", habitId });
    },
    async moveHabit(habitId, sortOrder) {
      await requestJson<void>(fetcher, { action: "moveHabit", habitId, sortOrder });
    }
  };
}
