import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const contextPath = resolve(process.cwd(), "artifacts/notura/context/AppContext.tsx");
const mockDataPath = resolve(process.cwd(), "artifacts/notura/lib/mockData.ts");

const conversationSource = readFileSync(conversationPath, "utf8");
const contextSource = readFileSync(contextPath, "utf8");
const mockDataSource = readFileSync(mockDataPath, "utf8");

test("actions tab should render grouped expandable sections instead of a checkbox list", () => {
  assert.ok(
    conversationSource.includes("A fazer") &&
      conversationSource.includes("Em andamento") &&
      conversationSource.includes("Concluído"),
    "Expected actions tab to expose the three grouped states"
  );
  assert.ok(
    conversationSource.includes("expandedActionGroups"),
    "Expected actions tab to track expanded or collapsed groups"
  );
  assert.ok(
    !conversationSource.includes("checkbox"),
    "Expected actions tab to remove the old checkbox list UI"
  );
});

test("actions tab should expose a bottom sheet editor for moving and editing tasks", () => {
  assert.ok(
    conversationSource.includes("Modal"),
    "Expected actions tab to use a modal bottom sheet"
  );
  assert.ok(
    conversationSource.includes("selectedAction"),
    "Expected actions tab to manage a selected action for editing"
  );
  assert.ok(
    conversationSource.includes("Salvar") &&
      conversationSource.includes("Excluir") &&
      conversationSource.includes("Descrição") &&
      conversationSource.includes("Vencimento"),
    "Expected bottom sheet to expose save, delete, description, and due date controls"
  );
  assert.ok(
    conversationSource.includes("updateActionItem") &&
      conversationSource.includes("removeActionItem"),
    "Expected actions bottom sheet to update and delete tasks through context"
  );
  assert.ok(
    conversationSource.includes("useMutation") &&
      conversationSource.includes("updateMeetingTask") &&
      conversationSource.includes("deleteMeetingTask"),
    "Expected actions bottom sheet to persist edits through API mutations"
  );
});

test("action items should support explicit status and richer editing fields", () => {
  assert.ok(
    mockDataSource.includes('export type ActionItemStatus = "todo" | "in_progress" | "done"'),
    "Expected action item model to expose explicit task statuses"
  );
  assert.ok(
    mockDataSource.includes("status: ActionItemStatus") &&
      mockDataSource.includes("description?: string"),
    "Expected action items to support status and description fields"
  );
  assert.ok(
    contextSource.includes("updateActionItem") &&
      contextSource.includes("removeActionItem"),
    "Expected app context to expose action item update and delete operations"
  );
});
