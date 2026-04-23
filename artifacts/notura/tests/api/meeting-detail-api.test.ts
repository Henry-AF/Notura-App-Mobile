import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchMeetingDetail,
  mapMeetingDetail,
  type ApiMeetingDetailResponse,
} from "../../app/conversation/meeting-detail-api.ts";

function createMeetingDetailFixture(): ApiMeetingDetailResponse {
  return {
    id: "meeting-1",
    user_id: "user-1",
    title: "Reunião - Acme",
    client_name: "Acme",
    meeting_date: "2026-04-10",
    status: "pending",
    summary_whatsapp: "Resumo principal",
    summary_json: {
      meeting: {
        participants: ["Speaker A", "Speaker B", "Luana", "Lael", "Gabriel"],
        participant_count: 5,
      },
      key_points: ["Prazo definido", "Aprovação do cliente"],
    },
    transcript:
      "[00:00] Speaker A: Vamos alinhar o cronograma.\n[00:09] Speaker B: Concordo, vou enviar a proposta hoje.",
    tasks: [
      {
        id: "task-1",
        description: "Enviar proposta",
        completed: false,
        priority: "alta",
        owner: "Ana Paula",
        due_date: "2026-04-11",
        status: "in_progress",
        kanban_status: "in_progress",
      },
      {
        id: "task-2",
        description: "Validar contrato",
        completed: true,
        priority: "baixa",
        owner: null,
        due_date: null,
        status: "completed",
        kanban_status: "completed",
      },
    ],
    decisions: [{ decision: "Fechar proposta até sexta" }],
    open_items: [{ text: "Aguardar retorno jurídico" }],
    created_at: "2026-04-10T10:00:00.000Z",
    completed_at: "2026-04-10T11:15:00.000Z",
  };
}

test("mapMeetingDetail deve normalizar payload da API para o formato da tela", () => {
  const mapped = mapMeetingDetail(createMeetingDetailFixture());

  assert.equal(mapped.id, "meeting-1");
  assert.equal(mapped.status, "processing");
  assert.equal(mapped.summary, "Resumo principal");
  assert.equal(mapped.keyPoints.length, 2);
  assert.equal(mapped.transcript.length, 2);
  assert.equal(mapped.transcript[0].speakerName, "Speaker A");
  assert.equal(mapped.transcript[1].speakerName, "Speaker B");
  assert.equal(mapped.speakers.length, 5);
  assert.deepEqual(
    mapped.speakers.map((speaker) => speaker.name),
    ["Speaker A", "Speaker B", "Luana", "Lael", "Gabriel"],
  );
  assert.equal(mapped.actionItems.length, 2);
  assert.equal(mapped.actionItems[0].status, "in_progress");
  assert.equal(mapped.actionItems[1].status, "done");
  assert.equal(mapped.decisions.length, 1);
  assert.equal(mapped.decisions[0].description, "Fechar proposta até sexta");
  assert.equal(mapped.duration, "1h 15m");
  assert.ok(mapped.wordCount > 0);
});

test("fetchMeetingDetail deve usar provider e retornar dados mapeados", async () => {
  let calledWith: string | null = null;
  const provider = async (meetingId: string) => {
    calledWith = meetingId;
    return createMeetingDetailFixture();
  };

  const detail = await fetchMeetingDetail("meeting-1", provider);

  assert.equal(calledWith, "meeting-1");
  assert.equal(detail.id, "meeting-1");
  assert.equal(detail.title, "Reunião - Acme");
});
