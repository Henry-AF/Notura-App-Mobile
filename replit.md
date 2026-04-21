# Notura — AI Meeting Assistant

## Overview

A production-ready mobile app (Expo/React Native) for Notura, an AI-powered meeting assistant that transforms audio meetings into summaries, tasks, and insights. Built with the full Notura design system (brand color `#5341CD`).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile app**: Expo (React Native) — `artifacts/notura/`
- **API framework**: Express 5 — `artifacts/api-server/`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Mobile App (Notura)

### Screens / Navigation
- **Dashboard** (`app/(tabs)/index.tsx`) — greeting, stats, AI insight, recent meetings, today's tasks
- **Meetings** (`app/(tabs)/meetings.tsx`) — searchable list with filter tabs (All / Completed / Processing / Failed)
- **Tasks** (`app/(tabs)/tasks.tsx`) — task list with toggle, filter tabs (All / Open / Done)
- **Contacts** (`app/(tabs)/contacts.tsx`) — contact list with search, WhatsApp integration banner
- **Meeting Detail** (`app/meeting/[id].tsx`) — tabs: Summary / Tasks / Transcript
- **Profile** (`app/profile.tsx`) — user info, settings, upgrade CTA
- **Auth** (`app/auth.tsx`) — login/register with email/password + social buttons

### Modals
- **Pricing Modal** — Free vs Pro comparison with upgrade CTA
- **Create Meeting Modal** — upload audio, record audio UI

### Components
- `Badge` — status/priority/semantic badges
- `Avatar` — initials-based colored avatars
- `MeetingCard` — meeting list item with date block and status
- `TaskCard` — task item with checkbox, priority, tags, assignee
- `StatCard` — metric display cards
- `InsightCard` — gradient AI insight card
- `SearchBar` — search input with clear button
- `FilterTabs` — horizontal scrollable filter tabs
- `PricingModal` — full-screen pricing comparison
- `CreateMeetingModal` — meeting creation form

### Design System
- Brand primary: `#5341CD` (indigo/purple)
- Full dark mode support
- Colors defined in `constants/colors.ts`
- Accessed via `useColors()` hook
- Mock data in `lib/mockData.ts`
- State managed via `context/AppContext.tsx` + AsyncStorage

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
