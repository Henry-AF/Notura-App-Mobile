# AbacatePay Checkout Mobile Design

**Date:** 2026-04-24
**Screen:** `artifacts/notura/components/PricingModal.tsx`

## Goal
Integrate the mobile subscription screen with the Notura API AbacatePay checkout flow, ensuring the app only unlocks paid-plan behavior after the backend verifies the checkout and the app refetches plan data from the API.

## Scope
- Replace static checkout URLs in the pricing modal with authenticated API calls.
- Add typed AbacatePay checkout and verify methods to `artifacts/notura/lib/api-client.ts`.
- Add a companion billing helper next to the pricing UI so the modal does not call `api.*` directly.
- After opening a returned `checkoutUrl`, keep the checkout pending and call `/api/abacatepay/checkout/verify` only when the user explicitly taps the verification action after returning to the app.
- Keep AbacatePay checkout enabled only for plans accepted by the current API contract (`pro` and `team`).
- Refresh the cached user/profile and dashboard overview data after a successful verification or an `alreadyActive` response.

## Recommended Approach
Use the existing typed API client plus a small companion helper for the pricing modal.

This matches the mobile architecture rules: screens/components do not call raw `fetch`, screens do not call `api.*` directly, and plan access is derived from the backend-owned user profile rather than from gateway responses.

## Data Flow
1. User taps Pro or the top plan, internally identified as `team`.
2. `PricingModal` calls `startAbacatePayCheckout(plan)` from `pricing-api.ts`.
3. The helper posts `{ plan }` to `/api/abacatepay/checkout`.
4. If the API returns `{ alreadyActive: true, plan }`, the modal refreshes app queries and closes.
5. If the API returns `{ checkoutUrl }`, native opens it with `Linking.openURL`; web redirects the current tab with `window.location.assign`.
6. The modal marks that plan as pending and changes its action to `Verificar pagamento`.
7. When the user taps `Verificar pagamento`, the modal calls `verifyAbacatePayCheckout()`.
8. On successful verify, the modal invalidates `["user-me"]` and `["home-overview"]`.
9. The app unlocks paid affordances only after those queries refetch and expose the plan stored in the backend database.

The top plan uses `team` as its internal id and remains displayable as Platinum in the pricing table until the product name is updated. Its checkout action posts `team` to the AbacatePay checkout route.

## Error Handling
- Invalid or missing checkout response shows a checkout-unavailable alert.
- Verify failures show a pending/failure alert and do not mutate local plan state.
- Existing API client behavior continues handling `401` through refresh/sign-out.
- `429`, `403`, `409`, and other API errors are surfaced as user-facing alerts without trusting gateway state.

## Testing
- Add a unit test for the billing helper proving checkout sends `{ plan }`, verify sends no body, and checkout/verify responses are returned as typed data.
- Add a source-level regression test proving the pricing modal no longer reads static checkout URL environment variables and does call verify after browser return.
- Run targeted tests plus typecheck after implementation.
