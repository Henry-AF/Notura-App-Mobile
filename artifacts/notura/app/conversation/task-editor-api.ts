import {
  api,
  type ApiTaskPriority,
  type ApiTaskStatus,
  type DeleteTaskResponse,
  type UpdateTaskRequest,
  type UpdateTaskResponse,
} from "../../lib/api-client.ts";
import type { ActionItemStatus, TaskPriority } from "../../lib/mockData.ts";

const PT_BR_MONTHS: Record<string, number> = {
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
};

export interface UpdateMeetingTaskInput {
  taskId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: ActionItemStatus;
}

function composeTaskDescription(title: string, details: string) {
  const normalizedTitle = title.trim();
  const normalizedDetails = details.trim();
  if (normalizedDetails.length === 0) return normalizedTitle;
  return `${normalizedTitle}\n\n${normalizedDetails}`;
}

function toApiTaskPriority(priority: TaskPriority): ApiTaskPriority {
  if (priority === "high") return "alta";
  if (priority === "low") return "baixa";
  return "media";
}

function toApiTaskStatus(status: ActionItemStatus): ApiTaskStatus {
  if (status === "done") return "completed";
  if (status === "in_progress") return "in_progress";
  return "todo";
}

function isValidIsoDateParts(year: number, month: number, day: number) {
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(parsed.getTime())) return false;
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
}

function toIsoDate(year: number, month: number, day: number) {
  if (!isValidIsoDateParts(year, month, day)) {
    throw new Error("Data de vencimento invalida.");
  }

  const y = String(year).padStart(4, "0");
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizeDueDateInput(rawValue: string): string | null {
  const value = rawValue.trim();
  if (value.length === 0) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return toIsoDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const isoDateTimeMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s].*$/);
  if (isoDateTimeMatch) {
    return toIsoDate(
      Number(isoDateTimeMatch[1]),
      Number(isoDateTimeMatch[2]),
      Number(isoDateTimeMatch[3]),
    );
  }

  const slashMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    return toIsoDate(Number(slashMatch[3]), Number(slashMatch[2]), Number(slashMatch[1]));
  }

  const monthMatch = value.toLocaleLowerCase("pt-BR").match(/^(\d{1,2})\s+([a-z]{3})(?:\s+(\d{4}))?$/);
  if (monthMatch) {
    const month = PT_BR_MONTHS[monthMatch[2]];
    if (!month) {
      throw new Error("Mes invalido. Use formato YYYY-MM-DD.");
    }

    const year = monthMatch[3] ? Number(monthMatch[3]) : new Date().getFullYear();
    return toIsoDate(year, month, Number(monthMatch[1]));
  }

  throw new Error("Data invalida. Use YYYY-MM-DD.");
}

export function formatDueDateLabel(dueDate: string | undefined) {
  if (!dueDate || dueDate.trim().length === 0) return null;

  const isoMatch = dueDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) return dueDate;

  const monthNumber = Number(isoMatch[2]);
  const monthEntry = Object.entries(PT_BR_MONTHS).find(([, value]) => value === monthNumber);
  if (!monthEntry) return dueDate;
  return `${isoMatch[3]} ${monthEntry[0]}`;
}

export function buildUpdateTaskRequest(input: UpdateMeetingTaskInput): UpdateTaskRequest {
  const title = input.title.trim();
  if (title.length === 0) {
    throw new Error("Titulo da tarefa e obrigatorio.");
  }

  return {
    description: composeTaskDescription(title, input.description),
    due_date: normalizeDueDateInput(input.dueDate),
    priority: toApiTaskPriority(input.priority),
    status: toApiTaskStatus(input.status),
  };
}

export async function updateMeetingTask(
  input: UpdateMeetingTaskInput,
  provider: (taskId: string, payload: UpdateTaskRequest) => Promise<UpdateTaskResponse> = api.tasks.update,
): Promise<UpdateTaskResponse> {
  const payload = buildUpdateTaskRequest(input);
  return provider(input.taskId, payload);
}

export async function deleteMeetingTask(
  taskId: string,
  provider: (taskId: string) => Promise<DeleteTaskResponse> = api.tasks.remove,
): Promise<DeleteTaskResponse> {
  return provider(taskId);
}
