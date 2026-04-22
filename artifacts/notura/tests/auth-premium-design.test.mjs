import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const authScreenPath = resolve(process.cwd(), "artifacts/notura/app/auth.tsx");
const authScreenSource = readFileSync(authScreenPath, "utf8");

test("auth screen should use an executive premium layout in Portuguese", () => {
  assert.ok(
    authScreenSource.includes("Entre com clareza.") &&
      authScreenSource.includes("Workspace de reuniões com memória organizada"),
    "Expected auth screen to introduce an executive premium hero"
  );
  assert.ok(
    authScreenSource.includes("Entrar") &&
      authScreenSource.includes("Criar conta"),
    "Expected auth screen to use Portuguese segmented actions"
  );
  assert.ok(
    !authScreenSource.includes('Feather name="mic"'),
    "Expected auth screen to remove the old microphone logo icon"
  );
  assert.ok(
    !authScreenSource.includes("AI Meeting Assistant"),
    "Expected auth screen to remove the generic old tagline"
  );
  assert.ok(
    authScreenSource.includes("heroPanel") &&
      authScreenSource.includes("metricRow") &&
      authScreenSource.includes("cardHeader"),
    "Expected auth screen to define the richer premium layout structure"
  );
});
