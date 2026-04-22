import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const navbarPath = resolve(process.cwd(), "artifacts/notura/components/AppNavbar.tsx");
const conversationPath = resolve(process.cwd(), "artifacts/notura/app/conversation/[id].tsx");
const rootLayoutPath = resolve(process.cwd(), "artifacts/notura/app/_layout.tsx");

const navbarSource = readFileSync(navbarPath, "utf8");
const conversationSource = readFileSync(conversationPath, "utf8");
const rootLayoutSource = readFileSync(rootLayoutPath, "utf8");

test("conversation navigation should expose a back button in the shared navbar", () => {
  assert.ok(
    navbarSource.includes("showBackButton"),
    "Expected AppNavbar to support an optional back button"
  );
  assert.ok(
    navbarSource.includes("router.back()"),
    "Expected AppNavbar back button to use router.back()"
  );
  assert.ok(
    conversationSource.includes('showBackButton'),
    "Expected conversation screen to enable the shared navbar back button"
  );
});

test("conversation stack should use horizontal card transitions with gesture back", () => {
  assert.ok(
    rootLayoutSource.includes('animation: "slide_from_right"'),
    "Expected conversation screen to slide in from right"
  );
  assert.ok(
    rootLayoutSource.includes("gestureEnabled: true"),
    "Expected conversation screen to enable gesture-based back navigation"
  );
  assert.ok(
    rootLayoutSource.includes("fullScreenGestureEnabled: true"),
    "Expected conversation screen to allow a full-screen swipe back gesture"
  );
});
