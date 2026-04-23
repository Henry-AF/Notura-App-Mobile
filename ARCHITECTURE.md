# Notura Mobile — Architecture & Code Guidelines

> Read this entire file before generating any code.
> These rules are non-negotiable and apply to every contribution.
> This project consumes the Notura Next.js API. It does not own any database logic.

---

## Stack

- **Expo SDK** — managed workflow, EAS Build for distribution
- **Expo Router v3** — file-based navigation (same mental model as Next.js App Router)
- **Supabase JS** — Auth only (session management, JWT). No direct DB queries.
- **TanStack Query** — server state, caching, background refetch
- **Zustand** — ephemeral client state (recording in progress, UI flags)
- **StyleSheet** — estilização nativa do React Native
- **Zod** — validação de schemas e tipos de formulário
- **expo-audio** — audio recording
- **expo-notifications** — push notifications
- **AsyncStorage** — Supabase session persistence

---

## Relationship with the Web API

This app is a pure HTTP client of the Notura Next.js backend (`EXPO_PUBLIC_API_URL`).
All business logic, authorization and database access live there.

```
[Mobile App] → HTTP (JWT) → [Next.js API] → Supabase / R2 / Inngest
```

The mobile app is responsible for:
- Authenticating the user and maintaining a valid session
- Calling the API with the correct token
- Rendering data and capturing user input
- Recording audio and uploading it to the API

The mobile app is **never** responsible for:
- Direct Supabase database queries
- Business rules (ownership, quota, status transitions)
- Triggering or monitoring Inngest jobs directly

---

## Rule #1 — No direct Supabase DB queries

Supabase is used **exclusively** for authentication. Never call `.from()` in any
component, screen, hook or lib file.

```typescript
// ❌ FORBIDDEN — direct DB query from mobile
import { supabase } from "@/lib/supabase";
const { data } = await supabase.from("meetings").select();

// ✅ CORRECT — always go through the web API
const meetings = await api.meetings.list();
```

Auth operations (sign in, sign out, session) are the only allowed Supabase calls:

```typescript
// ✅ ALLOWED — auth only
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signOut();
const { data: { session } } = await supabase.auth.getSession();
```

---

## Rule #2 — All API calls go through the typed client

Never call `fetch` directly in screens, components or hooks.
Every API call goes through `@/lib/api-client`, which injects the JWT automatically.

```typescript
// ❌ FORBIDDEN — raw fetch anywhere outside api-client.ts
const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/meetings`);

// ✅ CORRECT — typed, authenticated, centralised
import { api } from "@/lib/api-client";
const meetings = await api.meetings.list();
```

The client handles: token injection, token expiry (401 → force sign-out),
response parsing and typed errors. No screen should duplicate this logic.

---

## Rule #3 — Every screen requires a companion API helper and test file

Every new screen must be accompanied by:

- `screen-name-api.ts` — all API calls and data mapping, lives **inside** `app/` alongside the screen
- `screen-name-api.test.ts` — unit tests, lives **outside** `app/` under `tests/api/`

The screen component itself **never** calls `api.*` or `fetch` directly.

> **Why tests must not live inside `app/`:**
> Expo Router bundles **every** `.ts`/`.tsx` file inside `app/` — including test files.
> This causes the bundler to try to load `node:test` at runtime and **break the web target**.
> Test files must always live in `tests/`, never in `app/`.

```
// ❌ FORBIDDEN — test file inside app/
app/(app)/meetings/meetings-api.test.ts

// ✅ CORRECT — test file outside app/
tests/api/meetings-api.test.ts
```

```
app/
  (app)/
    meetings/
      index.tsx                   ← UI only, imports from meetings-api.ts
      meetings-api.ts             ← fetch calls + data mapping (lives in app/)

    meetings/[id]/
      index.tsx
      meeting-detail-api.ts

tests/
  api/
    meetings-api.test.ts          ← tests for meetings-api.ts
    meeting-detail-api.test.ts
  no-test-files-in-app.test.mjs   ← regression: asserts no *.test.ts exists inside app/
```

**Companion helper structure:**

```typescript
// meeting-detail-api.ts

import { api } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type { Meeting } from "@/lib/api-client";

export interface MeetingDetailData {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  formattedDate: string;
  summary: string | null;
  tasks: Array<{ id: string; text: string; completed: boolean }>;
}

// Pure mapping — no fetch, no side effects. Easy to unit test.
export function mapMeetingDetail(meeting: Meeting): MeetingDetailData {
  return {
    id: meeting.id,
    title: meeting.title,
    status: meeting.status,
    formattedDate: formatRelativeTime(meeting.created_at),
    summary: meeting.summary,
    tasks: (meeting.tasks ?? []).map((t) => ({
      id: t.id,
      text: t.description,
      completed: t.completed,
    })),
  };
}

