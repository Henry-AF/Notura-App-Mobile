import assert from "node:assert/strict";
import test from "node:test";

import {
  ApiClientError,
  createApiRequester,
} from "../../lib/api-client.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 200 ? "OK" : "Unauthorized",
    headers: { "content-type": "application/json" },
  });
}

test("createApiRequester deve tentar refresh e retry antes de deslogar em 401", async () => {
  let currentToken = "old-token";
  let fetchCalls = 0;
  let refreshCalls = 0;
  let signOutCalls = 0;

  const requester = createApiRequester({
    baseUrl: "http://localhost:3000",
    fetchImpl: async (_input, init) => {
      fetchCalls += 1;
      const authHeader = new Headers(init?.headers).get("authorization");

      if (fetchCalls === 1) {
        assert.equal(authHeader, "Bearer old-token");
        return jsonResponse({ error: "Nao autenticado." }, 401);
      }

      assert.equal(authHeader, "Bearer new-token");
      return jsonResponse({ ok: true }, 200);
    },
    getAccessToken: async () => currentToken,
    refreshAccessToken: async () => {
      refreshCalls += 1;
      currentToken = "new-token";
      return currentToken;
    },
    signOut: async () => {
      signOutCalls += 1;
    },
  });

  const result = await requester<{ ok: boolean }>("/api/dashboard/overview");

  assert.deepEqual(result, { ok: true });
  assert.equal(fetchCalls, 2);
  assert.equal(refreshCalls, 1);
  assert.equal(signOutCalls, 0);
});

test("createApiRequester deve deslogar se 401 persistir apos refresh", async () => {
  let signOutCalls = 0;

  const requester = createApiRequester({
    baseUrl: "http://localhost:3000",
    fetchImpl: async () => jsonResponse({ error: "Nao autenticado." }, 401),
    getAccessToken: async () => "old-token",
    refreshAccessToken: async () => null,
    signOut: async () => {
      signOutCalls += 1;
    },
  });

  await assert.rejects(
    () => requester("/api/user/me"),
    (error: unknown) => {
      assert.ok(error instanceof ApiClientError);
      assert.equal(error.status, 401);
      return true;
    },
  );

  assert.equal(signOutCalls, 1);
});

