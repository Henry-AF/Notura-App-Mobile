import {
  api,
  type ApiMeetingStatus,
  type ApiTaskStatus,
  type MeetingDetailResponse,
} from "../../lib/api-client.ts";
import type {
  ActionItem,
  ActionItemStatus,
  Highlight,
  Speaker,
  TaskPriority,
  TranscriptSegment,
} from "../../lib/mockData.ts";

export type { MeetingDetailResponse as ApiMeetingDetailResponse } from "../../lib/api-client.ts";

export type MeetingDetailStatus = "processing" | "completed" | "failed";

export interface MeetingDetailData {
  id: string;
  title: string;
  status: MeetingDetailStatus;
  date: string;
  duration: string;
  wordCount: number;
  summary: string;
  keyPoints: string[];
  decisions: Array<{
    id: string;
    description: string;
    decidedBy?: string;
    confidence?: string;
  }>;
  speakers: Speaker[];
  transcript: TranscriptSegment[];
  actionItems: ActionItem[];
  highlights: Highlight[];
}

const MONTH_SHORT_LABELS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const SPEAKER_COLORS = ["#5341CD", "#1D9E75", "#EF9F27", "#378ADD", "#D14B8F", "#00A6A6"];

function mapMeetingStatus(status: ApiMeetingStatus): MeetingDetailStatus {
  switch (status) {
    case "pending":
      return "processing";
    case "processing":
      return "processing";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
  }
}

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter((part) => part.length > 0);
  if (parts.length === 0) return "NA";

  const first = parts[0].slice(0, 1).toUpperCase();
  const secondSource = parts.length > 1 ? parts[1] : parts[0];
  const second = secondSource.slice(0, 1).toUpperCase();
  return `${first}${second}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function stripLeadingTimestamp(line: string) {
  return line.replace(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*/, "");
}

function splitSpeakerLine(line: string, index: number) {
  const normalizedLine = stripLeadingTimestamp(line);
  const match = normalizedLine.match(/^([^:]{2,40}):\s*(.+)$/);
  if (!match) {
    return {
      speakerName: "Participante",
      text: normalizedLine,
      segmentId: `segment-${index + 1}`,
    };
  }

  return {
    speakerName: match[1].trim(),
    text: match[2].trim(),
    segmentId: `segment-${index + 1}`,
  };
}

function formatSegmentTime(index: number) {
  const seconds = index * 30;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function parseTranscriptSegments(rawTranscript: string | null): TranscriptSegment[] {
  if (!rawTranscript || rawTranscript.trim().length === 0) return [];

  const lines = rawTranscript
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const speakerOrder = new Map<string, number>();
  return lines.map((line, index) => {
    const parsed = splitSpeakerLine(line, index);
    if (!speakerOrder.has(parsed.speakerName)) {
      speakerOrder.set(parsed.speakerName, speakerOrder.size);
    }

    const speakerPosition = speakerOrder.get(parsed.speakerName) ?? 0;
    return {
      id: parsed.segmentId,
      speakerId: `speaker-${speakerPosition + 1}`,
      speakerName: parsed.speakerName,
      speakerInitials: toInitials(parsed.speakerName),
      speakerColor: SPEAKER_COLORS[speakerPosition % SPEAKER_COLORS.length],
      startTime: index * 30,
      endTime: (index + 1) * 30,
      timeLabel: formatSegmentTime(index),
      text: parsed.text,
    };
  });
}

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0).length;
}

function extractMeetingParticipants(summaryJson: Record<string, unknown> | null): string[] {
  if (!summaryJson) return [];

  const meetingSummary = asRecord(summaryJson.meeting);
  const rawMeetingParticipants = meetingSummary?.participants;
  const rawRootParticipants = summaryJson.participants;
  const rawParticipants = Array.isArray(rawMeetingParticipants)
    ? rawMeetingParticipants
    : Array.isArray(rawRootParticipants)
      ? rawRootParticipants
      : [];

  const names: string[] = [];
  const seen = new Set<string>();

  for (const participant of rawParticipants) {
    const directName = typeof participant === "string" ? participant : null;
    const participantRecord = asRecord(participant);
    const objectName =
      typeof participantRecord?.name === "string" ? participantRecord.name : null;
    const candidate = (directName ?? objectName)?.trim();
    if (!candidate || candidate.length === 0) continue;

    const normalized = candidate.toLocaleLowerCase("pt-BR");
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    names.push(candidate);
  }

  if (names.length > 0) {
    return names;
  }

  const rawCount =
    typeof meetingSummary?.participant_count === "number"
      ? meetingSummary.participant_count
      : typeof summaryJson.participant_count === "number"
        ? summaryJson.participant_count
        : null;

  const participantCount =
    typeof rawCount === "number" && Number.isFinite(rawCount) ? Math.max(0, Math.floor(rawCount)) : 0;

  if (participantCount <= 0) return [];
  return Array.from({ length: participantCount }, (_, index) => `Participante ${index + 1}`);
}

function buildSpeakers(segments: TranscriptSegment[], participantNames: string[]): Speaker[] {
  if (participantNames.length > 0) {
    const wordsBySpeakerName = new Map<string, number>();

    for (const segment of segments) {
      const key = segment.speakerName.trim().toLocaleLowerCase("pt-BR");
      wordsBySpeakerName.set(key, (wordsBySpeakerName.get(key) ?? 0) + countWords(segment.text));
    }

    const participantWordCounts = participantNames.map((name) => {
      const key = name.trim().toLocaleLowerCase("pt-BR");
      return wordsBySpeakerName.get(key) ?? 0;
    });

    const totalParticipantWords = participantWordCounts.reduce((acc, value) => acc + value, 0);

    if (totalParticipantWords === 0) {
      const baseShare = Math.floor(100 / participantNames.length);
      const remainder = 100 - baseShare * participantNames.length;
      return participantNames.map((name, index) => ({
        id: `speaker-${index + 1}`,
        name,
        initials: toInitials(name),
        color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
        talkTimePercent: baseShare + (index < remainder ? 1 : 0),
        wordCount: 0,
      }));
    }

    return participantNames.map((name, index) => {
      const words = participantWordCounts[index];
      return {
        id: `speaker-${index + 1}`,
        name,
        initials: toInitials(name),
        color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
        talkTimePercent: Math.round((words / totalParticipantWords) * 100),
        wordCount: words,
      };
    });
  }

  if (segments.length === 0) {
    return [
      {
        id: "speaker-1",
        name: "Participante",
        initials: "PA",
        color: SPEAKER_COLORS[0],
        talkTimePercent: 100,
        wordCount: 0,
      },
    ];
  }

  const totals = new Map<string, { name: string; color: string; words: number }>();
  for (const segment of segments) {
    const current = totals.get(segment.speakerId) ?? {
      name: segment.speakerName,
      color: segment.speakerColor,
      words: 0,
    };
    current.words += countWords(segment.text);
    totals.set(segment.speakerId, current);
  }

  const totalWords = Math.max(
    1,
    Array.from(totals.values()).reduce((acc, item) => acc + item.words, 0),
  );

  return Array.from(totals.entries()).map(([speakerId, item]) => ({
    id: speakerId,
    name: item.name,
    initials: toInitials(item.name),
    color: item.color,
    talkTimePercent: Math.max(1, Math.round((item.words / totalWords) * 100)),
    wordCount: item.words,
  }));
}

function formatMeetingDate(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "Data indisponível";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = MONTH_SHORT_LABELS[parsed.getMonth()];
  const year = parsed.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDuration(createdAt: string, completedAt: string | null) {
  if (!completedAt) return "--";

  const start = new Date(createdAt).getTime();
  const end = new Date(completedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "--";

  const totalMinutes = Math.round((end - start) / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function normalizeTaskPriority(priority: string | null): TaskPriority {
  if (!priority) return "medium";
  const normalized = priority.trim().toLowerCase();
  if (normalized === "alta" || normalized === "high") return "high";
  if (normalized === "baixa" || normalized === "low") return "low";
  return "medium";
}

function normalizeTaskStatus(
  kanbanStatus: ApiTaskStatus | null,
  status: ApiTaskStatus | null,
  completed: boolean,
): ActionItemStatus {
  const source = kanbanStatus ?? status;
  if (source === "todo") return "todo";
  if (source === "in_progress") return "in_progress";
  if (source === "completed") return "done";
  return completed ? "done" : "todo";
}

function splitTaskDescription(rawDescription: string) {
  const normalized = rawDescription.trim();
  if (normalized.length === 0) {
    return { text: "Tarefa sem titulo", description: undefined as string | undefined };
  }

  const parts = normalized.split(/\n\s*\n/);
  const text = parts[0]?.trim() || "Tarefa sem titulo";
  const detail = parts.slice(1).join("\n\n").trim();
  return {
    text,
    description: detail.length > 0 ? detail : undefined,
  };
}

function mapTasksToActionItems(tasks: MeetingDetailResponse["tasks"]): ActionItem[] {
  return tasks.map((task, index) => {
    const assignee = task.owner && task.owner.trim().length > 0 ? task.owner : "Sem responsável";
    const parsedDescription = splitTaskDescription(task.description);
    const status = normalizeTaskStatus(task.kanban_status, task.status, task.completed);
    return {
      id: task.id,
      text: parsedDescription.text,
      description: parsedDescription.description,
      assignee,
      assigneeInitials: toInitials(assignee),
      assigneeColor: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
      priority: normalizeTaskPriority(task.priority),
      status,
      completed: status === "done",
      dueDate: task.due_date ?? undefined,
    };
  });
}

function mapDecisions(
  decisions: Array<Record<string, unknown>>,
  summaryJson: Record<string, unknown> | null,
): MeetingDetailData["decisions"] {
  const summaryDecisions = Array.isArray(summaryJson?.decisions)
    ? summaryJson.decisions.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    : [];

  const sources = [...decisions, ...summaryDecisions];
  if (sources.length === 0) return [];

  const mapped: MeetingDetailData["decisions"] = [];
  const seen = new Set<string>();

  sources.forEach((item, index) => {
    const description = extractStringField(item, ["description", "decision", "text", "title"]);
    if (!description) return;

    const dedupeKey = description.trim().toLocaleLowerCase("pt-BR");
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    const id = extractStringField(item, ["id"]) ?? `decision-${index + 1}`;
    const decidedBy = extractStringField(item, ["decided_by", "owner", "author", "by"]);
    const confidence = extractStringField(item, ["confidence"]);

    mapped.push({
      id,
      description,
      decidedBy: decidedBy ?? undefined,
      confidence: confidence ?? undefined,
    });
  });

  return mapped;
}

function extractStringField(
  source: Record<string, unknown> | null,
  keys: string[],
) {
  if (!source) return null;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function extractKeyPoints(
  summaryJson: Record<string, unknown> | null,
  decisions: Array<Record<string, unknown>>,
  openItems: Array<Record<string, unknown>>,
) {
  const direct = summaryJson?.key_points;
  if (Array.isArray(direct)) {
    const keyPoints = direct.filter((item): item is string => typeof item === "string");
    if (keyPoints.length > 0) return keyPoints;
  }

  const fromDecisions = decisions
    .map((item) => extractStringField(item, ["decision", "text", "title", "description"]))
    .filter((item): item is string => item !== null);
  const fromOpenItems = openItems
    .map((item) => extractStringField(item, ["text", "title", "description", "item"]))
    .filter((item): item is string => item !== null);
  return [...fromDecisions, ...fromOpenItems];
}

function resolveSummary(
  summaryWhatsapp: string | null,
  summaryJson: Record<string, unknown> | null,
) {
  if (summaryWhatsapp && summaryWhatsapp.trim().length > 0) {
    return summaryWhatsapp.trim();
  }

  const fromJson = extractStringField(summaryJson, ["summary", "resumo", "text"]);
  if (fromJson !== null) return fromJson;

  return "Resumo indisponível no momento.";
}

export function mapMeetingDetail(meeting: MeetingDetailResponse): MeetingDetailData {
  const transcript = parseTranscriptSegments(meeting.transcript);
  const participants = extractMeetingParticipants(meeting.summary_json);
  const speakers = buildSpeakers(transcript, participants);
  const keyPoints = extractKeyPoints(meeting.summary_json, meeting.decisions, meeting.open_items);
  const decisions = mapDecisions(meeting.decisions, meeting.summary_json);
  return {
    id: meeting.id,
    title: meeting.title,
    status: mapMeetingStatus(meeting.status),
    date: formatMeetingDate(meeting.created_at),
    duration: formatDuration(meeting.created_at, meeting.completed_at),
    wordCount: meeting.transcript ? countWords(meeting.transcript) : 0,
    summary: resolveSummary(meeting.summary_whatsapp, meeting.summary_json),
    keyPoints,
    decisions,
    speakers,
    transcript,
    actionItems: mapTasksToActionItems(meeting.tasks),
    highlights: [],
  };
}

export async function fetchMeetingDetail(
  id: string,
  provider: (meetingId: string) => Promise<MeetingDetailResponse> = api.meetings.get,
): Promise<MeetingDetailData> {
  const meeting = await provider(id);
  return mapMeetingDetail(meeting);
}
