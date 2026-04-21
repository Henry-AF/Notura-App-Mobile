export type MeetingStatus = "completed" | "processing" | "failed";
export type TaskPriority = "high" | "medium" | "low";

export interface Meeting {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  duration: string;
  status: MeetingStatus;
  participants: number;
  summary?: string;
  tasks?: Task[];
  transcript?: TranscriptSegment[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  tags: string[];
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  completed: boolean;
  dueDate?: string;
  meetingId?: string;
}

export interface TranscriptSegment {
  speaker: string;
  speakerInitials: string;
  time: string;
  text: string;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  meetingsCount: number;
  lastMeeting?: string;
}

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Q2 Product Strategy Review",
    subtitle: "Product · Engineering · Design",
    date: "Apr 21, 2026",
    duration: "1h 24m",
    status: "completed",
    participants: 8,
    summary:
      "The team reviewed Q2 OKRs and agreed to prioritize the mobile launch over the API redesign. Key decisions: bump mobile release to May 15, freeze API changes until Q3, allocate 2 more engineers to the mobile team. Henry to draft revised roadmap by EOW.",
    tasks: [
      {
        id: "t1",
        title: "Draft revised Q2 roadmap",
        description: "Include mobile launch timeline and resource allocation",
        priority: "high",
        tags: ["this week", "roadmap"],
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        completed: false,
        dueDate: "Apr 25",
        meetingId: "1",
      },
      {
        id: "t2",
        title: "Freeze API change requests",
        description: "Communicate the freeze to all stakeholders",
        priority: "high",
        tags: ["urgent"],
        assignee: "Sarah Kim",
        assigneeInitials: "SK",
        assigneeColor: "#1D9E75",
        completed: true,
        meetingId: "1",
      },
      {
        id: "t3",
        title: "Allocate 2 engineers to mobile team",
        description: "Coordinate with HR and team leads",
        priority: "medium",
        tags: ["this week", "people"],
        assignee: "Marcus Lee",
        assigneeInitials: "ML",
        assigneeColor: "#EF9F27",
        completed: false,
        dueDate: "Apr 23",
        meetingId: "1",
      },
    ],
    transcript: [
      {
        speaker: "Henry Costa",
        speakerInitials: "HC",
        time: "0:00",
        text: "Alright, let's kick off the Q2 strategy review. I want to start by looking at where we stand on our OKRs.",
      },
      {
        speaker: "Sarah Kim",
        speakerInitials: "SK",
        time: "0:45",
        text: "The mobile launch is currently tracking behind schedule. We're looking at a 3-week delay unless we pull in more resources.",
      },
      {
        speaker: "Marcus Lee",
        speakerInitials: "ML",
        time: "1:30",
        text: "I think we need to make a call — mobile or the API redesign. We can't do both at full speed.",
      },
      {
        speaker: "Henry Costa",
        speakerInitials: "HC",
        time: "2:15",
        text: "Agreed. Let's prioritize mobile. We push the API to Q3 and move two engineers from the API team over.",
      },
    ],
  },
  {
    id: "2",
    title: "Client Onboarding — Acme Corp",
    subtitle: "Sales · Customer Success",
    date: "Apr 20, 2026",
    duration: "45m",
    status: "completed",
    participants: 4,
    summary:
      "Acme Corp onboarding call went well. Client confirmed 500-seat enterprise license. Need to set up dedicated Slack channel, assign CSM, and schedule technical deep-dive for next Tuesday.",
    tasks: [
      {
        id: "t4",
        title: "Set up Acme Corp Slack channel",
        priority: "high",
        tags: ["today"],
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        assigneeColor: "#378ADD",
        completed: false,
        dueDate: "Apr 21",
        meetingId: "2",
      },
      {
        id: "t5",
        title: "Schedule technical deep-dive",
        priority: "medium",
        tags: ["this week"],
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        completed: false,
        dueDate: "Apr 29",
        meetingId: "2",
      },
    ],
    transcript: [],
  },
  {
    id: "3",
    title: "Weekly Engineering Standup",
    subtitle: "Engineering All Hands",
    date: "Apr 19, 2026",
    duration: "30m",
    status: "processing",
    participants: 12,
    tasks: [],
    transcript: [],
  },
  {
    id: "4",
    title: "Investor Update — Series B Prep",
    subtitle: "Leadership · Finance",
    date: "Apr 18, 2026",
    duration: "2h 10m",
    status: "completed",
    participants: 5,
    summary:
      "Discussed Series B positioning. Key metrics to highlight: 340% YoY growth, 94% retention, $2.4M ARR. Deck needs to be finalized by April 30th for roadshow starting May 5th.",
    tasks: [
      {
        id: "t6",
        title: "Finalize Series B investor deck",
        priority: "high",
        tags: ["April 30", "critical"],
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        completed: false,
        dueDate: "Apr 30",
        meetingId: "4",
      },
    ],
    transcript: [],
  },
  {
    id: "5",
    title: "Design System Sync",
    subtitle: "Design · Frontend",
    date: "Apr 17, 2026",
    duration: "1h",
    status: "failed",
    participants: 3,
    tasks: [],
    transcript: [],
  },
];

export const mockTasks: Task[] = [
  ...mockMeetings.flatMap((m) => m.tasks ?? []),
];

export const mockContacts: Contact[] = [
  {
    id: "c1",
    name: "Sarah Kim",
    initials: "SK",
    color: "#1D9E75",
    role: "Head of Engineering",
    company: "Notura",
    email: "sarah.kim@notura.ai",
    phone: "+1 (555) 234-5678",
    meetingsCount: 14,
    lastMeeting: "Apr 21",
  },
  {
    id: "c2",
    name: "Marcus Lee",
    initials: "ML",
    color: "#EF9F27",
    role: "Product Manager",
    company: "Notura",
    email: "marcus.lee@notura.ai",
    phone: "+1 (555) 345-6789",
    meetingsCount: 11,
    lastMeeting: "Apr 21",
  },
  {
    id: "c3",
    name: "Priya Patel",
    initials: "PP",
    color: "#378ADD",
    role: "Customer Success Manager",
    company: "Notura",
    email: "priya.patel@notura.ai",
    phone: "+1 (555) 456-7890",
    meetingsCount: 8,
    lastMeeting: "Apr 20",
  },
  {
    id: "c4",
    name: "James Rivera",
    initials: "JR",
    color: "#E24B4A",
    role: "CTO",
    company: "Acme Corp",
    email: "james.rivera@acmecorp.com",
    phone: "+1 (555) 567-8901",
    meetingsCount: 3,
    lastMeeting: "Apr 20",
  },
  {
    id: "c5",
    name: "Elena Volkov",
    initials: "EV",
    color: "#5341CD",
    role: "Investor",
    company: "Sequoia Capital",
    email: "elena.volkov@sequoia.com",
    phone: "+1 (555) 678-9012",
    meetingsCount: 2,
    lastMeeting: "Apr 18",
  },
  {
    id: "c6",
    name: "Tom Walsh",
    initials: "TW",
    color: "#707090",
    role: "VP of Sales",
    company: "Notura",
    email: "tom.walsh@notura.ai",
    phone: "+1 (555) 789-0123",
    meetingsCount: 6,
    lastMeeting: "Apr 17",
  },
];

export const mockStats = {
  meetingsThisMonth: 18,
  openTasks: 7,
  timeSaved: "12h 30m",
  completionRate: 78,
};

export const mockInsight = {
  title: "AI Insight",
  text: "You're most productive on Tuesday mornings. 73% of your high-priority tasks from meetings this week were completed within 24 hours — that's up 15% from last week.",
  badge: "Weekly Summary",
};
