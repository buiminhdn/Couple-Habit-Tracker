import type { CompletionSummary, DailyEntry, Payment, Penalty } from "../types/domain";

export function calculateCompletion(entries: DailyEntry[]): CompletionSummary {
  const total = entries.length;
  const done = entries.filter((entry) => entry.isDone).length;

  if (total === 0) {
    return { total, done, percent: 100, isComplete: true };
  }

  return {
    total,
    done,
    percent: Math.round((done / total) * 100),
    isComplete: done === total
  };
}

export function shouldCreatePenalty(entries: DailyEntry[]): boolean {
  return entries.length > 0 && !calculateCompletion(entries).isComplete;
}

export function calculateDebt(penalties: Penalty[], payments: Payment[]): number {
  const penaltyTotal = penalties.reduce((sum, penalty) => sum + penalty.amount, 0);
  const paymentTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return Math.max(0, penaltyTotal - paymentTotal);
}
