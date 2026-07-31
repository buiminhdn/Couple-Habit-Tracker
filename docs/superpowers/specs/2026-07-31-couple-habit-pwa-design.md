# Couple Habit PWA Design

## Summary

Build a private, mobile-first PWA for two people to track daily habits and keep each other accountable. The MVP has no login because the app is intended only for the couple. Each device chooses its identity once, stores that choice locally, and can only edit that person's habits and daily checklist.

The core experience is a `Today` screen with a mirrored layout: partner on the left, me on the right. Each side shows daily progress, checklist status, and habits for the current day. If a person does not complete every habit in their checklist by 23:59, the app creates a 20,000 VND penalty for that person. The app also lets each person record penalty payments, which reduce their outstanding debt.

## Goals

- Create a polished mobile-first PWA that feels intimate, calm, disciplined, and suitable for daily use by a couple.
- Let both people see each other's daily progress in one glance.
- Let each person tick only their own daily checklist.
- Let each person manage their own habit checklist.
- Sync data between two phones through Supabase.
- Automatically calculate penalties and outstanding debt.
- Keep the MVP focused and avoid account systems, group support, social features, or complex statistics.

## Non-Goals

- No login or user registration in the MVP.
- No multi-couple or public sharing support.
- No comments, chat, reactions, or feed.
- No monthly calendar or detailed analytics in the MVP.
- No strict security model. The local identity selection is a convenience boundary, not strong access control.
- No full offline write sync in the MVP. Offline display can show cached data, but reliable offline mutation can be added later.

## Product Decisions

- Data sync uses Supabase.
- The app is designed for exactly two people.
- Each person has a separate habit checklist.
- The first app launch asks the user to choose identity: `Tôi` or `Người ấy`. This is stored locally on that device.
- Habit completion is binary: done or not done.
- A day closes at 23:59 in the `Asia/Ho_Chi_Minh` timezone.
- A person is penalized only if at least one daily checklist entry for that person remains incomplete when the day closes.
- Penalty amount is fixed at 20,000 VND per person per missed day.
- Users can mark penalty payments, which reduce outstanding debt.
- History shows the last 7 days.
- UI text should be Vietnamese by default.

## User Experience

### First Launch

When the app is opened for the first time, it shows a simple identity setup screen. The user chooses one of two identities:

- `Tôi`
- `Người ấy`

After selection, the choice is saved locally. The user can later reset or change this identity from a settings-style affordance if needed, but identity switching is not a primary workflow.

### Today Screen

The `Today` screen is the primary app surface and should be the first screen after setup.

It contains:

- A compact header with today's date, sync status, and couple progress.
- A progress summary card showing combined couple completion.
- Two mirrored habit panels:
  - `Người ấy` on the left.
  - `Tôi` on the right.
- A penalty reminder: `Chưa hoàn thành checklist = phạt 20.000đ / mỗi người, mỗi ngày.`
- A fixed bottom navigation bar.

Each person panel contains:

- Display name and avatar.
- Daily completion percentage.
- Status badge:
  - Complete when all habits are done.
  - Missing when some habits remain.
  - Fined for a previously closed missed day.
- Habit checklist rows with large touch-friendly checkboxes.

The current user's panel is editable. The other person's panel is read-only. Read-only checkboxes should remain visually clear but should not feel broken or overly disabled.

### History Screen

The `History` screen shows the last 7 days for both people.

For each day, it should show:

- Date.
- Completion status for each person.
- Whether a penalty was created.
- A compact summary such as `4/5 habits`.

The goal is quick accountability, not deep analytics.

### Habits Screen

The `Habits` screen lets the current user manage their own habits.

Required actions:

- Add a habit.
- Rename a habit.
- Deactivate or delete a habit.
- Reorder habits.

Rules:

- Each person can only manage their own habits.
- Deactivated habits should not appear in future daily checklists.
- Historical daily entries remain intact even if a habit is later deactivated.
- Habit changes apply from the current day forward. If a habit is added during the current day, it appears in today's checklist.

### Money Screen

The `Money` screen shows penalties and payments.

It contains:

- Outstanding debt for each person.
- Recent penalties.
- Recent payments.
- A `Đã đóng phạt` action for each person.

The payment action should default to the person's full outstanding debt but allow a custom amount. Recording a payment subtracts from outstanding debt.

Outstanding debt is calculated as:

`sum(penalties.amount) - sum(payments.amount)`

## Visual System

The UI should follow the user's chosen visual reference:

- Font: Google Sans Flex.
- Mobile-first iPhone-style composition.
- Dark calm header with a disciplined night mood.
- Light app background.
- White progress card with soft border and subtle shadow.
- Mirrored person panels:
  - `Người ấy` side uses soft lavender/purple.
  - `Tôi` side uses soft rose/pink.
- Large, touch-friendly checkboxes.
- Gentle status badges.
- Fixed bottom navigation with four tabs:
  - `Hôm nay`
  - `Lịch sử`
  - `Thói quen`
  - `Tiền phạt`

