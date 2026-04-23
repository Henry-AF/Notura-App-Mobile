import {
  api,
  type MeetingProcessResponse,
  type MeetingProcessRequest,
  type MeetingUploadRequest,
  type MeetingUploadResponse,
} from "../lib/api-client.ts";

export interface LocalRecordingFile {
  fileName: string;
  contentType: string;
  fileSize: number;
  body: BodyInit | Uint8Array;
}

export interface ProcessLocalRecordingInput {
  localUri: string;
  clientName: string;
  meetingDate: string;
  whatsappNumber?: string | null;
}

export interface UploadBinaryInput {
  uploadUrl: string;
  method: string;
  contentType: string;
  body: BodyInit | Uint8Array;
}

export interface ProcessLocalRecordingDependencies {
  readLocalFile?: (localUri: string) => Promise<LocalRecordingFile>;
  requestUploadTicket?: (
    payload: MeetingUploadRequest,
  ) => Promise<MeetingUploadResponse>;
  uploadBinary?: (input: UploadBinaryInput) => Promise<void>;
  requestProcessing?: (
    payload: MeetingProcessRequest,
  ) => Promise<MeetingProcessResponse>;
}

async function defaultReadLocalRecordingFile(localUri: string): Promise<LocalRecordingFile> {
  const module = await import("../lib/recording-files.ts");
  return module.readLocalRecordingFile(localUri);
}

export async function uploadRecordingBinary(
  input: UploadBinaryInput,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl(input.uploadUrl, {
    method: input.method,
    headers: {
      "content-type": input.contentType,
    },
    body: input.body as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Falha ao enviar áudio para storage (${response.status}).`);
  }
}

export async function processLocalRecording(
  input: ProcessLocalRecordingInput,
  dependencies: ProcessLocalRecordingDependencies = {},
): Promise<MeetingProcessResponse> {
  const readLocalFile =
    dependencies.readLocalFile ?? defaultReadLocalRecordingFile;
  const requestUploadTicket = dependencies.requestUploadTicket ?? api.meetings.upload;
  const uploadBinary = dependencies.uploadBinary ?? ((payload) => uploadRecordingBinary(payload));
  const requestProcessing = dependencies.requestProcessing ?? api.meetings.process;

  const localFile = await readLocalFile(input.localUri);
  const uploadTicket = await requestUploadTicket({
    fileName: localFile.fileName,
    contentType: localFile.contentType,
    fileSize: localFile.fileSize,
  });

  await uploadBinary({
    uploadUrl: uploadTicket.uploadUrl,
    method: uploadTicket.method,
    contentType: localFile.contentType,
    body: localFile.body,
  });

  return requestProcessing({
    clientName: input.clientName,
    meetingDate: input.meetingDate,
    r2Key: uploadTicket.r2Key,
    uploadToken: uploadTicket.uploadToken,
    whatsappNumber: input.whatsappNumber ?? null,
  });
}
