import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const conversationSource = readFileSync(conversationPath, "utf8");

test("conversation detail should load meeting data from API helper through TanStack Query", () => {
  assert.ok(
    conversationSource.includes("useQuery"),
    "Expected conversation screen to use TanStack Query for server state"
  );
  assert.ok(
    conversationSource.includes("fetchMeetingDetail"),
    "Expected conversation screen to fetch detail via companion meeting-detail-api helper"
  );
  assert.ok(
    conversationSource.includes('queryKey: ["meeting-detail", id]'),
    "Expected conversation screen to use a stable query key scoped by id"
  );
  assert.ok(
    !conversationSource.includes("conversations.find("),
    "Expected conversation screen to stop sourcing details from AppContext conversations"
  );
});

test("conversation detail should render a dedicated content skeleton while meeting data is pending", () => {
  assert.ok(
    conversationSource.includes("ConversationDetailContentSkeleton"),
    "Expected conversation screen to define a dedicated content skeleton for the pending state"
  );
  assert.ok(
    !conversationSource.includes("Carregando reunião..."),
    "Expected pending UI to replace the old centered loading label with skeleton content"
  );
});
