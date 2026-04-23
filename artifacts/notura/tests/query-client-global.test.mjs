import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const rootLayoutPath = resolve(process.cwd(), "artifacts/notura/app/_layout.tsx");
const queryClientPath = resolve(process.cwd(), "artifacts/notura/lib/query-client.ts");

const rootLayoutSource = readFileSync(rootLayoutPath, "utf8");
const queryClientSource = readFileSync(queryClientPath, "utf8");

test("root layout should use a shared global query client instance", () => {
  assert.ok(
    rootLayoutSource.includes('from "@/lib/query-client"'),
    "Expected root layout to import the global query client from lib/query-client"
  );
  assert.ok(
    rootLayoutSource.includes("<QueryClientProvider client={queryClient}>"),
    "Expected root layout to provide a single global QueryClient instance"
  );
});

test("global query client should define mobile-friendly cache defaults", () => {
  assert.ok(
    queryClientSource.includes("staleTime"),
    "Expected query client defaults to define staleTime for cache freshness"
  );
  assert.ok(
    queryClientSource.includes("gcTime"),
    "Expected query client defaults to define gcTime for mobile memory control"
  );
  assert.ok(
    queryClientSource.includes("refetchOnWindowFocus"),
    "Expected query defaults to control focus refetch behavior on mobile"
  );
  assert.ok(
    queryClientSource.includes("retry"),
    "Expected query and mutation defaults to define retry strategy"
  );
});
