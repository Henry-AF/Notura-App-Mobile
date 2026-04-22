import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/index.tsx");
const homeScreenSource = readFileSync(homeScreenPath, "utf8");

test("home greeting should prioritize user name and processed meetings today", () => {
  assert.ok(
    homeScreenSource.includes("Sua inteligência processou"),
    "Expected home greeting to include the processed meetings message"
  );
  assert.ok(
    homeScreenSource.includes("emoji"),
    "Expected home greeting to include period-based emoji support"
  );
  assert.ok(
    !homeScreenSource.includes("produtivos"),
    "Expected large productivity headline to be removed from greeting"
  );
});
