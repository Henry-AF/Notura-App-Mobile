import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const conversationSource = readFileSync(conversationPath, "utf8");

test("conversation detail should expose a Decisoes tab fed by API decisions payload", () => {
  assert.ok(
    conversationSource.includes('const TABS = ["Resumo", "Transcrição", "Ações", "Decisões"]'),
    "Expected conversation tabs to replace Destaques with Decisões"
  );
  assert.ok(
    conversationSource.includes('activeTab === "Decisões"'),
    "Expected conversation detail to render Decisões section"
  );
  assert.ok(
    conversationSource.includes("conversation.decisions"),
    "Expected decisions tab to render mapped decisions from API payload"
  );
  assert.ok(
    !conversationSource.includes('activeTab === "Destaques"'),
    "Expected old Destaques tab renderer to be removed"
  );
});
