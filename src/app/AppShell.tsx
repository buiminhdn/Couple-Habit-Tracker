"use client";

import { useEffect, useMemo, useState } from "react";
import IdentitySetup from "../components/IdentitySetup";
import { getStoredIdentity, setStoredIdentity } from "../lib/identity";
import type { PersonSlug } from "../types/domain";

type Tab = "today" | "history" | "habits" | "money";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "today", label: "Hôm nay" },
  { id: "history", label: "Lịch sử" },
  { id: "habits", label: "Thói quen" },
  { id: "money", label: "Tiền phạt" }
];

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [identity, setIdentity] = useState<PersonSlug | null>(null);
  const [isIdentityLoaded, setIsIdentityLoaded] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    setIdentity(getStoredIdentity());
    setIsIdentityLoaded(true);
  }, []);

  const activeLabel = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? "Hôm nay",
    [activeTab]
  );

  function handleIdentitySelect(nextIdentity: PersonSlug) {
    setStoredIdentity(nextIdentity);
    setIdentity(nextIdentity);
  }

  if (!isIdentityLoaded) {
    return <main className="app-shell" />;
  }

  if (!identity) {
    return <IdentitySetup onSelect={handleIdentitySelect} />;
  }

  return (
    <main className="app-shell">
      <section className="starter-screen">
        <h1>Couple Habit</h1>
        <p>{activeLabel}</p>
      </section>
      <nav className="bottom-nav" aria-label="Điều hướng chính">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </main>
  );
}
