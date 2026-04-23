import assert from "node:assert/strict";
import test from "node:test";

import {
  LoginApiError,
  loginWithPassword,
  parseLoginCredentials,
} from "../../app/(auth)/login-api.ts";

test("parseLoginCredentials deve normalizar email e remover espacos", () => {
  const parsed = parseLoginCredentials({
    email: "  USER@Example.com ",
    password: "12345678",
  });

  assert.equal(parsed.email, "user@example.com");
  assert.equal(parsed.password, "12345678");
});

test("parseLoginCredentials deve falhar com email invalido", () => {
  assert.throws(
    () =>
      parseLoginCredentials({
        email: "email-invalido",
        password: "12345678",
      }),
    /email/i,
  );
});

test("loginWithPassword deve repassar erro de autenticacao", async () => {
  const auth = {
    signInWithPassword: async () => ({
      data: { session: null, user: null },
      error: { message: "Credenciais invalidas" },
    }),
  };

  await assert.rejects(
    () =>
      loginWithPassword(
        { email: "user@example.com", password: "12345678" },
        auth,
      ),
    (error: unknown) => {
      assert.ok(error instanceof LoginApiError);
      assert.equal(error.message, "Credenciais invalidas");
      return true;
    },
  );
});

