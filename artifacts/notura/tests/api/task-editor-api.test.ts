import assert from "node:assert/strict";
import test from "node:test";

import {
  buildUpdateTaskRequest,
  deleteMeetingTask,
  formatDueDateLabel,
  normalizeDueDateInput,
  updateMeetingTask,
} from "../../app/conversation/task-editor-api.ts";

test("normalizeDueDateInput deve aceitar formatos comuns e retornar YYYY-MM-DD", () => {
  assert.equal(normalizeDueDateInput("2026-04-23"), "2026-04-23");
  assert.equal(normalizeDueDateInput("2026-04-23T00:00:00.000Z"), "2026-04-23");
  assert.equal(normalizeDueDateInput("23/04/2026"), "2026-04-23");
  assert.equal(normalizeDueDateInput("23 abr 2026"), "2026-04-23");
  assert.equal(normalizeDueDateInput(""), null);
});

test("buildUpdateTaskRequest deve mapear status, prioridade e vencimento para contrato da API", () => {
  const payload = buildUpdateTaskRequest({
    taskId: "task-1",
    title: "Enviar proposta revisada",
    description: "Versao final para o cliente",
    dueDate: "2026-04-24",
    priority: "high",
    status: "done",
  });

  assert.deepEqual(payload, {
    description: "Enviar proposta revisada\n\nVersao final para o cliente",
    due_date: "2026-04-24",
    priority: "alta",
    status: "completed",
  });
});

test("updateMeetingTask deve usar provider com payload normalizado", async () => {
  let calledTaskId = "";
  let calledPayload: unknown = null;

  const response = await updateMeetingTask(
    {
      taskId: "task-2",
      title: "Validar contrato",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "in_progress",
    },
    async (taskId, payload) => {
      calledTaskId = taskId;
      calledPayload = payload;
      return { task: { id: "task-2", title: "Validar contrato" } };
    },
  );

  assert.equal(calledTaskId, "task-2");
  assert.deepEqual(calledPayload, {
    description: "Validar contrato",
    due_date: null,
    priority: "media",
    status: "in_progress",
  });
  assert.equal(response.task.id, "task-2");
});

test("deleteMeetingTask deve delegar para o provider", async () => {
  let calledTaskId = "";
  const response = await deleteMeetingTask("task-3", async (taskId) => {
    calledTaskId = taskId;
    return { success: true };
  });

  assert.equal(calledTaskId, "task-3");
  assert.equal(response.success, true);
});

test("formatDueDateLabel deve renderizar formato curto amigavel quando valor for ISO", () => {
  assert.equal(formatDueDateLabel("2026-04-24"), "24 abr");
  assert.equal(formatDueDateLabel(undefined), null);
  assert.equal(formatDueDateLabel("24 abr"), "24 abr");
});
