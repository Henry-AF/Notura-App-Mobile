import assert from "node:assert/strict";
import test from "node:test";

import {
  startAbacatePayCheckout,
  verifyAbacatePayCheckout,
} from "../../components/pricing-api.ts";

test("startAbacatePayCheckout envia o plano para o provider", async () => {
  let receivedPlan: unknown;

  const result = await startAbacatePayCheckout("pro", async (plan) => {
    receivedPlan = plan;
    return { checkoutUrl: "https://checkout.abacatepay.test/session" };
  });

  assert.equal(receivedPlan, "pro");
  assert.deepEqual(result, {
    checkoutUrl: "https://checkout.abacatepay.test/session",
  });
});

test("startAbacatePayCheckout permite checkout do plano team", async () => {
  let receivedPlan: unknown;

  const result = await startAbacatePayCheckout("team", async (plan) => {
    receivedPlan = plan;
    return { checkoutUrl: "https://checkout.abacatepay.test/team-session" };
  });

  assert.equal(receivedPlan, "team");
  assert.deepEqual(result, {
    checkoutUrl: "https://checkout.abacatepay.test/team-session",
  });
});

test("verifyAbacatePayCheckout chama verify sem body", async () => {
  let called = 0;

  const result = await verifyAbacatePayCheckout(async () => {
    called += 1;
    return { success: true, plan: "pro" };
  });

  assert.equal(called, 1);
  assert.deepEqual(result, { success: true, plan: "pro" });
});
