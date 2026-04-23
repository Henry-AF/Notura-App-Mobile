import { getAccessToken, getSupabaseAuth } from "./supabase.ts";

export type PlanType = "free" | "pro" | "platinum";
export type ApiMeetingStatus = "pending" | "processing" | "completed" | "failed";

export interface DashboardOverviewMeeting {
  id: string;
  clientName: string;
  title: string;
  createdAt: string;
  status: ApiMeetingStatus;
}

export interface DashboardOverviewOpenTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface DashboardOverviewResponse {
  userName: string;
  plan: PlanType;
  meetingsThisMonth: number;
  monthlyLimit: number | null;
  recentMeetings: DashboardOverviewMeeting[];
  openTasks: DashboardOverviewOpenTask[];
  openTaskCount: number;
  hoursSaved: number;
  todayCount: number;
}

export interface MeetingsListItem {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  status: ApiMeetingStatus;
}

export interface MeetingsListResponse {
  meetings: MeetingsListItem[];
}

export type ApiTaskStatus = "todo" | "in_progress" | "completed";

export interface MeetingDetailTask {
  id: string;
  description: string;
  completed: boolean;
  priority: string | null;
  owner: string | null;
  due_date: string | null;
  status: ApiTaskStatus | null;
  kanban_status: ApiTaskStatus | null;
}

export interface MeetingDetailResponse {
  id: string;
  user_id: string;
  title: string;
  client_name: string | null;
  meeting_date: string | null;
  status: ApiMeetingStatus;
  summary_whatsapp: string | null;
  summary_json: Record<string, unknown> | null;
  transcript: string | null;
  tasks: MeetingDetailTask[];
  decisions: Array<Record<string, unknown>>;
  open_items: Array<Record<string, unknown>>;
  created_at: string;
  completed_at: string | null;
}

export interface MeetingUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface MeetingUploadResponse {
  r2Key: string;
  uploadUrl: string;
  uploadToken: string;
  method: "PUT" | "POST";
  expiresInSeconds: number;
}

export interface MeetingProcessRequest {
  clientName: string;
  meetingDate: string;
  r2Key: string;
  uploadToken: string;
  whatsappNumber?: string | null;
}

export interface MeetingProcessResponse {
  meetingId: string;
  status: ApiMeetingStatus;
}

export interface MeetingStatusResponse {
  id: string;
  title: string;
  status: ApiMeetingStatus;
  taskCount: number;
  decisionCount: number;
}

export interface UserMeResponse {
  user: {
    id: string;
    email: string;
    name: string;
    company: string | null;
    whatsappNumber: string | null;
    plan: PlanType;
    meetingsThisMonth: number;
    monthlyLimit: number | null;
  };
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, statusText: string, data: unknown) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function getApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const rawBaseUrl =
    typeof envUrl === "string" && envUrl.length > 0
      ? envUrl
      : "http://localhost:3000";

  return rawBaseUrl.replace(/\/+$/, "");
}

function toUrlWithBase(path: string, baseUrl: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function serializeBody(body: unknown) {
  if (body === undefined) return undefined;
  if (body === null) return "null";
  if (typeof body === "string") return body;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (raw.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function buildHeaders(
  incomingHeaders: HeadersInit | undefined,
  serializedBody: ReturnType<typeof serializeBody>,
  accessToken: string | null,
) {
  const headers = new Headers(incomingHeaders);
  headers.set("accept", "application/json");

  if (serializedBody !== undefined && !(serializedBody instanceof FormData)) {
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
  }

  if (accessToken !== null && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function defaultRefreshAccessToken() {
  try {
    const { data } = await getSupabaseAuth().refreshSession();
    return data.session ? data.session.access_token : null;
  } catch {
    return null;
  }
}

interface ApiRequesterDependencies {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  getAccessToken?: () => Promise<string | null>;
  refreshAccessToken?: () => Promise<string | null>;
  signOut?: () => Promise<void>;
}

async function executeRequest(
  fetchImpl: typeof fetch,
  url: string,
  options: RequestInit,
) {
  const response = await fetchImpl(url, options);
  const parsed = await parseResponseBody(response);
  return { response, parsed };
}

export function createApiRequester(dependencies: ApiRequesterDependencies = {}) {
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const getToken = dependencies.getAccessToken ?? getAccessToken;
  const refreshAccessToken = dependencies.refreshAccessToken ?? defaultRefreshAccessToken;
  const signOut = dependencies.signOut ?? (() => getSupabaseAuth().signOut());

  return async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers: incomingHeaders, ...rest } = options;
    const baseUrl = (dependencies.baseUrl ?? getApiBaseUrl()).replace(/\/+$/, "");
    const url = toUrlWithBase(path, baseUrl);
    const serializedBody = serializeBody(body);
    const explicitAuthorizationHeader = new Headers(incomingHeaders).has("authorization");

    const accessToken = await getToken();
    const headers = buildHeaders(incomingHeaders, serializedBody, accessToken);

    const firstAttempt = await executeRequest(fetchImpl, url, {
      ...rest,
      credentials: rest.credentials ?? "include",
      headers,
      body: serializedBody as BodyInit | undefined,
    });

    if (firstAttempt.response.ok) {
      return firstAttempt.parsed as T;
    }

    if (firstAttempt.response.status !== 401) {
      throw new ApiClientError(
        firstAttempt.response.status,
        firstAttempt.response.statusText,
        firstAttempt.parsed,
      );
    }

    let finalAttempt = firstAttempt;

    if (!explicitAuthorizationHeader) {
      const refreshedAccessToken = await refreshAccessToken();
      if (refreshedAccessToken !== null) {
        const retryHeaders = buildHeaders(incomingHeaders, serializedBody, refreshedAccessToken);
        retryHeaders.set("authorization", `Bearer ${refreshedAccessToken}`);

        finalAttempt = await executeRequest(fetchImpl, url, {
          ...rest,
          credentials: rest.credentials ?? "include",
          headers: retryHeaders,
          body: serializedBody as BodyInit | undefined,
        });

        if (finalAttempt.response.ok) {
          return finalAttempt.parsed as T;
        }
      }
    }

    if (finalAttempt.response.status === 401) {
      await signOut();
    }

    throw new ApiClientError(
      finalAttempt.response.status,
      finalAttempt.response.statusText,
      finalAttempt.parsed,
    );
  };
}

const requestJson = createApiRequester();

export const api = {
  dashboard: {
    overview: () => requestJson<DashboardOverviewResponse>("/api/dashboard/overview"),
  },
  meetings: {
    list: () => requestJson<MeetingsListResponse>("/api/meetings"),
    get: (id: string) =>
      requestJson<MeetingDetailResponse>(`/api/meetings/${encodeURIComponent(id)}`),
    upload: (payload: MeetingUploadRequest) =>
      requestJson<MeetingUploadResponse>("/api/meetings/upload", {
        method: "POST",
        body: payload,
      }),
    process: (payload: MeetingProcessRequest) =>
      requestJson<MeetingProcessResponse>("/api/meetings/process", {
        method: "POST",
        body: payload,
      }),
    status: (id: string) =>
      requestJson<MeetingStatusResponse>(
        `/api/meetings/${encodeURIComponent(id)}/status`,
      ),
  },
  user: {
    me: () => requestJson<UserMeResponse>("/api/user/me"),
  },
  auth: {
    logout: () => requestJson<null>("/api/auth/logout", { method: "POST" }),
  },
};
