import { shiftDate } from "./date";
import type { DailyEntry, DailySummary, Habit, MoneySummary, PersonSlug } from "../types/domain";

export const demoHabits: Habit[] = [
  { id: "partner-workout", personId: "partner", title: "Workout", isActive: true, sortOrder: 0 },
  { id: "partner-read", personId: "partner", title: "Read", isActive: true, sortOrder: 1 },
  { id: "partner-sleep", personId: "partner", title: "Sleep before 11:30", isActive: true, sortOrder: 2 },
  { id: "partner-water", personId: "partner", title: "Drink water", isActive: true, sortOrder: 3 },
  { id: "partner-study", personId: "partner", title: "Study", isActive: true, sortOrder: 4 },
  { id: "me-workout", personId: "me", title: "Workout", isActive: true, sortOrder: 0 },
  { id: "me-read", personId: "me", title: "Read", isActive: true, sortOrder: 1 },
  { id: "me-sleep", personId: "me", title: "Sleep before 11:30", isActive: true, sortOrder: 2 },
  { id: "me-water", personId: "me", title: "Drink water", isActive: true, sortOrder: 3 },
  { id: "me-study", personId: "me", title: "Study", isActive: true, sortOrder: 4 }
];

export function makeDemoEntries(date: string): Record<PersonSlug, DailyEntry[]> {
  return {
    partner: demoHabits
      .filter((habit) => habit.personId === "partner")
      .map((habit, index) => ({
        id: `entry-${habit.id}`,
        personId: "partner",
        habitId: habit.id,
        date,
        isDone: index === 0 || index === 3,
        title: habit.title,
        sortOrder: habit.sortOrder
      })),
    me: demoHabits
      .filter((habit) => habit.personId === "me")
      .map((habit, index) => ({
        id: `entry-${habit.id}`,
        personId: "me",
        habitId: habit.id,
        date,
        isDone: index === 1 || index === 3,
        title: habit.title,
        sortOrder: habit.sortOrder
      }))
  };
}

export const demoMoney: MoneySummary[] = [
  { personId: "partner", debt: 20000, penalties: [], payments: [] },
  { personId: "me", debt: 40000, penalties: [], payments: [] }
];

export function makeDemoHistory(date: string): DailySummary[] {
  return ["partner", "me"].flatMap((personId) =>
    Array.from({ length: 7 }, (_, index) => ({
      date: shiftDate(date, -index),
      personId: personId as PersonSlug,
      completion: {
        total: 5,
        done: Math.max(0, 5 - index),
        percent: Math.max(0, 100 - index * 20),
        isComplete: index === 0
      },
      hasPenalty: index > 2
    }))
  );
}
