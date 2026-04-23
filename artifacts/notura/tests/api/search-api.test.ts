import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchMeetingsLibrary,
  mapMeetingsResponse,
  type MeetingsListResponse,
} from "../../app/(tabs)/search-api.ts";

function createMeetingsFixture(): MeetingsListResponse {
  return {
    meetings: [
      {
        id: "meeting-old",
        title: "Alinhamento semanal",
        clientName: "Acme",
        createdAt: "2026-04-11T10:00:00.000Z",
        status: "completed",
      },
      {
        id: "meeting-new",
        title: "Kickoff cliente",
        clientName: "Beta",
        createdAt: "2026-04-12T10:00:00.000Z",
        status: "pending",
      },
      {
        id: "meeting-invalid-date",
        title: "Retro",
        clientName: "Gamma",
        createdAt: "invalid-date",
        status: "failed",
      },
    ],
  };
}

test("mapMeetingsResponse deve normalizar status e ordenar por data mais recente", () => {
  const mapped = mapMeetingsResponse(createMeetingsFixture());

  assert.equal(mapped.length, 3);
  assert.equal(mapped[0].id, "meeting-new");
  assert.equal(mapped[0].status, "processing");
  assert.equal(mapped[0].recordedDateLabel, "12 abr 2026");
  assert.equal(mapped[1].id, "meeting-old");
  assert.equal(mapped[2].id, "meeting-invalid-date");
  assert.equal(mapped[2].recordedDateLabel, "Data indisponível");
  assert.equal(mapped[0].durationLabel, "--");
});

test("fetchMeetingsLibrary deve usar provider e devolver dados mapeados", async () => {
  let called = 0;
  const provider = async () => {
    called += 1;
    return createMeetingsFixture();
  };

  const meetings = await fetchMeetingsLibrary(provider);

  assert.equal(called, 1);
  assert.equal(meetings.length, 3);
  assert.equal(meetings[0].title, "Kickoff cliente");
});
