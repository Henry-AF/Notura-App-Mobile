import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const navbarPath = resolve(process.cwd(), "artifacts/notura/components/AppNavbar.tsx");
const appContextPath = resolve(process.cwd(), "artifacts/notura/context/AppContext.tsx");

const navbarSource = readFileSync(navbarPath, "utf8");
const appContextSource = readFileSync(appContextPath, "utf8");

test("navbar should use user avatar with initials fallback", () => {
  assert.ok(
    navbarSource.includes("Avatar"),
    "Expected AppNavbar to render the shared Avatar component"
  );
  assert.ok(
    navbarSource.includes("currentUser.avatarUrl"),
    "Expected AppNavbar to support a profile photo when available"
  );
  assert.ok(
    !navbarSource.includes('Feather name="settings"'),
    "Expected settings icon to be removed from the navbar leading slot"
  );
  assert.ok(
    appContextSource.includes("avatarUrl?: string"),
    "Expected currentUser type to expose an optional avatarUrl"
  );
});
