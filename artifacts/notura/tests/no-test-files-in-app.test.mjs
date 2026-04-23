import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const appDir = resolve(process.cwd(), "artifacts/notura/app");

function collectAppFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const absolute = join(dir, entry);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      files.push(...collectAppFiles(absolute));
      continue;
    }

    files.push(absolute);
  }

  return files;
}

test("app/ nao deve conter arquivos *.test.ts (evita inclusão no bundle do expo-router)", () => {
  const appFiles = collectAppFiles(appDir);
  const testFiles = appFiles.filter((file) => file.endsWith(".test.ts"));

  assert.equal(
    testFiles.length,
    0,
    `Arquivos de teste dentro de app/: ${testFiles.join(", ")}`,
  );
});

