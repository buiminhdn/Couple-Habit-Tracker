# Couple Habit PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private, mobile-first PWA for two people to track separate daily habit checklists, sync through Supabase, and calculate 20,000 VND penalties for missed days.

**Architecture:** Use a Next.js App Router TypeScript app with a client-side PWA shell for the private habit workflow, SEO-ready metadata, isolated domain logic, and a Supabase service layer. Store the local device identity in `localStorage`, keep Supabase database access out of UI components, and make penalty/checklist operations idempotent. The first implementation should run locally with seeded demo data and real Supabase wiring through environment variables.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, Supabase JS, manual web app manifest and service worker, global CSS, Google Sans Flex font family with system fallbacks.

## Global Constraints

- The app is designed for exactly two people.
- No login or user registration in the MVP.
- UI text should be Vietnamese by default.
- The first app launch asks the user to choose identity: `Tôi` or `Người ấy`.
- A day closes at 23:59 in the `Asia/Ho_Chi_Minh` timezone.
- Penalty amount is fixed at 20,000 VND per person per missed day.
- History shows the last 7 days.
- The `Today` screen uses mirrored panels: `Người ấy` on the left and `Tôi` on the right.
- Each person can only tick and manage their own habits.
- Data sync uses Supabase.
- Visual direction follows the approved mockup: dark calm header, light background, white progress card, lavender partner side, rose me side, large checkboxes, bottom nav.

---

## File Structure

- `package.json`: scripts and dependencies.
- `next.config.mjs`: Next.js configuration.
- `vitest.config.ts`: Vitest configuration for React Testing Library.
- `tsconfig.json`: TypeScript configuration.
- `src/app/layout.tsx`: root HTML shell, SEO metadata, viewport, and global CSS import.
- `src/app/manifest.ts`: PWA web app manifest.
- `src/app/page.tsx`: server entry that renders the client app shell.
- `src/app/AppShell.tsx`: client-side tab shell and identity gate.
- `src/app/globals.css`: global mobile-first visual system.
- `public/sw.js`: lightweight service worker for app shell caching.
- `src/types/domain.ts`: shared domain types.
- `src/lib/date.ts`: timezone-safe date helpers.
- `src/lib/identity.ts`: local identity persistence.
- `src/lib/habitLogic.ts`: pure checklist, penalty, progress, and debt calculations.
- `src/lib/supabaseClient.ts`: Supabase client creation.
- `src/services/habitService.ts`: Supabase read/write service functions.
- `src/components/IdentitySetup.tsx`: first-launch identity selection.
- `src/components/BottomNav.tsx`: fixed bottom navigation.
- `src/screens/TodayScreen.tsx`: mirrored daily checklist UI.
- `src/screens/HistoryScreen.tsx`: 7-day accountability history.
- `src/screens/HabitsScreen.tsx`: current user's habit management.
- `src/screens/MoneyScreen.tsx`: debt, penalties, and payment recording.
- `src/test/setup.ts`: Testing Library matcher setup.
- `src/test/testData.ts`: fixtures used by unit and UI tests.
- `src/**/*.test.ts`, `src/**/*.test.tsx`: tests beside implementation files.
- `supabase/schema.sql`: database schema, uniqueness constraints, and seed rows.
- `.env.example`: required Supabase environment variables.

---

### Task 1: Scaffold Next.js PWA Foundation

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/manifest.ts`
- Create: `src/app/page.tsx`
- Create: `src/app/AppShell.tsx`
- Create: `src/app/globals.css`
- Create: `public/sw.js`
- Create: `src/test/setup.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: `AppShell` client component with tab state and starter screens.
- Produces: npm scripts `dev`, `build`, `test`, and `start`.
- Produces: SEO-ready root metadata, PWA manifest, and service worker registration.

- [ ] **Step 1: Create project configuration**

Create `package.json` with these scripts and dependencies:

```json
{
  "name": "couple-habit-pwa",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "build": "next build",
    "start": "next start -H 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "next": "^16.2.12",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "jsdom": "^24.1.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create Next.js and Vitest config**

Create `next.config.mjs`:

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false
};

export default nextConfig;
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  }
});
```

