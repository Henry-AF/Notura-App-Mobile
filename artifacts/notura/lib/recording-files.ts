import { File } from "expo-file-system";

export interface LocalRecordingFile {
  fileName: string;
  contentType: string;
  fileSize: number;
  body: Uint8Array;
}

function sanitizeFileName(fileName: string) {
  const decoded = decodeURIComponent(fileName);
  const clean = decoded.split("?")[0]?.trim() ?? "";
  return clean.length > 0 ? clean : "recording.m4a";
}

function inferAudioContentType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "m4a":
    case "mp4":
      return "audio/mp4";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "webm":
      return "audio/webm";
    default:
      return "application/octet-stream";
  }
}

function resolveFileName(uri: string) {
  const segment = uri.split("/").pop() ?? "";
  return sanitizeFileName(segment);
}

export async function readLocalRecordingFile(uri: string): Promise<LocalRecordingFile> {
  const file = new File(uri);
  const info = file.info();

  if (!info.exists) {
    throw new Error("Arquivo local da gravação não encontrado.");
  }

  const body = await file.bytes();
  const fileName = resolveFileName(uri);
  const contentType = inferAudioContentType(fileName);
  const fileSize = info.size ?? body.byteLength;

  return {
    fileName,
    contentType,
    fileSize,
    body,
  };
}

export async function deleteLocalRecordingFile(uri: string) {
  if (uri.trim().length === 0) return;

  const file = new File(uri);
  if (!file.exists) return;
  file.delete();
}
