import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const conversationSource = readFileSync(conversationPath, "utf8");

test("conversation detail should not add hooks after guarded early returns", () => {
  assert.ok(
    !conversationSource.includes("useMemo(() =>"),
    "Expected conversation detail screen to avoid useMemo in grouped actions and keep hook order stable"
  );
});
