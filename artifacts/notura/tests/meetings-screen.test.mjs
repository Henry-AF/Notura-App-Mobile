import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const meetingsScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/search.tsx");
const meetingsScreenSource = readFileSync(meetingsScreenPath, "utf8");

const homeScreenPath = resolve(process.cwd(), "artifacts/notura/app/(tabs)/index.tsx");
const homeScreenSource = readFileSync(homeScreenPath, "utf8");

test("meetings tab should render a premium meetings library instead of the old search experience", () => {
  assert.ok(
    meetingsScreenSource.includes('AppNavbar title="Reuniões"'),
    "Expected meetings screen to use Reuniões as the navbar title"
  );
  assert.ok(
    !meetingsScreenSource.includes('AppNavbar title="Buscar"'),
    "Expected meetings screen to remove the old Buscar title"
  );
  assert.ok(
    meetingsScreenSource.includes("Completado") &&
      meetingsScreenSource.includes("Processando") &&
      meetingsScreenSource.includes("Falhou"),
    "Expected meetings screen to expose Portuguese status labels for recorded meetings"
  );
  assert.ok(
    meetingsScreenSource.includes("queryKey: [\"meetings-library\"]") &&
      meetingsScreenSource.includes("fetchMeetingsLibrary"),
    "Expected meetings screen to load meetings data through TanStack Query + search-api helper"
  );
  assert.ok(
    !meetingsScreenSource.includes("const { conversations } = useApp();"),
    "Expected meetings screen to stop using AppContext conversations as server-state source"
  );
  assert.ok(
    meetingsScreenSource.includes('router.push(`/conversation/${conversation.id}`)'),
    "Expected meetings list items to open the existing conversation detail route"
  );
  assert.ok(
    !meetingsScreenSource.includes("SearchBar"),
    "Expected meetings screen to remove the old search UI"
  );
  assert.ok(
    !meetingsScreenSource.includes("statusAccent"),
    "Expected meetings cards to remove the left accent bar"
  );
  assert.ok(
    !meetingsScreenSource.includes("conversation.subtitle"),
    "Expected meetings cards to remove the old subtitle/topics line"
  );
  assert.ok(
    !meetingsScreenSource.includes("metaPill"),
    "Expected meetings cards to remove the filled background on date and time metadata"
  );
});

test("home should route users to the meetings tab instead of the removed schedule screen", () => {
  assert.ok(
    homeScreenSource.includes('router.push("/(tabs)/search")'),
    "Expected Home CTA to open the meetings tab route"
  );
  assert.ok(
    !homeScreenSource.includes('router.push("/schedule"'),
    "Expected Home CTA to stop using the removed schedule route"
  );
});
