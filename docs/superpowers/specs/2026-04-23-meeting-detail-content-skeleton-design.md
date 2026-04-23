# Meeting Detail Content Skeleton Design

**Date:** 2026-04-23
**Screen:** `artifacts/notura/app/conversation/[id].tsx`

## Goal
Add a loading skeleton for the meeting detail screen that covers only the main content area, following the visual direction in `DESIGN.md` without changing fetch behavior or the header structure.

## Scope
- Keep the existing navbar, top action buttons, title/meta block, speakers row, and tabs outside the skeleton scope.
- Replace the current centered loading text shown during `meetingDetailQuery.isPending` with a premium content skeleton.
- Keep the existing error and missing-id states unchanged.

## Recommended Approach
Use a layout-matched skeleton for the default `Resumo` content area.

This keeps the loading state visually consistent with the final layout, reduces layout shift when the data arrives, and stays aligned with the design system's card treatment, spacing, and soft hierarchy.

## Visual Structure
Render the skeleton below the existing header/tab area with:
- One primary card containing three text-line placeholders for the summary.
- One secondary card containing two short lines plus three pill placeholders.
- One secondary card containing three stacked line placeholders for supporting insights/actions.

## Styling Constraints
- Use white cards with `radius-l`-like rounded corners and soft elevation consistent with the current screen.
- Use neutral placeholder fills close to `gray-100` / `gray-200` from `DESIGN.md`.
- Avoid spinners and avoid loud shimmer effects.
- Keep animation subtle, using a soft pulse/opacity treatment that feels native to the existing UI.

## Behavior
- Skeleton appears only while `meetingDetailQuery.isPending`.
- The loading state remains read-only and does not affect query keys, retries, or other state.
- The default active tab remains `Resumo`; no tab-aware loading variants are required for this change.

## Testing
Add a regression test that proves the screen source contains a dedicated skeleton loading path instead of only a centered loading label.
