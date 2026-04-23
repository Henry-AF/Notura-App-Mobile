import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bottomSheetPath = resolve(process.cwd(), "artifacts/notura/components/RecordingBottomSheet.tsx");
const bottomSheetSource = readFileSync(bottomSheetPath, "utf8");

test("recording bottom sheet should expose process and discard actions for a finished local recording", () => {
  assert.ok(
    bottomSheetSource.includes("useRecording"),
    "Expected recording sheet to use the shared useRecording hook with expo-audio integration"
  );
  assert.ok(
    bottomSheetSource.includes("scheduleLocalNotification"),
    "Expected recording sheet to trigger local notifications through the lib wrapper"
  );
  assert.ok(
    bottomSheetSource.includes("Processar reunião"),
    "Expected a primary action to process the finished recording"
  );
  assert.ok(
    bottomSheetSource.includes("Descartar reunião"),
    "Expected a discard action to remove the local recording"
  );
  assert.ok(
    bottomSheetSource.includes("Alert.alert(\"Descartar gravação\""),
    "Expected discard flow to require explicit confirmation"
  );
});
