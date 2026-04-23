import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback } from "react";

export interface CompletedRecording {
  uri: string;
  durationMillis: number;
}

export function useRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);

  const ensurePermissions = useCallback(async () => {
    const permission = await requestRecordingPermissionsAsync();
    return permission.granted;
  }, []);

  const start = useCallback(async () => {
    const granted = await ensurePermissions();
    if (!granted) {
      throw new Error("Permissão de microfone não concedida.");
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [ensurePermissions, recorder]);

  const pause = useCallback(() => {
    recorder.pause();
  }, [recorder]);

  const resume = useCallback(() => {
    recorder.record();
  }, [recorder]);

  const stop = useCallback(async () => {
    await recorder.stop();
    const finalState = recorder.getStatus();
    await setAudioModeAsync({
      allowsRecording: false,
    });

    const uri = recorder.uri ?? finalState.url;
    if (!uri) {
      throw new Error("Não foi possível localizar o arquivo gravado.");
    }

    return {
      uri,
      durationMillis: finalState.durationMillis,
    } satisfies CompletedRecording;
  }, [recorder]);

  return {
    canRecord: recorderState.canRecord,
    isRecording: recorderState.isRecording,
    durationMillis: recorderState.durationMillis,
    ensurePermissions,
    start,
    pause,
    resume,
    stop,
  };
}
