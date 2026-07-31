import { useState } from "react";
import type { Habit, PersonSlug } from "../types/domain";

type Props = {
  currentIdentity: PersonSlug;
  habits: Habit[];
  onAddHabit(personId: PersonSlug, title: string): void;
  onRenameHabit(habitId: string, title: string): void;
  onDeactivateHabit(habitId: string): void;
  onMoveHabit(habitId: string, sortOrder: number): void;
};

export default function HabitsScreen({ currentIdentity, habits, onAddHabit, onRenameHabit, onDeactivateHabit, onMoveHabit }: Props) {
  const [title, setTitle] = useState("");

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddHabit(currentIdentity, trimmed);
    setTitle("");
  }

  return (
    <section className="tool-screen">
      <h1>Thói quen của tôi</h1>
      <div className="inline-form">
        <label>
          <span>Tên thói quen</span>
          <input value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
        </label>
        <button type="button" onClick={submit}>
          Thêm
        </button>
      </div>
      <div className="manage-list">
        {habits.map((habit, index) => (
          <article key={habit.id} className="manage-row">
            <input value={habit.title} onChange={(event) => onRenameHabit(habit.id, event.currentTarget.value)} />
            <button type="button" aria-label={`Đưa ${habit.title} lên`} onClick={() => onMoveHabit(habit.id, Math.max(0, index - 1))}>
              ↑
            </button>
            <button type="button" aria-label={`Đưa ${habit.title} xuống`} onClick={() => onMoveHabit(habit.id, index + 1)}>
              ↓
            </button>
            <button type="button" onClick={() => onDeactivateHabit(habit.id)}>
              Tắt
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
