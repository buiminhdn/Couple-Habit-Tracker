import type { DailySummary } from "../types/domain";

const labels = { partner: "Người ấy", me: "Tôi" };

export default function HistoryScreen({ summaries }: { summaries: DailySummary[] }) {
  return (
    <section className="tool-screen">
      <h1>Lịch sử 7 ngày</h1>
      <div className="history-list">
        {summaries.map((summary) => (
          <article key={`${summary.date}-${summary.personId}`} className="history-row">
            <div>
              <strong>{summary.date}</strong>
              <span>{labels[summary.personId]}</span>
            </div>
            <span>{summary.completion.done}/{summary.completion.total} thói quen</span>
            <em>{summary.hasPenalty ? "Đã phạt" : summary.completion.isComplete ? "Hoàn thành" : "Đang theo dõi"}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
