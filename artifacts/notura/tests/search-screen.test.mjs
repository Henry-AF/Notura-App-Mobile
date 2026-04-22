import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const searchScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/search.tsx");
const searchScreenSource = readFileSync(searchScreenPath, "utf8");

test("search screen should not render recent searches section", () => {
  assert.ok(
    !searchScreenSource.includes("Buscas recentes"),
    "Expected search screen to remove the recent searches section"
  );
  assert.ok(
    !searchScreenSource.includes("RECENT_SEARCHES"),
    "Expected search screen to delete recent search constants"
  );
});
