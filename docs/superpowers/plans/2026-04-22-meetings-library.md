# Meetings Library Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current meetings/search experience with a premium meetings library ordered by recording date and linked to the existing conversation detail screen.

**Architecture:** Reuse `conversations` from `AppContext` as the single source of truth, sort them by recorded date inside the meetings screen, and render a dedicated premium card for each meeting. Keep route compatibility by turning `/schedule` into an alias of the meetings screen and update Home navigation to send users to the tab route.

**Tech Stack:** Expo Router, React Native, TypeScript, existing app design tokens/components, Node source-inspection tests.

---

## Chunk 1: Route and Behavior Contract

### Task 1: Define the expected meetings screen and navigation behavior

**Files:**
- Create: `artifacts/notura/tests/meetings-screen.test.mjs`
- Modify: `artifacts/notura/tests/navbar-consistency.test.mjs`
- Test: `artifacts/notura/tests/meetings-screen.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add assertions that:
- the meetings tab screen uses `AppNavbar` with `Reuniões`
- the screen exposes Portuguese status labels and sorting by date
- tapping a meeting routes to `/conversation/<id>`
- Home no longer pushes users to `/schedule`

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `node --test artifacts/notura/tests/meetings-screen.test.mjs artifacts/notura/tests/navbar-consistency.test.mjs`
Expected: FAIL because the current screen is still a search experience and Home still links to `/schedule`

## Chunk 2: Meetings Library UI

### Task 2: Implement the premium meetings library screen

**Files:**
- Create: `artifacts/notura/components/RecordedMeetingCard.tsx`
- Modify: `artifacts/notura/app/(tabs)/search.tsx`
- Modify: `artifacts/notura/app/schedule.tsx`
- Modify: `artifacts/notura/app/(tabs)/index.tsx`
- Test: `artifacts/notura/tests/meetings-screen.test.mjs`

- [ ] **Step 1: Write the minimal implementation**

Build a dedicated meetings card that shows:
- meeting name
- status pill
- recorded date

Then replace the tab screen content with the approved premium list ordered by date descending, and make `/schedule` reuse the same screen.

- [ ] **Step 2: Run the focused tests to verify they pass**

Run: `node --test artifacts/notura/tests/meetings-screen.test.mjs artifacts/notura/tests/navbar-consistency.test.mjs`
Expected: PASS

## Chunk 3: Full Verification

### Task 3: Run regression checks

**Files:**
- Test: `artifacts/notura/tests/*.mjs`
- Test: `pnpm --filter @workspace/notura run typecheck`

- [ ] **Step 1: Run all Node tests**

Run: `node --test artifacts/notura/tests/*.mjs`
Expected: PASS

- [ ] **Step 2: Run app typecheck**

Run: `pnpm --filter @workspace/notura run typecheck`
Expected: PASS
