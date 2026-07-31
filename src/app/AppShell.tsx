"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav, { type AppTab } from "../components/BottomNav";
import IdentitySetup from "../components/IdentitySetup";
import { todayInVietnam } from "../lib/date";
import { demoHabits, demoMoney, makeDemoEntries, makeDemoHistory } from "../lib/demoData";
import { getStoredIdentity, setStoredIdentity } from "../lib/identity";
import { createHabitService } from "../services/habitService";
import HabitsScreen from "../screens/HabitsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import MoneyScreen from "../screens/MoneyScreen";
import TodayScreen from "../screens/TodayScreen";
import type { DailyEntry, DailySummary, Habit, MoneySummary, PersonSlug } from "../types/domain";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<AppTab>("today");
  const [identity, setIdentity] = useState<PersonSlug | null>(null);
  const [isIdentityLoaded, setIsIdentityLoaded] = useState(false);
  const [entriesByPerson, setEntriesByPerson] = useState(() => makeDemoEntries(todayInVietnam()));
  const [habits, setHabits] = useState<Habit[]>(demoHabits);
  const [history, setHistory] = useState<DailySummary[]>(() => makeDemoHistory(todayInVietnam()));
  const [money, setMoney] = useState<MoneySummary[]>(demoMoney);
  const [syncStatus, setSyncStatus] = useState<"loading" | "synced" | "unsynced">("unsynced");
  const today = useMemo(() => todayInVietnam(), []);
  const service = useMemo(() => createHabitService(), []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    setIdentity(getStoredIdentity());
    setIsIdentityLoaded(true);
  }, []);

  useEffect(() => {
    if (!identity) return;
    const currentIdentity = identity;
    let isCancelled = false;

    async function loadData() {
      setSyncStatus("loading");
      try {
        await service.closePastDays(today);
        const [entries, currentHabits, summaries, moneySummaries] = await Promise.all([
          service.ensureTodayChecklist(today),
          service.listHabits(currentIdentity),
          service.listSevenDayHistory(today),
          service.listMoneySummary()
        ]);
        if (isCancelled) return;
        setEntriesByPerson({
          partner: entries.filter((entry) => entry.personId === "partner"),
          me: entries.filter((entry) => entry.personId === "me")
        });
        setHabits(currentHabits);
        setHistory(summaries);
        setMoney(moneySummaries);
        setSyncStatus("synced");
      } catch {
        if (!isCancelled) setSyncStatus("unsynced");
      }
    }

    void loadData();
    return () => {
      isCancelled = true;
    };
  }, [identity, service, today]);

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

  async function handleToggleEntry(entryId: string, nextDone: boolean) {
    setEntriesByPerson((current) => ({
      partner: current.partner.map((entry) => (entry.id === entryId ? { ...entry, isDone: nextDone } : entry)),
      me: current.me.map((entry) => (entry.id === entryId ? { ...entry, isDone: nextDone } : entry))
    }));
    try {
      await service.toggleEntry(entryId, nextDone);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("unsynced");
    }
  }

  async function handleAddHabit(personId: PersonSlug, title: string) {
    const optimistic: Habit = { id: `local-${Date.now()}`, personId, title, isActive: true, sortOrder: habits.length };
    setHabits((current) => [...current, optimistic]);
    try {
      const created = await service.addHabit(personId, title);
      setHabits((current) => current.map((habit) => (habit.id === optimistic.id ? created : habit)));
      setSyncStatus("synced");
    } catch {
      setSyncStatus("unsynced");
    }
  }

  function handleRenameHabit(habitId: string, title: string) {
    setHabits((current) => current.map((habit) => (habit.id === habitId ? { ...habit, title } : habit)));
    void service.renameHabit(habitId, title).catch(() => setSyncStatus("unsynced"));
  }

  function handleDeactivateHabit(habitId: string) {
    setHabits((current) => current.filter((habit) => habit.id !== habitId));
    void service.deactivateHabit(habitId).catch(() => setSyncStatus("unsynced"));
  }

  function handleMoveHabit(habitId: string, sortOrder: number) {
    setHabits((current) =>
      current
        .map((habit) => (habit.id === habitId ? { ...habit, sortOrder } : habit))
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    void service.moveHabit(habitId, sortOrder).catch(() => setSyncStatus("unsynced"));
  }

  async function handleRecordPayment(personId: PersonSlug, amount: number, note: string) {
    setMoney((current) =>
      current.map((summary) => (summary.personId === personId ? { ...summary, debt: Math.max(0, summary.debt - amount) } : summary))
    );
    try {
      await service.recordPayment(personId, amount, note);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("unsynced");
    }
  }

  return (
    <main className="app-shell">
      {activeTab === "today" && (
        <TodayScreen
          currentIdentity={identity}
          entriesByPerson={entriesByPerson}
          moneySummaries={money}
          syncStatus={syncStatus}
          onToggleEntry={handleToggleEntry}
        />
      )}
      {activeTab === "history" && <HistoryScreen summaries={history} />}
      {activeTab === "habits" && (
        <HabitsScreen
          currentIdentity={identity}
          habits={habits}
          onAddHabit={handleAddHabit}
          onRenameHabit={handleRenameHabit}
          onDeactivateHabit={handleDeactivateHabit}
          onMoveHabit={handleMoveHabit}
        />
      )}
      {activeTab === "money" && <MoneyScreen summaries={money} onRecordPayment={handleRecordPayment} />}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
