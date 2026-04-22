import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const screensUsingNavbar = [
  "artifacts/notura/app/(tabs)/index.tsx",
  "artifacts/notura/app/(tabs)/analytics.tsx",
  "artifacts/notura/app/(tabs)/search.tsx",
  "artifacts/notura/app/(tabs)/spaces.tsx",
  "artifacts/notura/app/(tabs)/profile.tsx",
  "artifacts/notura/app/highlights.tsx",
  "artifacts/notura/app/record.tsx",
  "artifacts/notura/app/conversation/[id].tsx",
];

test("core app screens should use shared AppNavbar", () => {
  for (const relativePath of screensUsingNavbar) {
    const absPath = resolve(process.cwd(), relativePath);
    const source = readFileSync(absPath, "utf8");
    assert.ok(
      source.includes("AppNavbar"),
      `Expected ${relativePath} to use the shared AppNavbar component`
    );
    assert.ok(
      source.includes("title="),
      `Expected ${relativePath} to pass a title to AppNavbar`
    );
  }
});
