import assert from "node:assert/strict";
import test from "node:test";

import { processLocalRecording } from "../../app/record-api.ts";

test("processLocalRecording deve orquestrar upload local e iniciar processamento da reuniao", async () => {
  const uploadCalls: Array<{ fileName: string; contentType: string; fileSize: number }> = [];
  const binaryUploadCalls: Array<{ uploadUrl: string; method: string; contentType: string; bodySize: number }> = [];
  const processCalls: Array<{
    clientName: string;
    meetingDate: string;
    r2Key: string;
    uploadToken: string;
    whatsappNumber: string | null | undefined;
  }> = [];

  const result = await processLocalRecording(
    {
      localUri: "file:///data/user/0/notura/cache/meeting-audio.m4a",
      clientName: "Cliente Teste",
      meetingDate: "2026-04-23",
      whatsappNumber: "5511999999999",
    },
    {
      readLocalFile: async () => ({
        fileName: "meeting-audio.m4a",
        contentType: "audio/mp4",
        fileSize: 2048,
        body: new Uint8Array([1, 2, 3, 4]),
      }),
      requestUploadTicket: async (payload) => {
        uploadCalls.push(payload);
        return {
          r2Key: "meetings/user-1/meeting-audio.m4a",
          uploadUrl: "https://r2.example/upload",
          uploadToken: "upload-token-1",
          method: "PUT",
          expiresInSeconds: 900,
        };
      },
      uploadBinary: async ({ uploadUrl, method, contentType, body }) => {
        const bodySize = body instanceof Uint8Array ? body.byteLength : 0;
        binaryUploadCalls.push({ uploadUrl, method, contentType, bodySize });
      },
      requestProcessing: async (payload) => {
        processCalls.push(payload);
        return {
          meetingId: "meeting-123",
          status: "pending",
        };
      },
    },
  );

  assert.deepEqual(uploadCalls, [
    {
      fileName: "meeting-audio.m4a",
      contentType: "audio/mp4",
      fileSize: 2048,
    },
  ]);
  assert.deepEqual(binaryUploadCalls, [
    {
      uploadUrl: "https://r2.example/upload",
      method: "PUT",
      contentType: "audio/mp4",
      bodySize: 4,
    },
  ]);
  assert.deepEqual(processCalls, [
    {
      clientName: "Cliente Teste",
      meetingDate: "2026-04-23",
      r2Key: "meetings/user-1/meeting-audio.m4a",
      uploadToken: "upload-token-1",
      whatsappNumber: "5511999999999",
    },
  ]);
  assert.equal(result.meetingId, "meeting-123");
  assert.equal(result.status, "pending");
});
