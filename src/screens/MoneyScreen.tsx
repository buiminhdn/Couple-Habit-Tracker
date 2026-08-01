import { personNames as labels } from "../lib/people";
import type { MoneySummary, PersonSlug } from "../types/domain";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function MoneyScreen({
  summaries,
  onRecordPayment
}: {
  summaries: MoneySummary[];
  onRecordPayment(personId: PersonSlug, amount: number, note: string): void;
}) {
  return (
    <section className="tool-screen">
      <h1>Tiền phạt</h1>
      <div className="money-grid">
        {summaries.map((summary) => (
          <article key={summary.personId} className={`money-card ${summary.personId}`}>
            <span>{labels[summary.personId]}</span>
            <strong>{formatMoney(summary.debt)}</strong>
            <button
              type="button"
              disabled={summary.debt <= 0}
              onClick={() => onRecordPayment(summary.personId, summary.debt, "")}
            >
              {labels[summary.personId]} đã đóng phạt
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