// Fetch — calls the API, delegates mapping to mapMeetingDetail.
export async function fetchMeetingDetail(id: string): Promise<MeetingDetailData> {
  const meeting = await api.meetings.get(id);
  return mapMeetingDetail(meeting);
}
```

**Screen component:**

```typescript
// index.tsx — UI only
// ❌ FORBIDDEN
const meeting = await api.meetings.get(id);

// ✅ CORRECT
import { fetchMeetingDetail } from "./meeting-detail-api";
const { data } = useQuery({ queryKey: ["meeting", id], queryFn: () => fetchMeetingDetail(id) });
```

---

## Rule #4 — Server state via TanStack Query, UI state via Zustand

Do not manage server data in `useState` or Zustand. Every piece of data
that comes from the API lives in TanStack Query.

```typescript
// ❌ FORBIDDEN — server state in useState
const [meetings, setMeetings] = useState<Meeting[]>([]);
useEffect(() => { fetchMeetings().then(setMeetings); }, []);

// ✅ CORRECT — TanStack Query owns server state
const { data: meetings, isLoading } = useQuery({
  queryKey: ["meetings"],
  queryFn: () => fetchMeetingsList(),
});
```

Zustand is for UI-only state that doesn't belong in the server cache:

```typescript
// ✅ CORRECT Zustand use cases
interface RecordingStore {
  isRecording: boolean;
  elapsedSeconds: number;
  setRecording: (v: boolean) => void;
}
```

---

## Rule #5 — Audio recording always goes through the useRecording hook

Never call `expo-audio` APIs directly in screens.
All recording logic lives in `@/lib/hooks/useRecording`.

```typescript
// ❌ FORBIDDEN — expo-audio directly in screen
import { useAudioRecorder } from "expo-audio";
const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

// ✅ CORRECT — use the centralised hook
import { useRecording } from "@/lib/hooks/useRecording";
const { start, stop, isRecording } = useRecording();
```

The hook is responsible for permissions, recorder lifecycle, and
returning a local file URI ready for upload.

---

## Rule #6 — File uploads use the dedicated upload helper

Never construct `FormData` for audio uploads in screens or hooks.
Use `api.meetings.upload()` which handles the React Native FormData quirks.

```typescript
// ❌ FORBIDDEN — manual FormData in a screen
const formData = new FormData();
formData.append("audio", { uri, name: "recording.m4a", type: "audio/m4a" } as any);
await fetch(`${BASE_URL}/meetings/upload`, { method: "POST", body: formData });

// ✅ CORRECT — delegate to the api client
const { meetingId } = await api.meetings.upload(uri);
```

---

## Rule #7 — Reusable logic lives in `lib/`

Any function used in more than one file, or that wraps an external library
(expo-audio, expo-notifications, Supabase Auth, AsyncStorage, etc.),
must live under `@/lib/`.

```typescript
// ❌ FORBIDDEN — inline library call in a screen
import * as Notifications from "expo-notifications";
await Notifications.scheduleNotificationAsync({ ... });

// ✅ CORRECT — wrapper in lib/
import { scheduleLocalNotification } from "@/lib/notifications";
await scheduleLocalNotification({ title, body });
```

When adding a new integration, create the wrapper in `lib/` first,
then import it everywhere it is needed.

---

## Rule #8 — Session is always read from Supabase, never stored manually

Never persist or read the JWT manually. The Supabase client (configured with
`AsyncStorage`) handles session persistence and automatic token refresh.

```typescript
// ❌ FORBIDDEN — manual token management
const token = await AsyncStorage.getItem("access_token");

// ✅ CORRECT — always from the Supabase session
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

The `api-client.ts` already calls `getSession()` before every request.
No screen or hook should read the token directly.

---

## Rule #9 — Push notification token saved on sign-in, never on demand

Register and persist the push notification token once, immediately after
the user signs in. Never request it in the middle of a user flow.

```typescript
// ❌ FORBIDDEN — requesting push token inside a screen on user action
const token = await registerForPushNotificationsAsync();

// ✅ CORRECT — registered once in the auth flow
// lib/notifications.ts — called once in the post-login effect
export async function registerPushToken(userId: string): Promise<void> {
  const token = await getPushTokenOrNull();
  if (!token) return;
  await api.users.savePushToken(token);
}
```

---

## Meeting status — fixed enum (mirrors the web API)

```
pending → processing → completed
                     → failed
```

