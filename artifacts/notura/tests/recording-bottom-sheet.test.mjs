import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tabLayoutPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/_layout.tsx");
const tabLayoutSource = readFileSync(tabLayoutPath, "utf8");

const bottomSheetPath = resolve(process.cwd(), "artifacts/notura/components/RecordingBottomSheet.tsx");
const floatingIndicatorPath = resolve(process.cwd(), "artifacts/notura/components/RecordingFloatingIndicator.tsx");
const storePath = resolve(process.cwd(), "artifacts/notura/stores/useRecordingStore.ts");

test("tabs layout should mount the global recording sheet and floating indicator", () => {
  assert.ok(
    tabLayoutSource.includes("RecordingBottomSheet"),
    "Expected tabs layout to mount the recording bottom sheet globally"
  );
  assert.ok(
    tabLayoutSource.includes("RecordingFloatingIndicator"),
    "Expected tabs layout to mount the recording floating indicator globally"
  );
  assert.ok(
    tabLayoutSource.includes("NewMeetingBottomSheet") &&
      tabLayoutSource.includes("UploadMeetingBottomSheet"),
    "Expected tabs layout to mount the new meeting entry and upload bottom sheets globally"
  );
});

test("recording flow should be backed by a zustand store with reopen behavior", () => {
  const bottomSheetSource = readFileSync(bottomSheetPath, "utf8");
  const floatingIndicatorSource = readFileSync(floatingIndicatorPath, "utf8");
  const storeSource = readFileSync(storePath, "utf8");

  assert.ok(
    storeSource.includes('from "zustand"'),
    "Expected recording flow to use zustand for global state"
  );
  assert.ok(
    storeSource.includes("sheetState") &&
      storeSource.includes('"hidden"') &&
      storeSource.includes('"partial"') &&
      storeSource.includes('"expanded"'),
    "Expected recording store to model hidden, partial, and expanded sheet states"
  );
  assert.ok(
    storeSource.includes("openRecordingSheet") &&
      storeSource.includes("closeRecordingSheet") &&
      storeSource.includes("expandRecordingSheet") &&
      storeSource.includes("startRecordingSession") &&
      storeSource.includes("pauseRecordingSession") &&
      storeSource.includes("resumeRecordingSession") &&
      storeSource.includes("stopRecordingSession") &&
      storeSource.includes("completedRecording") &&
      storeSource.includes("setCompletedRecording") &&
      storeSource.includes("clearCompletedRecording"),
    "Expected recording store to expose full sheet and recording lifecycle actions"
  );
  assert.ok(
    bottomSheetSource.includes("useRecordingStore"),
    "Expected bottom sheet to read state from the recording store"
  );
  assert.ok(
    floatingIndicatorSource.includes("useRecordingStore"),
    "Expected floating indicator to read state from the recording store"
  );
  assert.ok(
    floatingIndicatorSource.includes("openRecordingSheet"),
    "Expected tapping the floating indicator to reopen the recording sheet"
  );
  assert.ok(
    floatingIndicatorSource.includes("elapsedSeconds"),
    "Expected floating indicator to show the current recording timer"
  );
  assert.ok(
    floatingIndicatorSource.includes("status === \"recording\"") ||
      floatingIndicatorSource.includes("status !== \"idle\""),
    "Expected floating indicator visibility to depend on the recording status"
  );
  assert.ok(
    floatingIndicatorSource.includes('sheetState === "hidden"'),
    "Expected floating indicator to appear only when the sheet is fully hidden"
  );
  assert.ok(
    bottomSheetSource.includes('from "zustand/react/shallow"') &&
      floatingIndicatorSource.includes('from "zustand/react/shallow"'),
    "Expected zustand object selectors to use useShallow to avoid render loops"
  );
  assert.ok(
    bottomSheetSource.includes('useShallow((state) => ({') &&
      floatingIndicatorSource.includes('useShallow((state) => ({'),
    "Expected recording components to wrap object selectors with useShallow"
  );
  assert.ok(
    bottomSheetSource.includes("PanResponder.create") &&
      bottomSheetSource.includes("gestureState.dy") &&
      bottomSheetSource.includes("closeRecordingSheet()") &&
      bottomSheetSource.includes("expandRecordingSheet"),
    "Expected the recording sheet gesture to choose between fully dismissing and expanding"
  );
  assert.ok(
    bottomSheetSource.includes('sheetState === "hidden"') ||
      bottomSheetSource.includes('sheetState !== "hidden"'),
    "Expected bottom sheet rendering to branch on explicit hidden state"
  );
  assert.ok(
    !floatingIndicatorSource.includes("Animated.loop") &&
      !floatingIndicatorSource.includes("pulseAnim"),
    "Expected floating indicator to avoid the pulsing bounce animation"
  );
  assert.ok(
    !bottomSheetSource.includes("RECORDING_PARTICIPANTS") &&
      !bottomSheetSource.includes("RECORDING_LIVE_LINES") &&
      !bottomSheetSource.includes("Transcrição ao vivo"),
    "Expected recording sheet to stop rendering live transcript and participant mocks"
  );
  assert.ok(
    !storeSource.includes("visibleLines") &&
      !storeSource.includes("activeSpeaker") &&
      !storeSource.includes("transcriptTimer"),
    "Expected recording store to remove transcript and participant-only state"
  );
  assert.ok(
    bottomSheetSource.includes("WaveformBars") &&
      bottomSheetSource.includes('Parar') &&
      bottomSheetSource.includes("startRecordingSession"),
    "Expected recording sheet to stay focused on waveform and core recording controls"
  );
});
