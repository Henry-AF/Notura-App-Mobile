import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const conversationSource = readFileSync(conversationPath, "utf8");

test("conversation header should use grouped participant avatars with a count label", () => {
  assert.ok(
    conversationSource.includes("speakerStack"),
    "Expected conversation header to group participant avatars into a stack"
  );
  assert.ok(
    conversationSource.includes("conversation.speakers.length"),
    "Expected conversation header to show the total participant count"
  );
  assert.ok(
    conversationSource.includes('participante{conversation.speakers.length > 1 ? "s" : ""}'),
    "Expected conversation header to pluralize the participant count label"
  );
  assert.ok(
    !conversationSource.includes("sp.name.split"),
    "Expected conversation header to stop rendering individual participant names"
  );
});
