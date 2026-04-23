import {
  api,
  type ApiMeetingStatus,
  type MeetingsListResponse,
} from "../../lib/api-client.ts";

export type { MeetingsListResponse } from "../../lib/api-client.ts";

export type MeetingsLibraryStatus = "processing" | "completed" | "failed";

export interface MeetingsLibraryItem {
  id: string;
  title: string;
  status: MeetingsLibraryStatus;
  createdAt: string;
  recordedDateLabel: string;
  durationLabel: string;
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

function mapMeetingStatus(status: ApiMeetingStatus): MeetingsLibraryStatus {
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

function toTimestamp(dateLike: string) {
  const timestamp = new Date(dateLike).getTime();
  if (Number.isNaN(timestamp)) return 0;
  return timestamp;
}

function formatMeetingDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Data indisponível";

  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_SHORT_LABELS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

interface MeetingRow {
  item: MeetingsLibraryItem;
  sortTimestamp: number;
}

function toMeetingRow(meeting: MeetingsListResponse["meetings"][number]): MeetingRow {
  return {
    sortTimestamp: toTimestamp(meeting.createdAt),
    item: {
      id: meeting.id,
      title: meeting.title,
      status: mapMeetingStatus(meeting.status),
      createdAt: meeting.createdAt,
      recordedDateLabel: formatMeetingDate(meeting.createdAt),
      durationLabel: "--",
    },
  };
}

export function mapMeetingsResponse(response: MeetingsListResponse): MeetingsLibraryItem[] {
  return response.meetings
    .map(toMeetingRow)
    .sort((left, right) => right.sortTimestamp - left.sortTimestamp)
    .map((row) => row.item);
}

export async function fetchMeetingsLibrary(
  provider: () => Promise<MeetingsListResponse> = api.meetings.list,
): Promise<MeetingsLibraryItem[]> {
  const response = await provider();
  return mapMeetingsResponse(response);
}
