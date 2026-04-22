import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/index.tsx");
const homeScreenSource = readFileSync(homeScreenPath, "utf8");

test("home screen should remove search input and use premium spacing tokens", () => {
  assert.ok(
    !homeScreenSource.includes("<SearchBar"),
    "Expected home screen to remove search input from the top section"
  );
  assert.ok(
    !homeScreenSource.includes("Agenda de hoje"),
    "Expected home screen to remove quick action chips"
  );
  assert.ok(
    !homeScreenSource.includes("Destaques"),
    "Expected home screen to remove quick action chips from the hero area"
  );
  assert.ok(
    !homeScreenSource.includes("IA Insights"),
    "Expected home screen to remove quick action chips from the hero area"
  );
  assert.ok(
    !homeScreenSource.includes("Projetos em andamento"),
    "Expected home screen to remove the projects section"
  );
  assert.ok(
    homeScreenSource.includes("sectionSpacingLg"),
    "Expected home screen to define larger section spacing for premium layout"
  );
});

test("home should show a compact recent meetings section limited to today's completed meetings", () => {
  assert.ok(
    homeScreenSource.includes("Reuniões Recentes"),
    "Expected home screen to rename the Recentes section to Reuniões Recentes"
  );
  assert.ok(
    homeScreenSource.includes('conversation.status === "completed"'),
    "Expected home screen to filter recent meetings to completed conversations only"
  );
  assert.ok(
    homeScreenSource.includes('conversation.dateShort.trim().toLowerCase() === "hoje"'),
    "Expected home screen to filter recent meetings to today's conversations only"
  );
  assert.ok(
    homeScreenSource.includes(".slice(0, 3)"),
    "Expected home screen to limit the section to three meetings"
  );
  assert.ok(
    homeScreenSource.includes("Nenhuma reunião foi feita hoje."),
    "Expected home screen to render an explicit empty state when there are no meetings today"
  );
  assert.ok(
    homeScreenSource.includes("HomeRecentMeetingCard"),
    "Expected home screen to use a dedicated compact meetings card component"
  );
  assert.ok(
    homeScreenSource.includes("formatRelativeRecordedAt"),
    "Expected home screen to format relative recorded times for recent meetings"
  );
  assert.ok(
    !homeScreenSource.includes("<ConversationCard"),
    "Expected home screen to stop rendering ConversationCard in the recent meetings section"
  );
});
