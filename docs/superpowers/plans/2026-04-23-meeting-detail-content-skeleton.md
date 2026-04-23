# Meeting Detail Content Skeleton Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a main-content-only loading skeleton to the meeting detail screen that matches the current premium layout and replaces the centered loading text.

**Architecture:** Keep the existing query flow and page shell intact. Introduce a small, local skeleton renderer inside the conversation detail screen and switch the pending branch to render the existing header plus skeleton content, preserving error and empty states.

**Tech Stack:** React Native, Expo Router, TanStack Query, existing Notura design tokens/patterns.

---

## Chunk 1: Lock the behavior with a failing test

### Task 1: Add a source-level regression test for the skeleton loading state

**Files:**
- Modify: `artifacts/notura/tests/conversation-api-integration.test.mjs`
- Test: `artifacts/notura/tests/conversation-api-integration.test.mjs`

- [ ] **Step 1: Write the failing test**
Add assertions that the conversation detail screen source includes a dedicated content skeleton marker/component and no longer uses the full-screen centered `Carregando reunião...` pending UI.

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test artifacts/notura/tests/conversation-api-integration.test.mjs`
Expected: FAIL because the screen still renders the old pending branch.

- [ ] **Step 3: Write minimal implementation**
Implement the smallest screen change necessary to satisfy the new loading expectation.

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test artifacts/notura/tests/conversation-api-integration.test.mjs`
Expected: PASS.

## Chunk 2: Implement the content skeleton

### Task 2: Render the pending state as header + tabs + content skeleton

**Files:**
- Modify: `artifacts/notura/app/conversation/[id].tsx`
- Test: `artifacts/notura/tests/conversation-api-integration.test.mjs`

- [ ] **Step 1: Add a focused skeleton renderer**
Create a local helper/component for the content skeleton with three premium cards, soft neutral placeholders, and subtle pulse animation.

- [ ] **Step 2: Swap the pending branch**
Keep the outer page shell and tabs, but render the skeleton in the main scroll content while `meetingDetailQuery.isPending` is true.

- [ ] **Step 3: Keep existing non-loading states unchanged**
Do not alter missing-id, missing-data, or error branches beyond what is needed to share page shell code safely.

- [ ] **Step 4: Run targeted verification**
Run: `node --test artifacts/notura/tests/conversation-api-integration.test.mjs`
Expected: PASS.

- [ ] **Step 5: Run a broader related verification**
Run: `node --test artifacts/notura/tests/conversation-api-integration.test.mjs artifacts/notura/tests/meetings-screen.test.mjs`
Expected: PASS.
