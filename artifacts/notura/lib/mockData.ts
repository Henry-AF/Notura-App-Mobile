export type ConversationStatus = "completed" | "recording" | "processing" | "failed";
export type TaskPriority = "high" | "medium" | "low";
export type SpeakerColor = string;

export interface Speaker {
  id: string;
  name: string;
  initials: string;
  color: string;
  talkTimePercent: number;
  wordCount: number;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerInitials: string;
  speakerColor: string;
  startTime: number;
  endTime: number;
  timeLabel: string;
  text: string;
  isHighlighted?: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string;
}

export interface Highlight {
  id: string;
  conversationId: string;
  conversationTitle: string;
  speakerName: string;
  speakerInitials: string;
  speakerColor: string;
  text: string;
  timeLabel: string;
  createdAt: string;
  tag?: string;
}

export interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  dateShort: string;
  duration: string;
  durationSeconds: number;
  status: ConversationStatus;
  spaceId?: string;
  speakers: Speaker[];
  summary?: string;
  keyPoints?: string[];
  transcript?: TranscriptSegment[];
  actionItems?: ActionItem[];
  highlights?: Highlight[];
  wordCount?: number;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
  conversationCount: number;
  description?: string;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  color: string;
}

export const SPEAKERS: Record<string, Speaker> = {
  henry: {
    id: "henry",
    name: "Henry Costa",
    initials: "HC",
    color: "#5341CD",
    talkTimePercent: 38,
    wordCount: 842,
  },
  sarah: {
    id: "sarah",
    name: "Sarah Kim",
    initials: "SK",
    color: "#1D9E75",
    talkTimePercent: 28,
    wordCount: 621,
  },
  marcus: {
    id: "marcus",
    name: "Marcus Lee",
    initials: "ML",
    color: "#EF9F27",
    talkTimePercent: 22,
    wordCount: 489,
  },
  priya: {
    id: "priya",
    name: "Priya Patel",
    initials: "PP",
    color: "#378ADD",
    talkTimePercent: 12,
    wordCount: 266,
  },
};

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    title: "Q2 Product Strategy Review",
    subtitle: "Product · Engineering · Design",
    date: "Apr 21, 2026",
    dateShort: "Today",
    duration: "1h 24m",
    durationSeconds: 5040,
    status: "completed",
    spaceId: "s1",
    speakers: [SPEAKERS.henry, SPEAKERS.sarah, SPEAKERS.marcus],
    wordCount: 5820,
    summary:
      "The team aligned on Q2 priorities: mobile launch moves to May 15, API redesign pushed to Q3. Two engineers reallocated to mobile team. Henry to draft updated roadmap by EOW. Budget for Q2 marketing approved at $120K.",
    keyPoints: [
      "Mobile launch moved to May 15th",
      "API redesign deferred to Q3",
      "2 engineers reallocated from API to mobile",
      "Q2 marketing budget approved: $120K",
      "Weekly syncs changed to Tuesdays",
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "henry",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        startTime: 0,
        endTime: 18,
        timeLabel: "0:00",
        text: "Alright everyone, let's kick off the Q2 strategy review. I want to start by looking at where we stand on our OKRs before we make any decisions.",
      },
      {
        id: "t2",
        speakerId: "sarah",
        speakerName: "Sarah Kim",
        speakerInitials: "SK",
        speakerColor: "#1D9E75",
        startTime: 20,
        endTime: 45,
        timeLabel: "0:20",
        text: "The mobile launch is currently tracking three weeks behind. We've had some unexpected blockers with the audio recording module on Android. We need more hands or we need to push the date.",
        isHighlighted: true,
      },
      {
        id: "t3",
        speakerId: "marcus",
        speakerName: "Marcus Lee",
        speakerInitials: "ML",
        speakerColor: "#EF9F27",
        startTime: 47,
        endTime: 72,
        timeLabel: "0:47",
        text: "I think we have to make a clear call here. Mobile or the API redesign — we can't do both at full speed with the current team size. One of them has to slip.",
      },
      {
        id: "t4",
        speakerId: "henry",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        startTime: 74,
        endTime: 98,
        timeLabel: "1:14",
        text: "Agreed. Mobile is the revenue driver this quarter. Let's prioritize it — push API to Q3 and pull two engineers over. Sarah, can you identify who makes the most sense?",
      },
      {
        id: "t5",
        speakerId: "sarah",
        speakerName: "Sarah Kim",
        speakerInitials: "SK",
        speakerColor: "#1D9E75",
        startTime: 100,
        endTime: 120,
        timeLabel: "1:40",
        text: "Yes, I'm thinking Alex and Jordan. They both have React Native experience and are mid-sprint right now so the transition timing works.",
      },
      {
        id: "t6",
        speakerId: "priya",
        speakerName: "Priya Patel",
        speakerInitials: "PP",
        speakerColor: "#378ADD",
        startTime: 122,
        endTime: 148,
        timeLabel: "2:02",
        text: "What's the impact on client commitments? We have Acme Corp expecting the API integration in May. I need to manage their expectations proactively.",
      },
      {
        id: "t7",
        speakerId: "henry",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        startTime: 150,
        endTime: 174,
        timeLabel: "2:30",
        text: "Good catch Priya. Let's give Acme a heads up this week and offer a concession — maybe an extended trial period. I'll draft that message today.",
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Draft updated Q2 roadmap with new mobile timeline",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "high",
        completed: false,
        dueDate: "Apr 25",
      },
      {
        id: "a2",
        text: "Identify and transition Alex and Jordan to mobile team",
        assignee: "Sarah Kim",
        assigneeInitials: "SK",
        assigneeColor: "#1D9E75",
        priority: "high",
        completed: false,
        dueDate: "Apr 23",
      },
      {
        id: "a3",
        text: "Communicate API delay to Acme Corp with concession offer",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        assigneeColor: "#378ADD",
        priority: "high",
        completed: false,
        dueDate: "Apr 22",
      },
      {
        id: "a4",
        text: "Move weekly sync to Tuesdays starting next week",
        assignee: "Marcus Lee",
        assigneeInitials: "ML",
        assigneeColor: "#EF9F27",
        priority: "medium",
        completed: true,
      },
    ],
    highlights: [
      {
        id: "h1",
        conversationId: "c1",
        conversationTitle: "Q2 Product Strategy Review",
        speakerName: "Sarah Kim",
        speakerInitials: "SK",
        speakerColor: "#1D9E75",
        text: "The mobile launch is currently tracking three weeks behind. We've had some unexpected blockers with the audio recording module on Android.",
        timeLabel: "0:20",
        createdAt: "Apr 21",
        tag: "Risk",
      },
    ],
  },
  {
    id: "c2",
    title: "Client Onboarding — Acme Corp",
    subtitle: "Sales · Customer Success",
    date: "Apr 20, 2026",
    dateShort: "Yesterday",
    duration: "45m",
    durationSeconds: 2700,
    status: "completed",
    spaceId: "s2",
    speakers: [SPEAKERS.henry, SPEAKERS.priya],
    wordCount: 2340,
    summary:
      "Successful onboarding call with Acme Corp. 500-seat enterprise license confirmed. Dedicated Slack channel to be set up, CSM assigned. Technical deep-dive scheduled for next Tuesday.",
    keyPoints: [
      "500-seat enterprise license confirmed",
      "Slack channel to be created within 24h",
      "Technical deep-dive scheduled for April 29",
      "Priya assigned as dedicated CSM",
    ],
    transcript: [
      {
        id: "t8",
        speakerId: "henry",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        startTime: 0,
        endTime: 25,
        timeLabel: "0:00",
        text: "Welcome to the Notura family, James! We're really excited to have Acme Corp on board. Let me hand over to Priya who will be your dedicated success manager.",
      },
      {
        id: "t9",
        speakerId: "priya",
        speakerName: "Priya Patel",
        speakerInitials: "PP",
        speakerColor: "#378ADD",
        startTime: 27,
        endTime: 55,
        timeLabel: "0:27",
        text: "Hi James! I'm so glad to be working with you. I'll be your primary point of contact throughout your journey with Notura. Let's start by walking through the onboarding checklist.",
      },
    ],
    actionItems: [
      {
        id: "a5",
        text: "Set up Acme Corp dedicated Slack channel",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        assigneeColor: "#378ADD",
        priority: "high",
        completed: true,
        dueDate: "Apr 21",
      },
      {
        id: "a6",
        text: "Schedule technical deep-dive with Acme engineering team",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "medium",
        completed: false,
        dueDate: "Apr 29",
      },
    ],
    highlights: [],
  },
  {
    id: "c3",
    title: "Series B Investor Prep",
    subtitle: "Leadership · Finance",
    date: "Apr 18, 2026",
    dateShort: "Apr 18",
    duration: "2h 10m",
    durationSeconds: 7800,
    status: "completed",
    spaceId: "s3",
    speakers: [SPEAKERS.henry, SPEAKERS.sarah],
    wordCount: 7200,
    summary:
      "Series B positioning discussed. Key metrics: 340% YoY growth, 94% retention, $2.4M ARR. Deck finalization deadline April 30. Roadshow starts May 5.",
    keyPoints: [
      "340% YoY growth to highlight",
      "$2.4M ARR — above Series B benchmarks",
      "94% net retention rate",
      "Deck due April 30, roadshow May 5",
    ],
    transcript: [],
    actionItems: [
      {
        id: "a7",
        text: "Finalize Series B investor deck",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "high",
        completed: false,
        dueDate: "Apr 30",
      },
    ],
    highlights: [
      {
        id: "h2",
        conversationId: "c3",
        conversationTitle: "Series B Investor Prep",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        text: "340% YoY growth, 94% retention, $2.4M ARR. We're well above the Series B benchmarks for our stage.",
        timeLabel: "12:30",
        createdAt: "Apr 18",
        tag: "Key Metric",
      },
    ],
  },
  {
    id: "c4",
    title: "Engineering Weekly Standup",
    subtitle: "Engineering All-Hands",
    date: "Apr 17, 2026",
    dateShort: "Apr 17",
    duration: "30m",
    durationSeconds: 1800,
    status: "processing",
    spaceId: "s1",
    speakers: [SPEAKERS.sarah, SPEAKERS.marcus],
    wordCount: 0,
    transcript: [],
    actionItems: [],
    highlights: [],
  },
  {
    id: "c5",
    title: "Design System Review",
    subtitle: "Design · Frontend",
    date: "Apr 15, 2026",
    dateShort: "Apr 15",
    duration: "1h",
    durationSeconds: 3600,
    status: "completed",
    spaceId: "s1",
    speakers: [SPEAKERS.sarah, SPEAKERS.marcus, SPEAKERS.priya],
    wordCount: 3100,
    summary:
      "Reviewed the new design system tokens. Agreed on typography scale and color palette. Component library migration plan approved — 6 week timeline starting May 1.",
    keyPoints: [
      "Typography scale finalized",
      "Color palette approved",
      "Component migration: 6 weeks from May 1",
    ],
    transcript: [],
    actionItems: [],
    highlights: [],
  },
];

