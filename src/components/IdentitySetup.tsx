import type { PersonSlug } from "../types/domain";

type Props = {
  onSelect(identity: PersonSlug): void;
};

export default function IdentitySetup({ onSelect }: Props) {
  return (
    <main className="identity-screen">
      <section className="identity-card">
        <p className="eyebrow">Couple Habit</p>
        <h1>Máy này là của ai?</h1>
        <div className="identity-actions">
          <button type="button" onClick={() => onSelect("partner")}>
            Người ấy
          </button>
          <button type="button" onClick={() => onSelect("me")}>
            Tôi
          </button>
        </div>
      </section>
    </main>
  );
}