- [ ] **Step 3: Create TypeScript configs**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create app router files**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Couple Habit",
    template: "%s | Couple Habit"
  },
  description: "Theo dõi thói quen hằng ngày cho hai người.",
  applicationName: "Couple Habit",
  appleWebApp: {
    capable: true,
    title: "Couple Habit",
    statusBarStyle: "black-translucent"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#201f3b"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Couple Habit",
    short_name: "Habits",
    description: "Theo dõi thói quen hằng ngày cho hai người.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9ff",
    theme_color: "#201f3b",
    icons: []
  };
}
```

Create `src/app/page.tsx`:

```tsx
import AppShell from "./AppShell";

export default function Page() {
  return <AppShell />;
}
```

Create `src/app/AppShell.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type Tab = "today" | "history" | "habits" | "money";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "today", label: "Hom nay" },
  { id: "history", label: "Lich su" },
  { id: "habits", label: "Thoi quen" },
  { id: "money", label: "Tien phat" }
];

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app remains usable if service worker registration fails.
      });
    }
  }, []);

  return (
    <main className="app-shell">
      <section className="starter-screen">
        <h1>Couple Habit</h1>
        <p>{tabs.find((tab) => tab.id === activeTab)?.label}</p>
      </section>
      <nav className="bottom-nav" aria-label="Dieu huong chinh">
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
```

- [ ] **Step 5: Add starter global CSS**

Create `src/app/globals.css`:

```css
:root {
  color: #262534;
  background: #fbf9ff;
  font-family: "Google Sans Flex", "Google Sans", Inter, system-ui, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #fbf9ff;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding-bottom: 76px;
}

.starter-screen {
  min-height: calc(100vh - 76px);
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid #e8e4ef;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
}

.bottom-nav button {
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #7b7986;
}

.bottom-nav button.active {
  color: #8a5cf6;
  background: #f2ecff;
}
```

- [ ] **Step 6: Add service worker, test setup, and environment example**

Create `public/sw.js`:

```js
const CACHE_NAME = "couple-habit-shell-v1";
const APP_SHELL = ["/"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 7: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and install completes with no dependency resolution errors.

- [ ] **Step 8: Verify scaffold**

Run:

```bash
npm run build
npm test
```

Expected: build succeeds; tests report no test files or pass if Vitest exits successfully.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json next.config.mjs vitest.config.ts tsconfig.json src/app/layout.tsx src/app/manifest.ts src/app/page.tsx src/app/AppShell.tsx src/app/globals.css public/sw.js src/test/setup.ts .env.example
git commit -m "feat: scaffold Next.js PWA"
```

---

### Task 2: Add Domain Types and Pure Habit Logic

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/lib/date.ts`
- Create: `src/lib/habitLogic.ts`
- Create: `src/lib/habitLogic.test.ts`

**Interfaces:**
- Produces: `PersonSlug`, `Habit`, `DailyEntry`, `Penalty`, `Payment`, `DailySummary`.
- Produces: `todayInVietnam(now?: Date): string`.
- Produces: `calculateCompletion(entries: DailyEntry[]): CompletionSummary`.
- Produces: `shouldCreatePenalty(entries: DailyEntry[]): boolean`.
- Produces: `calculateDebt(penalties: Penalty[], payments: Payment[]): number`.

- [ ] **Step 1: Write failing unit tests**

Create `src/lib/habitLogic.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  calculateCompletion,
  calculateDebt,
  shouldCreatePenalty
} from "./habitLogic";
import type { DailyEntry, Payment, Penalty } from "../types/domain";

const entries = (doneStates: boolean[]): DailyEntry[] =>
  doneStates.map((isDone, index) => ({
    id: `entry-${index}`,
    personId: "me",
    habitId: `habit-${index}`,
    date: "2026-07-31",
    isDone,
    title: `Habit ${index + 1}`,
    sortOrder: index
  }));

describe("habitLogic", () => {
  it("calculates completion count and percent", () => {
    expect(calculateCompletion(entries([true, false, true]))).toEqual({
      total: 3,
      done: 2,
      percent: 67,
      isComplete: false
    });
  });

  it("treats an empty checklist as complete and not punishable", () => {
    expect(calculateCompletion([])).toEqual({
      total: 0,
      done: 0,
      percent: 100,
      isComplete: true
    });
    expect(shouldCreatePenalty([])).toBe(false);
  });

  it("creates a penalty only when at least one entry is incomplete", () => {
    expect(shouldCreatePenalty(entries([true, true]))).toBe(false);
    expect(shouldCreatePenalty(entries([true, false]))).toBe(true);
  });

  it("calculates debt from penalties minus payments without going below zero", () => {
    const penalties: Penalty[] = [
      { id: "p1", personId: "me", date: "2026-07-30", amount: 20000, reason: "missed_day" },
      { id: "p2", personId: "me", date: "2026-07-31", amount: 20000, reason: "missed_day" }
    ];
    const payments: Payment[] = [
      { id: "pay1", personId: "me", amount: 15000, paidAt: "2026-08-01T08:00:00.000Z", note: "" }
    ];

    expect(calculateDebt(penalties, payments)).toBe(25000);
    expect(calculateDebt(penalties, [{ ...payments[0], amount: 80000 }])).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/lib/habitLogic.test.ts
```

Expected: FAIL because `src/lib/habitLogic.ts` and `src/types/domain.ts` do not exist.

- [ ] **Step 3: Add domain types**

Create `src/types/domain.ts`:

```ts
export type PersonSlug = "partner" | "me";

export type Person = {
  id: PersonSlug;
  slug: PersonSlug;
  displayName: string;
  side: "left" | "right";
  themeColor: "lavender" | "rose";
  avatarUrl?: string;
};

export type Habit = {
  id: string;
  personId: PersonSlug;
  title: string;
  isActive: boolean;
  sortOrder: number;
};

export type DailyEntry = {
  id: string;
  personId: PersonSlug;
  habitId: string;
  date: string;
  isDone: boolean;
  title: string;
  sortOrder: number;
};

export type CompletionSummary = {
  total: number;
  done: number;
  percent: number;
  isComplete: boolean;
};

export type Penalty = {
  id: string;
  personId: PersonSlug;
  date: string;
  amount: number;
  reason: "missed_day";
};

export type Payment = {
  id: string;
  personId: PersonSlug;
  amount: number;
  paidAt: string;
  note: string;
};

export type DailySummary = {
  date: string;
  personId: PersonSlug;
  completion: CompletionSummary;
  hasPenalty: boolean;
};
```

- [ ] **Step 4: Add date helper**

Create `src/lib/date.ts`:

```ts
const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export function todayInVietnam(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}
```

- [ ] **Step 5: Add pure habit logic**

Create `src/lib/habitLogic.ts`:

```ts
import type { CompletionSummary, DailyEntry, Payment, Penalty } from "../types/domain";

export function calculateCompletion(entries: DailyEntry[]): CompletionSummary {
  const total = entries.length;
  const done = entries.filter((entry) => entry.isDone).length;

  if (total === 0) {
    return { total, done, percent: 100, isComplete: true };
  }

  return {
    total,
    done,
    percent: Math.round((done / total) * 100),
    isComplete: done === total
  };
}

export function shouldCreatePenalty(entries: DailyEntry[]): boolean {
  if (entries.length === 0) {
    return false;
  }

  return !calculateCompletion(entries).isComplete;
}

export function calculateDebt(penalties: Penalty[], payments: Payment[]): number {
  const penaltyTotal = penalties.reduce((sum, penalty) => sum + penalty.amount, 0);
  const paymentTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return Math.max(0, penaltyTotal - paymentTotal);
}
```

- [ ] **Step 6: Run tests to verify pass**

Run:

```bash
npm test -- src/lib/habitLogic.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/types/domain.ts src/lib/date.ts src/lib/habitLogic.ts src/lib/habitLogic.test.ts
git commit -m "feat: add habit domain logic"
```

---

### Task 3: Add Supabase Schema and Client Boundary

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabaseClient.ts`
- Create: `src/services/habitService.ts`
- Create: `src/services/habitService.test.ts`

**Interfaces:**
- Produces: `createHabitService(client: SupabaseClient): HabitService`.
- Produces: `HabitService` methods `listPeople`, `ensureTodayChecklist`, `toggleEntry`, `listSevenDayHistory`, `listMoneySummary`, `recordPayment`.

- [ ] **Step 1: Write service shape test**

Create `src/services/habitService.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createHabitService } from "./habitService";

describe("createHabitService", () => {
  it("returns the expected service functions", () => {
    const service = createHabitService({} as never);

    expect(Object.keys(service).sort()).toEqual([
      "ensureTodayChecklist",
      "listMoneySummary",
      "listPeople",
      "listSevenDayHistory",
      "recordPayment",
      "toggleEntry"
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- src/services/habitService.test.ts
```

Expected: FAIL because `habitService.ts` does not exist.

- [ ] **Step 3: Create Supabase schema**

Create `supabase/schema.sql`:

```sql
create table if not exists people (
  id text primary key,
  slug text not null unique check (slug in ('partner', 'me')),
  display_name text not null,
  side text not null check (side in ('left', 'right')),
  theme_color text not null check (theme_color in ('lavender', 'rose')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  title text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_entries (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  date date not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_id, habit_id, date)
);

create table if not exists daily_closures (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  date date not null,
  is_complete boolean not null,
  closed_at timestamptz not null default now(),
  unique (person_id, date)
);

create table if not exists penalties (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  date date not null,
  amount integer not null default 20000,
  reason text not null default 'missed_day',
  created_at timestamptz not null default now(),
  unique (person_id, date)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id) on delete cascade,
  amount integer not null check (amount > 0),
  note text not null default '',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

insert into people (id, slug, display_name, side, theme_color)
values
  ('partner', 'partner', 'Người ấy', 'left', 'lavender'),
  ('me', 'me', 'Tôi', 'right', 'rose')
on conflict (id) do update
set display_name = excluded.display_name,
    side = excluded.side,
    theme_color = excluded.theme_color;
```

- [ ] **Step 4: Create Supabase client**

Create `src/lib/supabaseClient.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 5: Create service interface with implemented method shells**

Create `src/services/habitService.ts`:

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyEntry, DailySummary, Payment, Penalty, Person, PersonSlug } from "../types/domain";

export type MoneySummary = {
  personId: PersonSlug;
  debt: number;
  penalties: Penalty[];
  payments: Payment[];
};

export type HabitService = {
  listPeople(): Promise<Person[]>;
  ensureTodayChecklist(date: string): Promise<DailyEntry[]>;
  toggleEntry(entryId: string, isDone: boolean): Promise<void>;
  listSevenDayHistory(today: string): Promise<DailySummary[]>;
  listMoneySummary(): Promise<MoneySummary[]>;
  recordPayment(personId: PersonSlug, amount: number, note: string): Promise<void>;
};

export function createHabitService(client: SupabaseClient): HabitService {
  return {
    async listPeople() {
      const { data, error } = await client.from("people").select("*").order("side");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        displayName: row.display_name,
        side: row.side,
        themeColor: row.theme_color,
        avatarUrl: row.avatar_url ?? undefined
      }));
    },
    async ensureTodayChecklist() {
      return [];
    },
    async toggleEntry(entryId, isDone) {
      const { error } = await client.from("daily_entries").update({ is_done: isDone }).eq("id", entryId);
      if (error) throw error;
    },
    async listSevenDayHistory() {
      return [];
    },
    async listMoneySummary() {
      return [];
    },
    async recordPayment(personId, amount, note) {
      const { error } = await client.from("payments").insert({
        person_id: personId,
        amount,
        note
      });
      if (error) throw error;
    }
  };
}
```

- [ ] **Step 6: Run test to verify pass**

Run:

```bash
npm test -- src/services/habitService.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add supabase/schema.sql src/lib/supabaseClient.ts src/services/habitService.ts src/services/habitService.test.ts
git commit -m "feat: add Supabase service boundary"
```

---

### Task 4: Implement Local Identity Setup

**Files:**
- Create: `src/lib/identity.ts`
- Create: `src/lib/identity.test.ts`
- Create: `src/components/IdentitySetup.tsx`
- Create: `src/components/IdentitySetup.test.tsx`
- Modify: `src/app/AppShell.tsx`

**Interfaces:**
- Produces: `getStoredIdentity(): PersonSlug | null`.
- Produces: `setStoredIdentity(identity: PersonSlug): void`.
- Produces: `clearStoredIdentity(): void`.
- Produces: `IdentitySetup({ onSelect }: { onSelect(identity: PersonSlug): void })`.

- [ ] **Step 1: Write identity storage tests**

Create `src/lib/identity.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { clearStoredIdentity, getStoredIdentity, setStoredIdentity } from "./identity";

describe("identity storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns null before identity is selected", () => {
    expect(getStoredIdentity()).toBeNull();
  });

  it("stores and clears a valid identity", () => {
    setStoredIdentity("me");
    expect(getStoredIdentity()).toBe("me");
    clearStoredIdentity();
    expect(getStoredIdentity()).toBeNull();
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("couple-habit.identity", "someone-else");
    expect(getStoredIdentity()).toBeNull();
  });
});
```

- [ ] **Step 2: Write identity setup UI test**

Create `src/components/IdentitySetup.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import IdentitySetup from "./IdentitySetup";

describe("IdentitySetup", () => {
  it("lets the user choose their identity", async () => {
    const onSelect = vi.fn();
    render(<IdentitySetup onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("button", { name: "Tôi" }));

    expect(onSelect).toHaveBeenCalledWith("me");
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test -- src/lib/identity.test.ts src/components/IdentitySetup.test.tsx
```

Expected: FAIL because implementation files do not exist.

- [ ] **Step 4: Implement identity storage**

Create `src/lib/identity.ts`:

```ts
import type { PersonSlug } from "../types/domain";

const STORAGE_KEY = "couple-habit.identity";

export function getStoredIdentity(): PersonSlug | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "me" || value === "partner" ? value : null;
}

export function setStoredIdentity(identity: PersonSlug): void {
  localStorage.setItem(STORAGE_KEY, identity);
}

export function clearStoredIdentity(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 5: Implement identity setup component**

Create `src/components/IdentitySetup.tsx`:

```tsx
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
```

- [ ] **Step 6: Gate App behind identity selection**

Modify `src/app/AppShell.tsx` to load identity on mount, render `IdentitySetup` when identity is missing, and call `setStoredIdentity` when selected. Keep the existing starter tab screens until later tasks replace them.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- src/lib/identity.test.ts src/components/IdentitySetup.test.tsx
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/lib/identity.ts src/lib/identity.test.ts src/components/IdentitySetup.tsx src/components/IdentitySetup.test.tsx src/app/AppShell.tsx
git commit -m "feat: add local identity setup"
```

---

### Task 5: Build Today Mirror Screen

**Files:**
- Create: `src/screens/TodayScreen.tsx`
- Create: `src/screens/TodayScreen.test.tsx`
- Create: `src/components/BottomNav.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `PersonSlug`, `DailyEntry`, `calculateCompletion`.
- Produces: `TodayScreen({ currentIdentity, entriesByPerson, onToggleEntry })`.
- Produces: `BottomNav({ activeTab, onChange })`.

- [ ] **Step 1: Write Today screen UI tests**

Create `src/screens/TodayScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TodayScreen from "./TodayScreen";
import type { DailyEntry } from "../types/domain";

const baseEntry = (personId: "partner" | "me", id: string, title: string, isDone: boolean): DailyEntry => ({
  id,
  personId,
  habitId: `habit-${id}`,
  date: "2026-07-31",
  isDone,
  title,
  sortOrder: 0
});

describe("TodayScreen", () => {
  it("renders partner left and me right with Vietnamese labels", () => {
    render(
      <TodayScreen
        currentIdentity="me"
        entriesByPerson={{
          partner: [baseEntry("partner", "p1", "Workout", true)],
          me: [baseEntry("me", "m1", "Read", false)]
        }}
        onToggleEntry={vi.fn()}
      />
    );

    expect(screen.getByText("Người ấy")).toBeInTheDocument();
    expect(screen.getByText("Tôi")).toBeInTheDocument();
    expect(screen.getByText("Chưa hoàn thành checklist = phạt 20.000đ")).toBeInTheDocument();
  });

  it("only allows toggling the current user's checkbox", async () => {
    const onToggleEntry = vi.fn();
    render(
      <TodayScreen
        currentIdentity="me"
        entriesByPerson={{
          partner: [baseEntry("partner", "p1", "Workout", false)],
          me: [baseEntry("me", "m1", "Read", false)]
        }}
        onToggleEntry={onToggleEntry}
      />
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "Read" }));
    expect(onToggleEntry).toHaveBeenCalledWith("m1", true);
    expect(screen.getByRole("checkbox", { name: "Workout" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/screens/TodayScreen.test.tsx
```

Expected: FAIL because `TodayScreen.tsx` does not exist.

- [ ] **Step 3: Implement BottomNav**

Create `src/components/BottomNav.tsx`:

```tsx
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
```

- [ ] **Step 4: Implement TodayScreen**

Create `src/screens/TodayScreen.tsx` using `calculateCompletion`. The component must render the dark header, progress summary, mirrored panels, disabled checkboxes for the non-current identity, and the penalty reminder.

- [ ] **Step 5: Wire TodayScreen into App**

Modify `src/app/AppShell.tsx` so the `today` tab renders `TodayScreen` with temporary fixture entries until Task 7 connects Supabase data.

- [ ] **Step 6: Add visual CSS**

Modify `src/app/globals.css` to add the approved visual system: dark header, progress card, two-column person grid, lavender/rose accents, large checkboxes, and fixed bottom nav spacing.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- src/screens/TodayScreen.test.tsx
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/screens/TodayScreen.tsx src/screens/TodayScreen.test.tsx src/components/BottomNav.tsx src/app/AppShell.tsx src/app/globals.css
git commit -m "feat: build today mirror screen"
```

---

### Task 6: Build Habits Management Screen

**Files:**
- Create: `src/screens/HabitsScreen.tsx`
- Create: `src/screens/HabitsScreen.test.tsx`
- Modify: `src/services/habitService.ts`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `HabitsScreen({ currentIdentity, habits, onAddHabit, onRenameHabit, onDeactivateHabit, onMoveHabit })`.
- Extends: `HabitService` with `listHabits`, `addHabit`, `renameHabit`, `deactivateHabit`, `moveHabit`.

- [ ] **Step 1: Write habits screen test**

Create `src/screens/HabitsScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HabitsScreen from "./HabitsScreen";

describe("HabitsScreen", () => {
  it("adds a habit for the current user", async () => {
    const onAddHabit = vi.fn();
    render(
      <HabitsScreen
        currentIdentity="me"
        habits={[]}
        onAddHabit={onAddHabit}
        onRenameHabit={vi.fn()}
        onDeactivateHabit={vi.fn()}
        onMoveHabit={vi.fn()}
      />
    );

    await userEvent.type(screen.getByLabelText("Tên thói quen"), "Đọc sách");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));

    expect(onAddHabit).toHaveBeenCalledWith("me", "Đọc sách");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/screens/HabitsScreen.test.tsx
```

Expected: FAIL because `HabitsScreen.tsx` does not exist.

- [ ] **Step 3: Implement HabitsScreen**

Create a screen that shows only the current user's habits, includes an input labeled `Tên thói quen`, an add button labeled `Thêm`, rename controls, deactivate controls, and up/down reorder buttons.

- [ ] **Step 4: Extend HabitService habit methods**

Modify `src/services/habitService.ts` to add:

```ts
listHabits(personId: PersonSlug): Promise<Habit[]>;
addHabit(personId: PersonSlug, title: string): Promise<Habit>;
renameHabit(habitId: string, title: string): Promise<void>;
deactivateHabit(habitId: string): Promise<void>;
moveHabit(habitId: string, sortOrder: number): Promise<void>;
```

Each method should use the `habits` table and throw Supabase errors.

- [ ] **Step 5: Wire HabitsScreen into App with temporary local state**

Modify `src/app/AppShell.tsx` so the `habits` tab renders `HabitsScreen` for the selected identity using local state until Task 7 replaces local state with service calls.

- [ ] **Step 6: Run tests and build**

Run:

```bash
npm test -- src/screens/HabitsScreen.test.tsx src/services/habitService.test.ts
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/screens/HabitsScreen.tsx src/screens/HabitsScreen.test.tsx src/services/habitService.ts src/app/AppShell.tsx src/app/globals.css
git commit -m "feat: add habit management screen"
```

---

### Task 7: Implement Supabase Data Loading and Mutations

**Files:**
- Modify: `src/services/habitService.ts`
- Modify: `src/services/habitService.test.ts`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/types/domain.ts`

**Interfaces:**
- Consumes: service methods from Task 3 and Task 6.
- Produces: App-level loading, sync, and error states.
- Produces: real Supabase-backed `Today`, `Habits`, and payment data.

- [ ] **Step 1: Expand service tests with mocked Supabase client**

Modify `src/services/habitService.test.ts` to test:

```ts
it("toggleEntry updates the matching daily entry", async () => {
  const update = vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) }));
  const from = vi.fn(() => ({ update }));
  const service = createHabitService({ from } as never);

  await service.toggleEntry("entry-1", true);

  expect(from).toHaveBeenCalledWith("daily_entries");
  expect(update).toHaveBeenCalledWith({ is_done: true });
});
```

Also add tests for `recordPayment`, `listHabits`, and `addHabit`.

- [ ] **Step 2: Run service tests to verify failures**

Run:

```bash
npm test -- src/services/habitService.test.ts
```

Expected: FAIL until all service methods are implemented.

- [ ] **Step 3: Implement service methods fully**

Modify `src/services/habitService.ts` so:

- `ensureTodayChecklist(date)` loads active habits, inserts missing `daily_entries` with upsert/ignore semantics, and returns entries joined with habit titles.
- `listSevenDayHistory(today)` loads the last seven dates of entries and penalties, then returns `DailySummary[]`.
- `listMoneySummary()` loads penalties and payments and returns debt per person.
- Habit methods read/write `habits`.
- Payment method inserts a row into `payments`.

- [ ] **Step 4: Wire App to service**

Modify `src/app/AppShell.tsx` to:

- Create the service from `supabase`.
- Load people, today's entries, habits, and money summaries after identity selection.
- Show `Đang đồng bộ...` while loading.
- Show `Chưa đồng bộ` when a service call fails.
- Call `toggleEntry` when current user checks a box.
- Refresh today data after toggles and habit changes.

- [ ] **Step 5: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/services/habitService.ts src/services/habitService.test.ts src/app/AppShell.tsx src/types/domain.ts
git commit -m "feat: connect app to Supabase data"
```

---

### Task 8: Add History and Money Screens

**Files:**
- Create: `src/screens/HistoryScreen.tsx`
- Create: `src/screens/HistoryScreen.test.tsx`
- Create: `src/screens/MoneyScreen.tsx`
- Create: `src/screens/MoneyScreen.test.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `HistoryScreen({ summaries })`.
- Produces: `MoneyScreen({ summaries, onRecordPayment })`.

- [ ] **Step 1: Write History screen test**

Create `src/screens/HistoryScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistoryScreen from "./HistoryScreen";

describe("HistoryScreen", () => {
  it("shows seven-day completion summaries", () => {
    render(
      <HistoryScreen
        summaries={[
          {
            date: "2026-07-31",
            personId: "me",
            completion: { total: 5, done: 4, percent: 80, isComplete: false },
            hasPenalty: true
          }
        ]}
      />
    );

    expect(screen.getByText("Lịch sử 7 ngày")).toBeInTheDocument();
    expect(screen.getByText("4/5 thói quen")).toBeInTheDocument();
    expect(screen.getByText("Đã phạt")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write Money screen test**

Create `src/screens/MoneyScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MoneyScreen from "./MoneyScreen";

describe("MoneyScreen", () => {
  it("records a default full debt payment", async () => {
    const onRecordPayment = vi.fn();
    render(
      <MoneyScreen
        summaries={[
          { personId: "me", debt: 40000, penalties: [], payments: [] },
          { personId: "partner", debt: 20000, penalties: [], payments: [] }
        ]}
        onRecordPayment={onRecordPayment}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Tôi đã đóng phạt" }));

    expect(onRecordPayment).toHaveBeenCalledWith("me", 40000, "");
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test -- src/screens/HistoryScreen.test.tsx src/screens/MoneyScreen.test.tsx
```

Expected: FAIL because screens do not exist.

- [ ] **Step 4: Implement HistoryScreen**

Create a compact 7-day list grouped by date. Show `Tôi`, `Người ấy`, completion counts, and penalty labels.

- [ ] **Step 5: Implement MoneyScreen**

Create debt cards for both people, recent penalty/payment lists, and `Đã đóng phạt` buttons. Button labels must include the person's display label, such as `Tôi đã đóng phạt`.

- [ ] **Step 6: Wire screens into App**

Modify `src/app/AppShell.tsx` so the `history` and `money` tabs render real loaded data and `MoneyScreen` calls `recordPayment`.

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test -- src/screens/HistoryScreen.test.tsx src/screens/MoneyScreen.test.tsx
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/screens/HistoryScreen.tsx src/screens/HistoryScreen.test.tsx src/screens/MoneyScreen.tsx src/screens/MoneyScreen.test.tsx src/app/AppShell.tsx src/app/globals.css
git commit -m "feat: add history and money screens"
```

---

### Task 9: Implement Past-Day Closure and Penalty Creation

**Files:**
- Modify: `src/services/habitService.ts`
- Modify: `src/services/habitService.test.ts`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/lib/date.ts`
- Modify: `src/lib/habitLogic.test.ts`

**Interfaces:**
- Produces: `HabitService.closePastDays(today: string): Promise<void>`.
- Produces: idempotent creation of `daily_closures` and `penalties`.

- [ ] **Step 1: Add domain/service tests for closure behavior**

Modify `src/services/habitService.test.ts` to verify:

- The service inserts one `daily_closures` row per person/date.
- The service inserts a 20,000 VND penalty when entries are incomplete.
- The service does not throw on duplicate rows when uniqueness constraints reject duplicates.

Use a mocked Supabase client that records calls to `from("daily_closures").upsert(...)` and `from("penalties").upsert(...)`.

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/services/habitService.test.ts
```

Expected: FAIL because `closePastDays` does not exist.

- [ ] **Step 3: Implement closePastDays**

Modify `src/services/habitService.ts`:

```ts
const PENALTY_AMOUNT = 20000;
```

Add `closePastDays(today)` to the service. It should:

- Load `daily_entries` where `date < today`.
- Group entries by `person_id` and `date`.
- For each group, calculate completion.
- Upsert `daily_closures` with `person_id`, `date`, and `is_complete`.
- Upsert into `penalties` with `person_id`, `date`, `amount: 20000`, and `reason: "missed_day"` only when incomplete.

- [ ] **Step 4: Call closePastDays from App startup**

Modify `src/app/AppShell.tsx` so after identity selection and before loading summaries, it calls `service.closePastDays(todayInVietnam())`.

- [ ] **Step 5: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/services/habitService.ts src/services/habitService.test.ts src/app/AppShell.tsx src/lib/date.ts src/lib/habitLogic.test.ts
git commit -m "feat: close missed days with penalties"
```

---

### Task 10: Final Mobile Polish and Verification

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/layout.tsx`
- Create: `README.md`

**Interfaces:**
- Produces: polished mobile PWA with setup instructions.

- [ ] **Step 1: Add README**

Create `README.md`:

```md
# Couple Habit PWA

Private mobile-first PWA for two people to track daily habits and penalty payments.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env`.
4. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Run `npm install`.
6. Run `npm run dev`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run start`
```

- [ ] **Step 2: Polish responsive CSS**

Modify `src/app/globals.css` so:

- Minimum supported width is 320px.
- Mirrored panels remain side by side without text overflow.
- Checkbox tap targets are at least 44px.
- Bottom nav does not cover screen content.
- Header and progress card match the approved mockup direction.

- [ ] **Step 3: Verify app metadata**

Verify `src/app/layout.tsx` includes the Apple PWA metadata through the exported `metadata.appleWebApp` object:

```ts
appleWebApp: {
  capable: true,
  title: "Couple Habit",
  statusBarStyle: "black-translucent"
}
```

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and build succeeds.

- [ ] **Step 5: Start local server for manual check**

Run:

```bash
npm run dev
```

Expected: Next.js prints a local URL such as `http://localhost:3000/`.

- [ ] **Step 6: Manually verify mobile UX**

Open the local URL at mobile viewport widths `390x844` and `320x568`. Confirm:

- Identity setup appears on first load.
- `Today` shows dark header, progress card, and mirrored panels.
- `Người ấy` appears left and `Tôi` appears right.
- Current user's checklist is editable.
- Other person's checklist is read-only.
- Bottom nav is visible and does not overlap content.
- Text fits within controls and panels.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/AppShell.tsx src/app/layout.tsx README.md
git commit -m "chore: polish mobile PWA experience"
```

---

## Self-Review Notes

- Spec coverage: The plan covers no-login identity setup, mirrored Today UI, separate habit management, Supabase sync, 20,000 VND penalties, payments, 7-day history, Vietnamese UI labels, PWA setup, visual polish, and testing.
- Red-flag scan: The plan intentionally leaves no unfinished markers or vague test steps. Implementation choices from the design spec are resolved here by selecting Next.js App Router, React, TypeScript, Supabase JS, Vitest, and a manual web app manifest plus service worker.
- Type consistency: Shared types are introduced in Task 2 and reused by service and UI tasks. Service methods are introduced before App integration. Penalty amount and timezone are consistent with the design spec.
