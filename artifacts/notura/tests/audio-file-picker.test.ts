import assert from "node:assert/strict";
import test from "node:test";

import { pickAudioFile } from "../lib/audio-file-picker.ts";

test("pickAudioFile returns the selected audio asset from the document picker", async () => {
  const file = await pickAudioFile({
    getDocumentAsync: async (options) => {
      assert.deepEqual(options, {
        type: "audio/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      return {
        canceled: false,
        assets: [
          {
            uri: "file:///cache/reuniao.m4a",
            name: "reuniao.m4a",
            mimeType: "audio/mp4",
            size: 4096,
          },
        ],
      };
    },
  });

  assert.deepEqual(file, {
    uri: "file:///cache/reuniao.m4a",
    name: "reuniao.m4a",
    mimeType: "audio/mp4",
    size: 4096,
  });
});

test("pickAudioFile returns null when the user cancels the picker", async () => {
  const file = await pickAudioFile({
    getDocumentAsync: async () => ({
      canceled: true,
      assets: null,
    }),
  });

  assert.equal(file, null);
});
