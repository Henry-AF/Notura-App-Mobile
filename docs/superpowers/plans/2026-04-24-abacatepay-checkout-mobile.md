# AbacatePay Checkout Mobile Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the pricing modal to the AbacatePay checkout flow and unlock plan behavior only from backend-verified user data.

**Architecture:** Add typed AbacatePay endpoints to the central API client, then expose them through a pricing companion helper beside the modal. The modal enables checkout only for the current AbacatePay-supported plans (`pro` and `team`), manages browser opening, explicit payment verification, loading states, alerts, and TanStack Query invalidation while leaving plan truth in `GET /api/user/me` and dashboard overview data.

**Tech Stack:** Expo React Native, React Native Linking, TanStack Query, Notura typed API client, Node test runner.

---

## Chunk 1: API client and helper

### Task 1: Lock AbacatePay helper behavior with a failing test

**Files:**
- Create: `artifacts/notura/tests/api/pricing-api.test.ts`
- Create: `artifacts/notura/components/pricing-api.ts`
- Modify: `artifacts/notura/lib/api-client.ts`

- [ ] **Step 1: Write the failing test**
Create `pricing-api.test.ts` with tests that call `startAbacatePayCheckout("pro", provider)` and `verifyAbacatePayCheckout(provider)`.

```ts
test("startAbacatePayCheckout envia o plano para o provider", async () => {
  let receivedPlan: unknown;
  const result = await startAbacatePayCheckout("pro", async (plan) => {
    receivedPlan = plan;
    return { checkoutUrl: "https://checkout.abacatepay.test/session" };
  });

  assert.equal(receivedPlan, "pro");
  assert.deepEqual(result, { checkoutUrl: "https://checkout.abacatepay.test/session" });
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
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test artifacts/notura/tests/api/pricing-api.test.ts`
Expected: FAIL because `pricing-api.ts` does not exist yet.

- [ ] **Step 3: Add typed API client methods**
In `api-client.ts`, add:
- `AbacatePayCheckoutRequest`
- `AbacatePayCheckoutResponse`
- `AbacatePayVerifyResponse`
- `api.abacatepay.checkout(plan)` posting only supported checkout plans to `/api/abacatepay/checkout`
- `api.abacatepay.verify()` posting to `/api/abacatepay/checkout/verify` with no body

- [ ] **Step 4: Add companion helper**
Create `components/pricing-api.ts` exporting `startAbacatePayCheckout` and `verifyAbacatePayCheckout`, defaulting to `api.abacatepay.*` providers.

- [ ] **Step 5: Run test to verify it passes**
Run: `node --test artifacts/notura/tests/api/pricing-api.test.ts`
Expected: PASS.

## Chunk 2: Pricing modal flow

### Task 2: Verify browser-return flow and replace static checkout URLs

**Files:**
- Modify: `artifacts/notura/tests/pricing-modal.test.mjs`
- Modify: `artifacts/notura/components/PricingModal.tsx`

- [ ] **Step 1: Write failing regression assertions**
Extend `pricing-modal.test.mjs` to assert:
- `EXPO_PUBLIC_PRO_CHECKOUT_URL` and `EXPO_PUBLIC_PLATINUM_CHECKOUT_URL` are absent.
- `startAbacatePayCheckout` is imported/used.
- checkout stays pending after external checkout opening and `verifyAbacatePayCheckout` is called from an explicit verification action.
- `invalidateQueries` appears for `["user-me"]` and `["home-overview"]`.

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test artifacts/notura/tests/pricing-modal.test.mjs`
Expected: FAIL because the modal still reads static env checkout URLs.

- [ ] **Step 3: Implement modal flow**
Update the modal to:
- use `useQueryClient()`;
- track `loadingPlan` and `isVerifying`;
- call `startAbacatePayCheckout(planId)` only for AbacatePay-supported checkout plans;
- handle `alreadyActive` by invalidating queries and closing;
- open `checkoutUrl` with `Linking.openURL` on native and `window.location.assign` on web;
- call `verifyAbacatePayCheckout()` only after the user taps the pending verification action;
- invalidate `["user-me"]` and `["home-overview"]` after verify succeeds;
- show alerts on checkout or verify failures.

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test artifacts/notura/tests/pricing-modal.test.mjs`
Expected: PASS.

## Chunk 3: Verification

### Task 3: Run focused and broad checks

**Files:**
- Test only.

- [ ] **Step 1: Run billing tests**
Run: `node --test artifacts/notura/tests/api/pricing-api.test.ts artifacts/notura/tests/pricing-modal.test.mjs`
Expected: PASS.

- [ ] **Step 2: Run architecture guard**
Run: `node --test artifacts/notura/tests/no-test-files-in-app.test.mjs`
Expected: PASS.

- [ ] **Step 3: Run typecheck**
Run: `pnpm --filter @workspace/notura run typecheck`
Expected: PASS.
