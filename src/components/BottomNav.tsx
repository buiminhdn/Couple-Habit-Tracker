import type { ReactNode } from "react";

export type AppTab = "today" | "history" | "habits" | "money";

const icons: Record<AppTab, ReactNode> = {
  today: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  history: (
    <path d="M12 8v4l3 2m6-2a9 9 0 1 1-3.5-7.1M21 4v4h-4" />
  ),
  habits: (
    <path d="M9 12.5l2 2 4-4.5M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
  ),
  money: (
    <path d="M12 3v18M8.5 8.5a3 3 0 0 1 3-2.5h1a3 3 0 0 1 0 6h-1a3 3 0 0 0 0 6h1a3 3 0 0 0 3-2.5" />
  )
};

const tabs: Array<{ id: AppTab; label: string }> = [
  { id: "today", label: "Hôm nay" },
  { id: "history", label: "Lịch sử" },
  { id: "habits", label: "Thói quen" },
  { id: "money", label: "Tiền phạt" }
];

type Props = {
  activeTab: AppTab;
  onChange(tab: AppTab): void;
};

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={isActive ? "active" : ""}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(tab.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[tab.id]}
            </svg>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
