import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const newMeetingSheetPath = resolve(
  process.cwd(),
  "artifacts/notura/components/NewMeetingBottomSheet.tsx",
);
const uploadSheetPath = resolve(
  process.cwd(),
  "artifacts/notura/components/UploadMeetingBottomSheet.tsx",
);
const recordScreenPath = resolve(process.cwd(), "artifacts/notura/app/record.tsx");

const newMeetingSheetSource = readFileSync(newMeetingSheetPath, "utf8");
const uploadSheetSource = readFileSync(uploadSheetPath, "utf8");
const recordScreenSource = readFileSync(recordScreenPath, "utf8");

test("new meeting bottom sheet should offer recording and upload entry points", () => {
  assert.ok(
    newMeetingSheetSource.includes("Gravar nova Reuniao"),
    "Expected the new meeting sheet to offer recording a new meeting"
  );
  assert.ok(
    newMeetingSheetSource.includes("grave suas reunioes direto pelo Notura"),
    "Expected the recording card to explain the direct in-app recording flow"
  );
  assert.ok(
    newMeetingSheetSource.includes("Subir arquivo"),
    "Expected the new meeting sheet to offer uploading an audio file"
  );
  assert.ok(
    newMeetingSheetSource.includes("processe uma reuniao apartir de arquivo de audio."),
    "Expected the upload card to explain audio file processing"
  );
  assert.ok(
    newMeetingSheetSource.includes("openRecordingSheet()") &&
      newMeetingSheetSource.includes("openUploadSheet"),
    "Expected each card to open its respective bottom sheet flow"
  );
  assert.ok(
    newMeetingSheetSource.includes("Animated.spring") &&
      newMeetingSheetSource.includes("translateY") &&
      newMeetingSheetSource.includes("damping: 24") &&
      newMeetingSheetSource.includes("stiffness: 220") &&
      newMeetingSheetSource.includes("mass: 0.9"),
    "Expected the new meeting sheet to reuse the recording sheet spring animation"
  );
});

test("upload sheet and legacy record route should point into the new creation flow", () => {
  assert.ok(
    uploadSheetSource.includes("Importe o audio da reuniao") &&
      uploadSheetSource.includes("Audio externo"),
    "Expected the upload bottom sheet to describe the file import idea"
  );
  assert.ok(
    uploadSheetSource.includes("Animated.spring") &&
      uploadSheetSource.includes("translateY") &&
      uploadSheetSource.includes("damping: 24") &&
      uploadSheetSource.includes("stiffness: 220") &&
      uploadSheetSource.includes("mass: 0.9"),
    "Expected the upload sheet to reuse the recording sheet spring animation"
  );
  assert.ok(
    recordScreenSource.includes("openMeetingEntrySheet") &&
      recordScreenSource.includes("completedRecording !== null") &&
      recordScreenSource.includes('status !== "idle"'),
    "Expected legacy /record access to reuse the new meeting entry while preserving active recording reopen behavior"
  );
});

test("meeting creation sheets should remove the backdrop as soon as they start closing", () => {
  assert.ok(
    newMeetingSheetSource.includes("{isVisible && (") &&
      uploadSheetSource.includes("{isVisible && ("),
    "Expected meeting creation backdrops to render only while the sheet is visible"
  );
});
