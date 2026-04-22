import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tabBarPath = resolve(process.cwd(), "artifacts/notura/components/GlassTabBar.tsx");
const tabBarSource = readFileSync(tabBarPath, "utf8");

test("tab bar should expose only Inicio, Reunioes and Gravar as regular tabs", () => {
  assert.ok(
    tabBarSource.includes('label: "Início"'),
    "Expected tab bar to include Início"
  );
  assert.ok(
    tabBarSource.includes('label: "Reuniões"'),
    "Expected tab bar to include Reuniões"
  );
  assert.ok(
    tabBarSource.includes('label: "Gravar"'),
    "Expected tab bar to include Gravar"
  );
  assert.ok(
    !tabBarSource.includes("RecordFAB"),
    "Expected tab bar to stop using RecordFAB"
  );
  assert.ok(
    !tabBarSource.includes('label: "Buscar"') &&
      !tabBarSource.includes('label: "Análises"') &&
      !tabBarSource.includes('label: "Perfil"'),
    "Expected old tabs to be removed"
  );
  assert.ok(
    tabBarSource.includes("openRecordingSheet"),
    "Expected Gravar tab to open the recording bottom sheet"
  );
  assert.ok(
    !tabBarSource.includes('router.push("/record")'),
    "Expected Gravar tab to stop navigating to /record"
  );
  assert.ok(
    !tabBarSource.includes("recordCircle"),
    "Expected the Gravar tab button to stop using the old red circular accent"
  );
  assert.ok(
    tabBarSource.includes("recordingDot") &&
      tabBarSource.includes('status === "recording"'),
    "Expected the Gravar tab button to render a discrete recording dot only while recording"
  );
});
