import assert from "node:assert/strict";
import test from "node:test";

import { createSupabaseAuthStorage } from "../../lib/auth-storage.ts";

type MemoryStorage = {
  data: Record<string, string>;
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createMemoryStorage(): MemoryStorage {
  const data: Record<string, string> = {};

  return {
    data,
    getItem: async (key: string) => (key in data ? data[key] : null),
    setItem: async (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: async (key: string) => {
      delete data[key];
    },
  };
}

test("createSupabaseAuthStorage deve espelhar sessao em cookie no web", async () => {
  const baseStorage = createMemoryStorage();
  const cookieJar: Record<string, string> = {};

  const storage = createSupabaseAuthStorage(baseStorage, {
    isWeb: true,
    setCookie: (key, value) => {
      cookieJar[key] = value;
    },
    removeCookie: (key) => {
      delete cookieJar[key];
    },
  });

  await storage.setItem("sb-test-auth-token", '{"access_token":"a","refresh_token":"r"}');
  assert.equal(
    cookieJar["sb-test-auth-token"],
    '{"access_token":"a","refresh_token":"r"}',
  );

  await storage.removeItem("sb-test-auth-token");
  assert.equal(cookieJar["sb-test-auth-token"], undefined);
});

