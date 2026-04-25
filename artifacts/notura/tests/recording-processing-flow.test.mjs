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
    bottomSheetSource.includes("Alert.alert(") &&
      bottomSheetSource.includes('"Descartar gravação"') &&
      bottomSheetSource.includes('"Essa ação remove o áudio local gravado."'),
    "Expected discard flow to require explicit confirmation"
  );
  assert.ok(
    bottomSheetSource.includes("const localUri = completedRecording.localUri"),
    "Expected discard confirmation to capture the local recording URI before deleting"
  );
  assert.ok(
    bottomSheetSource.includes("async function discardLocalRecording(localUri: string)") &&
      bottomSheetSource.includes("await deleteLocalRecordingFile(localUri)") &&
      bottomSheetSource.includes("clearCompletedRecording();") &&
      bottomSheetSource.includes("closeRecordingSheet();"),
    "Expected confirmed discard to delete the local file, clear in-memory recording state, and close the sheet"
  );
  assert.ok(
    bottomSheetSource.includes("isDiscardingRecording") &&
      bottomSheetSource.includes("setIsDiscardingRecording(true)") &&
      bottomSheetSource.includes("setIsDiscardingRecording(false)") &&
      bottomSheetSource.includes("disabled={isDiscardingRecording || isProcessingMeeting}"),
    "Expected discard to be idempotent while confirmation or deletion is in progress"
  );
  assert.ok(
    bottomSheetSource.includes('Platform.OS === "web"') &&
      bottomSheetSource.includes("globalThis.confirm") &&
      bottomSheetSource.includes("void discardLocalRecording(localUri)"),
    "Expected web discard confirmation to call deletion without relying on native Alert button callbacks"
  );
});
