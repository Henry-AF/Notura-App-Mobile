import assert from "node:assert/strict";
import test from "node:test";

import {
  RegisterApiError,
  parseRegisterPayload,
  registerWithPassword,
} from "../../app/(auth)/register-api.ts";

test("parseRegisterPayload deve normalizar campos", () => {
  const parsed = parseRegisterPayload({
    name: "  Maria Silva  ",
    email: "  MARIA@Example.com ",
    password: "12345678",
  });

  assert.equal(parsed.name, "Maria Silva");
  assert.equal(parsed.email, "maria@example.com");
  assert.equal(parsed.password, "12345678");
});

test("parseRegisterPayload deve exigir nome", () => {
  assert.throws(
    () =>
      parseRegisterPayload({
        name: " ",
        email: "maria@example.com",
        password: "12345678",
      }),
    /nome/i,
  );
});

test("registerWithPassword deve repassar erro do Supabase", async () => {
  const auth = {
    signUp: async () => ({
      data: { session: null, user: null },
      error: { message: "E-mail ja cadastrado" },
    }),
  };

  await assert.rejects(
    () =>
      registerWithPassword(
        {
          name: "Maria Silva",
          email: "maria@example.com",
          password: "12345678",
        },
        auth,
      ),
    (error: unknown) => {
      assert.ok(error instanceof RegisterApiError);
      assert.equal(error.message, "E-mail ja cadastrado");
      return true;
    },
  );
});

