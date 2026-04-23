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
});
