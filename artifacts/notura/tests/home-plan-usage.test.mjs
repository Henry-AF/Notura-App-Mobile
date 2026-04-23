import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/index.tsx");
const homeScreenSource = readFileSync(homeScreenPath, "utf8");

test("home hero card should show monthly plan usage instead of generic task progress", () => {
  assert.ok(
    homeScreenSource.includes("Uso do seu plano"),
    "Expected home hero card to describe plan usage"
  );
  assert.ok(
    homeScreenSource.includes("reuniões disponíveis"),
    "Expected home hero card to mention remaining available meetings"
  );
  assert.ok(
    homeScreenSource.includes("PLANO"),
    "Expected home hero card to make the current plan explicit"
  );
  assert.ok(
    !homeScreenSource.includes("Seus projetos estão indo bem"),
    "Expected old generic project status copy to be removed"
  );
  assert.ok(
    homeScreenSource.includes("free: 3"),
    "Expected home plan limits to cap the free plan at 3 meetings"
  );
  assert.ok(
    homeScreenSource.includes("pro: 30"),
    "Expected home plan limits to cap the pro plan at 30 meetings"
  );
});
