import { personNames } from "../lib/people";
import type { PersonSlug } from "../types/domain";

type Props = {
  onSelect(identity: PersonSlug): void;
};

export default function IdentitySetup({ onSelect }: Props) {
  return (
    <main className="identity-screen">
      <section className="identity-card">
        <p className="eyebrow">Couple Habit</p>
        <h1>Ai đang dùng máy này?</h1>
        <div className="identity-actions">
          <button type="button" onClick={() => onSelect("partner")}>
            {personNames.partner}
          </button>
          <button type="button" onClick={() => onSelect("me")}>
            {personNames.me}
          </button>
        </div>
      </section>
    </main>
  );
}
