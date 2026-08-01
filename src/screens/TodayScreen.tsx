import { calculateCompletion } from "../lib/habitLogic";
import type { DailyEntry, MoneySummary, PersonSlug } from "../types/domain";

type EntriesByPerson = Record<PersonSlug, DailyEntry[]>;

type Props = {
  currentIdentity: PersonSlug;
  entriesByPerson: EntriesByPerson;
  moneySummaries: MoneySummary[];
  syncStatus: "loading" | "synced" | "unsynced";
  onToggleEntry(entryId: string, nextDone: boolean): void;
};

const personLabels: Record<PersonSlug, string> = {
  partner: "Người ấy",
  me: "Tôi"
};

const avatars: Record<PersonSlug, string> = {
  partner: "N",
  me: "T"
};

const syncLabels = {
  loading: "Đang đồng bộ",
  synced: "Đã đồng bộ",
  unsynced: "Chưa đồng bộ"
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function PersonPanel({
  personId,
  currentIdentity,
  entries,
  debt,
  onToggleEntry
}: {
  personId: PersonSlug;
  currentIdentity: PersonSlug;
  entries: DailyEntry[];
  debt: number;
  onToggleEntry(entryId: string, nextDone: boolean): void;
}) {
  const completion = calculateCompletion(entries);
  const isEditable = personId === currentIdentity;
  const status = completion.isComplete ? "Xong rồi 🎉" : "Còn thiếu";

  return (
    <section className={`person-panel ${personId}`} aria-label={personLabels[personId]}>
      <h2>{personLabels[personId]}</h2>
      <div className="avatar" aria-hidden="true">
        {avatars[personId]}
      </div>
      <strong className="person-percent">{completion.percent}%</strong>
      <span className={`status-badge${completion.isComplete ? " done" : ""}`}>{status}</span>
      <div className="habit-list">
        {entries.length === 0 ? (
          <p className="empty-state">Chưa có thói quen</p>
        ) : (
          entries.map((entry) => (
            <label key={entry.id} className="habit-row">
              <span>{entry.title}</span>
              <input
                type="checkbox"
                aria-label={entry.title}
                checked={entry.isDone}
                disabled={!isEditable}
                onChange={(event) => onToggleEntry(entry.id, event.currentTarget.checked)}
              />
            </label>
          ))
        )}
      </div>
      <small className="debt-line">Nợ: {formatMoney(debt)}</small>
    </section>
  );
}

export default function TodayScreen({ currentIdentity, entriesByPerson, moneySummaries, syncStatus, onToggleEntry }: Props) {
  const allEntries = [...entriesByPerson.partner, ...entriesByPerson.me];
  const coupleCompletion = calculateCompletion(allEntries);
  const now = new Date();
  const today = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(now);
  const hour = now.getHours();
  const greeting = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <section className="today-screen">
      <header className="hero-header">
        <div>
          <p>Hôm nay</p>
          <h1>{greeting} 💜</h1>
          <span>{today}</span>
        </div>
        <div className={`sync-pill ${syncStatus}`}>
          <span aria-hidden="true" />
          {syncLabels[syncStatus]}
        </div>
      </header>

      <section className="progress-card" aria-label="Tiến độ đôi">
        <div className="progress-title">
          <h2>Tiến độ đôi</h2>
          <strong>{coupleCompletion.percent}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${coupleCompletion.percent}%` }} />
        </div>
        <p>
          {coupleCompletion.done} / {coupleCompletion.total} thói quen đã hoàn thành
        </p>
      </section>

      <div className="mirror-grid">
        {(["partner", "me"] as PersonSlug[]).map((personId) => (
          <PersonPanel
            key={personId}
            personId={personId}
            currentIdentity={currentIdentity}
            entries={entriesByPerson[personId]}
            debt={moneySummaries.find((summary) => summary.personId === personId)?.debt ?? 0}
            onToggleEntry={onToggleEntry}
          />
        ))}
      </div>

      <aside className="penalty-note">
        <strong>Chưa hoàn thành checklist = phạt 20.000đ</strong>
        <span>Mỗi người, mỗi ngày</span>
      </aside>
    </section>
  );
}
