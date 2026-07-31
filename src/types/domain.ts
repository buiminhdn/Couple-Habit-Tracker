export type PersonSlug = "partner" | "me";

export type Person = {
  id: PersonSlug;
  slug: PersonSlug;
  displayName: string;
  side: "left" | "right";
  themeColor: "lavender" | "rose";
  avatarUrl?: string;
};

export type Habit = {
  id: string;
  personId: PersonSlug;
  title: string;
  isActive: boolean;
  sortOrder: number;
};

export type DailyEntry = {
  id: string;
  personId: PersonSlug;
  habitId: string;
  date: string;
  isDone: boolean;
  title: string;
  sortOrder: number;
};

export type CompletionSummary = {
  total: number;
  done: number;
  percent: number;
  isComplete: boolean;
};

export type Penalty = {
  id: string;
  personId: PersonSlug;
  date: string;
  amount: number;
  reason: "missed_day";
};

export type Payment = {
  id: string;
  personId: PersonSlug;
  amount: number;
  paidAt: string;
  note: string;
};

export type DailySummary = {
  date: string;
  personId: PersonSlug;
  completion: CompletionSummary;
  hasPenalty: boolean;
};