Never compare status as a raw string outside of type definitions or mapping functions.

---

## Folder structure

```
app/                              ← Expo Router — ONLY .tsx screens and *-api.ts helpers here
  (auth)/
    login.tsx
    login-api.ts
    register.tsx
    register-api.ts
  (app)/
    _layout.tsx                   ← Tab navigator, auth guard
    index.tsx                     ← Dashboard
    home-api.ts
    meetings/
      index.tsx                   ← Meeting list
      meetings-api.ts
      [id]/
        index.tsx                 ← Meeting detail
        meeting-detail-api.ts
      record.tsx                  ← Audio recording screen
      record-api.ts
    settings.tsx
    settings-api.ts

tests/                            ← ALL test files live here, never inside app/
  api/
    login-api.test.ts
    register-api.test.ts
    home-api.test.ts
    meetings-api.test.ts
    meeting-detail-api.test.ts
    record-api.test.ts
    settings-api.test.ts
  no-test-files-in-app.test.mjs   ← regression: asserts no *.test.ts exists inside app/

lib/
  api-client.ts                   ← Typed HTTP client (token injection, error handling)
  supabase.ts                     ← Supabase client (Auth only, AsyncStorage session)
  hooks/
    useRecording.ts               ← expo-audio abstraction
    useSession.ts                 ← Supabase session observer
  notifications.ts                ← expo-notifications abstraction
  utils.ts                        ← formatDate, formatRelativeTime, etc.

components/                       ← UI only, no API calls, no lib/hooks with side effects
store/
  recording.ts                    ← Zustand: recording UI state
  ui.ts                           ← Zustand: global UI flags (e.g. upload progress)
```

---

## Code Quality Rules

- **Maximum function length: 50 lines.** If a function exceeds this, extract a named helper.
- **Maximum cyclomatic complexity: 8.** Deeply nested conditionals must be refactored.
- **Prefer small, composable functions.** Each function should do one thing.

```typescript
// ❌ AVOID
async function recordAndUpload() {
  // 80 lines mixing recording, permissions, upload and navigation
}

// ✅ PREFER
const uri      = await stop();
const { meetingId } = await api.meetings.upload(uri);
await invalidateMeetings();
router.push(`/meetings/${meetingId}`);
```

---

## TypeScript Strictness

Trust the type system. Do not write code that second-guesses types that are
already proven non-null by the compiler or by prior validation.

- **Do NOT use optional chaining (`?.`) on non-nullable types.**
- **Do NOT use nullish coalescing (`??`) when a value is guaranteed to exist.**
- **If a value may be null, express it explicitly in the type** — `string | null`, not `string` with a defensive `?? ""` at every call site.

```typescript
// ❌ AVOID
function greet(name: string) {
  return `Olá, ${name?.trim()}`;
}

// ✅ CORRECT
function greet(name: string) {
  return `Olá, ${name.trim()}`;
}
```

---

## AI Code Guidelines

- **Do not introduce redundant null checks.** If a value cannot be null at that point, do not check for null.
- **Do not add `try/catch` blocks unless the function explicitly needs error handling.** Let errors propagate to TanStack Query's `onError` or the nearest handler.
- **Avoid overly defensive patterns** such as `if (!array) return []` when the type guarantees `array` is always an array.
- **Do not silently swallow errors with empty `catch` blocks.**
- **Do not call `api.*` directly in components.** Always go through the companion `screen-name-api.ts`.

---

## Pre-generation checklist

Before writing any code, verify:

- [ ] Does this code query Supabase with `.from()`? → **Forbidden.** Call the web API instead.
- [ ] Does this code call `fetch` directly? → Must go through `@/lib/api-client`.
- [ ] Is this a new screen? → Create `screen-name-api.ts` alongside it inside `app/`, and `screen-name-api.test.ts` inside `tests/api/`.
- [ ] Is this a test file? → It must live in `tests/`, **never** inside `app/` (Expo Router bundles everything in `app/` and breaks the web target with `node:test`).
- [ ] Does the screen manage server data in `useState`? → Use TanStack Query.
- [ ] Does the screen use expo-audio directly? → Use `@/lib/hooks/useRecording`.
- [ ] Does the screen construct `FormData` for upload? → Use `api.meetings.upload()`.
- [ ] Does this interact with an external library? → Must live in or import from `lib/`.
- [ ] Does a `lib/` helper already exist for this? → Use it, do not rewrite it.
- [ ] Is any function longer than 50 lines? → Extract named helpers.
- [ ] Is there optional chaining on a non-nullable type? → Remove it.
- [ ] Is there a null check on a value the type guarantees exists? → Remove it.