The interface should feel warm, clean, intimate, and premium. It should not feel like a corporate dashboard, a marketing landing page, or a childish app. Avoid heavy gradients, nested cards, clutter, tiny tap targets, and decorative elements that do not support the daily habit workflow.

## Architecture

### Frontend

The frontend is a mobile-first PWA with these major UI areas:

- `IdentitySetup`
- `Today`
- `History`
- `Habits`
- `Money`

Data access should be isolated behind a Supabase service layer so UI components do not contain raw database queries throughout the app.

Recommended frontend boundaries:

- UI components for screens and reusable controls.
- Domain logic for completion, penalties, and debt calculations.
- Supabase service functions for reads and writes.
- Local storage helper for selected identity.
- PWA configuration for manifest and installability.

### Supabase Data Model

#### `people`

Stores the two fixed people.

Fields:

- `id`
- `slug`
- `display_name`
- `side`
- `theme_color`
- `avatar_url`
- `created_at`

Expected rows:

- `partner`, left side, displayed as `Người ấy`.
- `me`, right side, displayed as `Tôi`.

#### `habits`

Stores each person's habit definitions.

Fields:

- `id`
- `person_id`
- `title`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

#### `daily_entries`

Stores daily habit completion states.

Fields:

- `id`
- `person_id`
- `habit_id`
- `date`
- `is_done`
- `created_at`
- `updated_at`

Uniqueness:

- One entry per `person_id`, `habit_id`, and `date`.

#### `daily_closures`

Stores whether a person's day has already been closed. This prevents duplicate penalty creation.

Fields:

- `id`
- `person_id`
- `date`
- `is_complete`
- `closed_at`

Uniqueness:

- One closure per `person_id` and `date`.

#### `penalties`

Stores missed-day penalties.

Fields:

- `id`
- `person_id`
- `date`
- `amount`
- `reason`
- `created_at`

Uniqueness:

- One penalty per `person_id` and `date`.

#### `payments`

Stores payment records.

Fields:

- `id`
- `person_id`
- `amount`
- `note`
- `paid_at`
- `created_at`

## Core Data Flows

### Ensure Today's Checklist

When the app opens:

1. Load active habits for both people.
2. Load today's daily entries.
3. For any active habit missing a daily entry for today, create one with `is_done = false`.
4. Render both panels from the resulting entries.

This operation must be idempotent.

### Tick Habit

When the current user ticks a habit:

1. Verify the habit belongs to the locally selected person.
2. Update the matching `daily_entries.is_done`.
3. Refresh or optimistically update the current day's progress.

The app should not allow editing the other person's entries from the UI.

### Close Past Days

When the app opens or resumes:

1. Find unclosed dates before today for each person.
2. For each person and date, check whether all daily entries created for that date were completed.
3. Create a `daily_closures` row.
4. If the day is incomplete, create one 20,000 VND penalty.
5. Do not create duplicate closures or duplicate penalties.

### Calculate Debt

For each person:

1. Sum all penalty amounts.
2. Sum all payment amounts.
3. Outstanding debt equals penalties minus payments.

Debt should not display below zero. If payments exceed penalties, show zero outstanding debt and preserve the payment history.

## Edge Cases

- If no identity is selected, the app must show identity setup before all other screens.
- If a person has no active habits, show an empty state on their panel and do not create a penalty for that person for that day.
- If Supabase is temporarily unreachable, show the most recently loaded data where possible and display a clear unsynced state.
- If a habit is added today, create today's daily entry for it.
- If a habit is deactivated today, it should stop appearing in new checklists. Existing entries should remain in history.
- If the app is not opened for several days, it should close all missed past days the next time it opens.
- If two devices open at the same time, uniqueness constraints must prevent duplicate entries, closures, and penalties.

## Testing Strategy

### Unit Tests

Cover domain logic:

- Completion percentage.
- Complete versus incomplete day.
- Penalty creation rules.
- Debt calculation after payments.
- Empty habit list behavior.

### Data Tests

Cover Supabase service behavior:

- Ensuring today's checklist is idempotent.
- Creating missing daily entries.
- Preventing duplicate penalties.
- Loading 7-day history.
- Recording payments.

### UI Tests

Cover critical flows:

- First launch identity selection.
- Today screen renders two mirrored panels.
- Current user can tick their own habit.
- Other person's checklist is read-only.
- Habit management updates current user's checklist.
- Money screen records a payment and updates debt.

### Visual Verification

Verify mobile layouts at narrow and common phone widths:

- The mirrored panels remain readable.
- Checkbox tap targets are large enough.
- Bottom navigation does not overlap content.
- Text does not overflow cards or buttons.
- The UI matches the chosen visual reference closely enough while using Vietnamese labels.

## Open Implementation Choices

These are intentionally left for implementation planning:

- Exact frontend framework.
- Exact Supabase client setup and environment variable names.
- Whether past-day closure runs only client-side or also through a Supabase RPC/Edge Function.
- Exact avatar assets for each person.
- Exact Vietnamese microcopy for all status badges and empty states.
