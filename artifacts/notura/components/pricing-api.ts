import {
  api,
  type AbacatePayCheckoutPlan,
  type AbacatePayCheckoutResponse,
  type AbacatePayVerifyResponse,
  type PlanType,
} from "../lib/api-client.ts";

export type PricingPlanId = PlanType;

export type StartAbacatePayCheckoutProvider = (
  plan: AbacatePayCheckoutPlan,
) => Promise<AbacatePayCheckoutResponse>;

export type VerifyAbacatePayCheckoutProvider =
  () => Promise<AbacatePayVerifyResponse>;

export function isAbacatePayCheckoutPlan(
  plan: PricingPlanId,
): plan is AbacatePayCheckoutPlan {
  return plan === "pro" || plan === "team";
}

export async function startAbacatePayCheckout(
  plan: PricingPlanId,
  provider: StartAbacatePayCheckoutProvider = api.abacatepay.checkout,
) {
  if (!isAbacatePayCheckoutPlan(plan)) {
    throw new Error("Plano indisponivel para checkout AbacatePay.");
  }

  return provider(plan);
}

export function verifyAbacatePayCheckout(
  provider: VerifyAbacatePayCheckoutProvider = api.abacatepay.verify,
) {
  return provider();
}
