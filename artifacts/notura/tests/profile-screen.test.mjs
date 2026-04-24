import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const profileScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/profile.tsx");
const profileScreenSource = readFileSync(profileScreenPath, "utf8");

test("profile screen should keep a cleaner structure focused on profile, whatsapp and preferences", () => {
  assert.ok(
    profileScreenSource.includes("WhatsApp"),
    "Expected profile screen to keep WhatsApp in integrations"
  );
  assert.ok(
    profileScreenSource.includes("Preferencias"),
    "Expected profile screen to keep the preferences section"
  );
  assert.ok(
    !profileScreenSource.includes("Pastas"),
    "Expected profile screen to remove the folders section"
  );
  assert.ok(
    !profileScreenSource.includes("Minha Equipe"),
    "Expected profile screen to remove the team section"
  );
  assert.ok(
    profileScreenSource.includes('showBackButton'),
    "Expected profile screen to enable the left back button in the navbar"
  );
  assert.ok(
    !profileScreenSource.includes("Produtividade avancada liberada"),
    "Expected profile screen to remove the old premium support copy"
  );
  assert.ok(
    profileScreenSource.includes("Switch"),
    "Expected profile screen to keep using the native Switch component"
  );
});