export const mockSpaces: Space[] = [
  {
    id: "s1",
    name: "Engineering",
    color: "#5341CD",
    icon: "code",
    conversationCount: 3,
    description: "Engineering syncs, standups, and design reviews",
  },
  {
    id: "s2",
    name: "Sales & Success",
    color: "#1D9E75",
    icon: "briefcase",
    conversationCount: 1,
    description: "Client calls, onboarding, and account management",
  },
  {
    id: "s3",
    name: "Leadership",
    color: "#EF9F27",
    icon: "star",
    conversationCount: 1,
    description: "Strategy, fundraising, and investor relations",
  },
  {
    id: "s4",
    name: "Personal",
    color: "#378ADD",
    icon: "user",
    conversationCount: 0,
    description: "Personal notes and 1:1 recordings",
  },
];

export const mockHighlights: Highlight[] = mockConversations.flatMap(
  (c) => c.highlights ?? []
);

export const mockIntegrations: Integration[] = [
  {
    id: "i1",
    name: "Zoom",
    icon: "video",
    description: "Auto-join and record Zoom meetings",
    connected: true,
    color: "#2D8CFF",
  },
  {
    id: "i2",
    name: "Google Meet",
    icon: "monitor",
    description: "Sync with Google Calendar & auto-join",
    connected: false,
    color: "#1D9E75",
  },
  {
    id: "i3",
    name: "Microsoft Teams",
    icon: "users",
    description: "Record Teams meetings automatically",
    connected: false,
    color: "#5341CD",
  },
  {
    id: "i4",
    name: "Notion",
    icon: "file-text",
    description: "Export summaries to Notion pages",
    connected: true,
    color: "#1A1A36",
  },
  {
    id: "i5",
    name: "Slack",
    icon: "message-square",
    description: "Share summaries to Slack channels",
    connected: false,
    color: "#E01E5A",
  },
  {
    id: "i6",
    name: "Google Calendar",
    icon: "calendar",
    description: "Import meetings and auto-record",
    connected: true,
    color: "#EF9F27",
  },
];

export const mockStats = {
  totalConversations: 18,
  totalHours: "24h 15m",
  avgMeetingLength: "48m",
  openActionItems: 6,
  thisWeekConversations: 5,
  talkToListenRatio: 42,
  topTopics: ["mobile", "roadmap", "API", "design", "Series B", "budget"],
};
