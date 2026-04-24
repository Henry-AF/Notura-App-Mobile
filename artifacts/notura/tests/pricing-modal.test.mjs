import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pricingModalPath = resolve(process.cwd(), "artifacts/notura/components/PricingModal.tsx");
const pricingModalSource = readFileSync(pricingModalPath, "utf8");

test("pricing modal should expose Free, Pro and Platinum plans with the new pricing", () => {
  assert.ok(
    pricingModalSource.includes("até 3 reuniões"),
    "Expected pricing modal to cap the free plan at 3 meetings"
  );
  assert.ok(
    pricingModalSource.includes("Até 30 reuniões"),
    "Expected pricing modal to cap the pro plan at 30 meetings"
  );
  assert.ok(
    pricingModalSource.includes("Ilimitado"),
    "Expected pricing modal to describe the platinum plan as unlimited"
  );
  assert.ok(
    pricingModalSource.includes("59,90"),
    "Expected pricing modal to show the Pro price as 59,90"
  );
  assert.ok(
    pricingModalSource.includes("79,90"),
    "Expected pricing modal to show the Platinum price as 79,90"
  );
  assert.ok(
    pricingModalSource.includes('id: "team"'),
    "Expected pricing modal to use team as the internal id for the top plan"
  );
  assert.ok(
    !pricingModalSource.includes('id: "platinum"'),
    "Expected pricing modal to stop using platinum as the internal plan id"
  );
  assert.ok(
    pricingModalSource.includes("Plano atual"),
    "Expected pricing modal to indicate the current plan"
  );
  assert.ok(
    pricingModalSource.includes("Ir para checkout"),
    "Expected pricing modal to render checkout actions on the plan cards"
  );
  assert.ok(
    !pricingModalSource.includes("Começar no Free"),
    "Expected pricing modal to avoid rendering a CTA for the free plan"
  );
});

test("pricing modal should use AbacatePay API checkout and verify after browser return", () => {
  assert.ok(
    !pricingModalSource.includes("EXPO_PUBLIC_PRO_CHECKOUT_URL"),
    "Expected pricing modal to stop reading the static Pro checkout URL"
  );
  assert.ok(
    !pricingModalSource.includes("EXPO_PUBLIC_PLATINUM_CHECKOUT_URL"),
    "Expected pricing modal to stop reading the static Platinum checkout URL"
  );
  assert.ok(
    pricingModalSource.includes("startAbacatePayCheckout"),
    "Expected pricing modal to start checkout through the pricing API helper"
  );
  assert.ok(
    pricingModalSource.includes('cta: "Ir para checkout"'),
    "Expected pricing modal to advertise checkout for supported paid plans"
  );
  assert.ok(
    !pricingModalSource.includes('cta: "Em breve"'),
    "Expected pricing modal to make the top plan checkout action functional"
  );
  assert.ok(
    pricingModalSource.includes("verifyAbacatePayCheckout"),
    "Expected pricing modal to verify checkout through the pricing API helper"
  );
  assert.ok(
    pricingModalSource.includes("pendingCheckoutPlan"),
    "Expected pricing modal to keep checkout pending instead of verifying immediately"
  );
  assert.ok(
    pricingModalSource.includes("Verificar pagamento"),
    "Expected pricing modal to expose an explicit payment verification action"
  );
  assert.ok(
    pricingModalSource.includes("Linking.openURL"),
    "Expected pricing modal to open native checkout with Linking.openURL"
  );
  assert.ok(
    pricingModalSource.includes("window.location.assign"),
    "Expected pricing modal to redirect the current web tab to the checkout URL"
  );
  assert.ok(
    !pricingModalSource.includes("WebBrowser.openBrowserAsync"),
    "Expected pricing modal not to use WebBrowser.openBrowserAsync for checkout"
  );
  assert.ok(
    pricingModalSource.indexOf("setPendingCheckoutPlan(planId)") <
      pricingModalSource.indexOf("await openCheckoutUrl"),
    "Expected pricing modal to mark checkout pending before leaving the app for checkout"
  );
  assert.ok(
    pricingModalSource.indexOf("async function verifyPendingCheckout") <
      pricingModalSource.indexOf("await verifyAbacatePayCheckout"),
    "Expected pricing modal to call verify from the explicit verification action"
  );
  assert.ok(
    pricingModalSource.includes('queryKey: ["user-me"]'),
    "Expected pricing modal to refresh the user profile after checkout verification"
  );
  assert.ok(
    pricingModalSource.includes('queryKey: ["home-overview"]'),
    "Expected pricing modal to refresh the home overview after checkout verification"
  );
});
