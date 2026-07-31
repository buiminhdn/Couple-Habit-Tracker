export type AppTab = "today" | "history" | "habits" | "money";

const tabs: Array<{ id: AppTab; label: string; icon: string }> = [
  { id: "today", label: "Hôm nay", icon: "☼" },
  { id: "history", label: "Lịch sử", icon: "◷" },
  { id: "habits", label: "Thói quen", icon: "☑" },
  { id: "money", label: "Tiền phạt", icon: "▣" }
];

type Props = {
  activeTab: AppTab;
  onChange(tab: AppTab): void;
};

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? "active" : ""}
          onClick={() => onChange(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
