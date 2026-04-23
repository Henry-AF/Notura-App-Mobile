import {
  api,
  type ApiMeetingStatus,
  type DashboardOverviewResponse,
  type PlanType,
} from "../../lib/api-client.ts";

export type { DashboardOverviewResponse } from "../../lib/api-client.ts";

export type HomeMeetingStatus = "processing" | "completed" | "failed";

export interface HomeRecentMeeting {
  id: string;
  clientName: string;
  title: string;
  createdAt: string;
  status: HomeMeetingStatus;
  relativeRecordedAt: string;
  duration: string;
}

export interface HomeOverviewData {
  userName: string;
  plan: PlanType;
  meetingsThisMonth: number;
  monthlyLimit: number | null;
  openTaskCount: number;
  hoursSaved: number;
  todayCount: number;
  recentMeetings: HomeRecentMeeting[];
}

function mapMeetingStatus(status: ApiMeetingStatus): HomeMeetingStatus {
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

function formatRelativeRecordedAt(createdAt: string) {
  const createdTimestamp = new Date(createdAt).getTime();
  if (Number.isNaN(createdTimestamp)) {
    return "Agora mesmo";
  }

  const diffInMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdTimestamp) / (60 * 1000)),
  );

  if (diffInMinutes < 1) {
    return "Agora mesmo";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;
  }

  return new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function mapDashboardOverview(
  response: DashboardOverviewResponse,
): HomeOverviewData {
  return {
    userName: response.userName,
    plan: response.plan,
    meetingsThisMonth: response.meetingsThisMonth,
    monthlyLimit: response.monthlyLimit,
    openTaskCount: response.openTaskCount,
    hoursSaved: response.hoursSaved,
    todayCount: response.todayCount,
    recentMeetings: response.recentMeetings.map((meeting) => ({
      id: meeting.id,
      clientName: meeting.clientName,
      title: meeting.title,
      createdAt: meeting.createdAt,
      status: mapMeetingStatus(meeting.status),
      relativeRecordedAt: formatRelativeRecordedAt(meeting.createdAt),
      duration: "--",
    })),
  };
}

export async function fetchHomeOverview(
  provider: () => Promise<DashboardOverviewResponse> = api.dashboard.overview,
): Promise<HomeOverviewData> {
  const response = await provider();
  return mapDashboardOverview(response);
}
