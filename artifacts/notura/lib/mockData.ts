export type ConversationStatus = "completed" | "recording" | "processing" | "failed";
export type TaskPriority = "high" | "medium" | "low";
export type ActionItemStatus = "todo" | "in_progress" | "done";
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
  description?: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  priority: TaskPriority;
  status: ActionItemStatus;
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
  recordedAt?: string;
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

function minutesAgoIso(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
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
    title: "Revisão da Estratégia Q2",
    subtitle: "Produto · Engenharia · Design",
    date: "21 abr 2026",
    dateShort: "Hoje",
    recordedAt: minutesAgoIso(30),
    duration: "1h 24m",
    durationSeconds: 5040,
    status: "completed",
    spaceId: "s1",
    speakers: [SPEAKERS.henry, SPEAKERS.sarah, SPEAKERS.marcus],
    wordCount: 5820,
    summary:
      "O time alinhou as prioridades do Q2: lançamento mobile movido para 15 de maio, redesign da API adiado para o Q3. Dois engenheiros realocados para o time mobile. Henry vai redigir o roadmap atualizado até o fim da semana. Orçamento de marketing Q2 aprovado em R$120K.",
    keyPoints: [
      "Lançamento mobile movido para 15 de maio",
      "Redesign da API adiado para o Q3",
      "2 engenheiros realocados da API para mobile",
      "Orçamento de marketing Q2 aprovado: R$120K",
      "Syncs semanais alterados para terças-feiras",
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
        text: "Certo, vamos começar a revisão da estratégia do Q2. Quero começar analisando onde estamos nos nossos OKRs antes de tomar qualquer decisão.",
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
        text: "O lançamento mobile está com três semanas de atraso. Tivemos bloqueios inesperados com o módulo de gravação de áudio no Android. Precisamos de mais pessoas ou precisamos adiar a data.",
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
        text: "Acho que precisamos tomar uma decisão clara. Mobile ou redesign da API — não dá pra fazer os dois em velocidade máxima com o tamanho atual do time. Um deles vai ter que atrasar.",
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
        text: "Concordo. Mobile é o gerador de receita deste trimestre. Vamos priorizá-lo — empurrar a API para o Q3 e trazer dois engenheiros. Sarah, você consegue identificar quem faz mais sentido?",
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
        text: "Sim, estou pensando em Alex e Jordan. Os dois têm experiência em React Native e estão no meio de uma sprint, então o timing da transição funciona.",
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
        text: "Qual é o impacto nos compromissos com clientes? A Acme Corp está esperando a integração da API em maio. Preciso gerenciar as expectativas deles de forma proativa.",
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
        text: "Bom ponto, Priya. Vamos avisar a Acme esta semana e oferecer uma concessão — talvez um período de trial estendido. Vou redigir essa mensagem hoje.",
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Redigir roadmap Q2 atualizado com novo cronograma mobile",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "high",
        status: "todo",
        completed: false,
        dueDate: "25 abr",
      },
      {
        id: "a2",
        text: "Identificar e transferir Alex e Jordan para o time mobile",
        assignee: "Sarah Kim",
        assigneeInitials: "SK",
        assigneeColor: "#1D9E75",
        priority: "high",
        status: "in_progress",
        completed: false,
        dueDate: "23 abr",
      },
      {
        id: "a3",
        text: "Comunicar atraso da API à Acme Corp com oferta de concessão",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        assigneeColor: "#378ADD",
        priority: "high",
        status: "todo",
        completed: false,
        dueDate: "22 abr",
      },
      {
        id: "a4",
        text: "Mudar sync semanal para terças-feiras a partir da próxima semana",
        assignee: "Marcus Lee",
        assigneeInitials: "ML",
        assigneeColor: "#EF9F27",
        priority: "medium",
        status: "done",
        completed: true,
      },
    ],
    highlights: [
      {
        id: "h1",
        conversationId: "c1",
        conversationTitle: "Revisão da Estratégia Q2",
        speakerName: "Sarah Kim",
        speakerInitials: "SK",
        speakerColor: "#1D9E75",
        text: "O lançamento mobile está com três semanas de atraso. Tivemos bloqueios inesperados com o módulo de gravação de áudio no Android.",
        timeLabel: "0:20",
        createdAt: "21 abr",
        tag: "Risco",
      },
    ],
  },
  {
    id: "c2",
    title: "Onboarding — Acme Corp",
    subtitle: "Vendas · Sucesso do Cliente",
    date: "20 abr 2026",
    dateShort: "Ontem",
    duration: "45m",
    durationSeconds: 2700,
    status: "completed",
    spaceId: "s2",
    speakers: [SPEAKERS.henry, SPEAKERS.priya],
    wordCount: 2340,
    summary:
      "Chamada de onboarding bem-sucedida com a Acme Corp. Licença enterprise de 500 assentos confirmada. Canal dedicado no Slack a ser criado, CSM designado. Aprofundamento técnico agendado para a próxima terça.",
    keyPoints: [
      "Licença enterprise de 500 assentos confirmada",
      "Canal Slack a ser criado em até 24h",
      "Aprofundamento técnico agendado para 29 de abril",
      "Priya designada como CSM dedicada",
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
        text: "Bem-vindo à família Notura, James! Estamos muito animados em ter a Acme Corp conosco. Deixa eu passar para a Priya, que será sua gerente de sucesso dedicada.",
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
        text: "Olá James! Estou muito feliz em trabalhar com você. Serei seu ponto de contato principal durante toda a sua jornada com o Notura. Vamos começar passando pelo checklist de onboarding.",
      },
    ],
    actionItems: [
      {
        id: "a5",
        text: "Criar canal Slack dedicado para a Acme Corp",
        assignee: "Priya Patel",
        assigneeInitials: "PP",
        assigneeColor: "#378ADD",
        priority: "high",
        status: "done",
        completed: true,
        dueDate: "21 abr",
      },
      {
        id: "a6",
        text: "Agendar aprofundamento técnico com time de engenharia da Acme",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "medium",
        status: "todo",
        completed: false,
        dueDate: "29 abr",
      },
    ],
    highlights: [],
  },
  {
    id: "c3",
    title: "Preparação para Investidores — Série B",
    subtitle: "Liderança · Finanças",
    date: "18 abr 2026",
    dateShort: "18 abr",
    duration: "2h 10m",
    durationSeconds: 7800,
    status: "completed",
    spaceId: "s3",
    speakers: [SPEAKERS.henry, SPEAKERS.sarah],
    wordCount: 7200,
    summary:
      "Posicionamento para a Série B discutido. Métricas principais: crescimento de 340% YoY, retenção de 94%, ARR de R$2,4M. Prazo de finalização do deck: 30 de abril. Roadshow começa em 5 de maio.",
    keyPoints: [
      "Crescimento de 340% YoY a destacar",
      "ARR de R$2,4M — acima dos benchmarks de Série B",
      "Taxa de retenção líquida de 94%",
      "Deck até 30 de abril, roadshow 5 de maio",
    ],
    transcript: [],
    actionItems: [
      {
        id: "a7",
        text: "Finalizar deck de investidores para Série B",
        assignee: "Henry Costa",
        assigneeInitials: "HC",
        assigneeColor: "#5341CD",
        priority: "high",
        status: "in_progress",
        completed: false,
        dueDate: "30 abr",
      },
    ],
    highlights: [
      {
        id: "h2",
        conversationId: "c3",
        conversationTitle: "Preparação para Investidores — Série B",
        speakerName: "Henry Costa",
        speakerInitials: "HC",
        speakerColor: "#5341CD",
        text: "340% de crescimento YoY, retenção de 94%, ARR de R$2,4M. Estamos bem acima dos benchmarks de Série B para nosso estágio.",
        timeLabel: "12:30",
        createdAt: "18 abr",
        tag: "Métrica",
      },
    ],
  },
  {
    id: "c4",
    title: "Standup Semanal de Engenharia",
    subtitle: "Engenharia Geral",
    date: "17 abr 2026",
    dateShort: "17 abr",
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
    title: "Revisão do Design System",
    subtitle: "Design · Frontend",
    date: "15 abr 2026",
    dateShort: "15 abr",
    duration: "1h",
    durationSeconds: 3600,
    status: "completed",
    spaceId: "s1",
    speakers: [SPEAKERS.sarah, SPEAKERS.marcus, SPEAKERS.priya],
    wordCount: 3100,
    summary:
      "Revisão dos novos tokens do design system. Acordo sobre a escala tipográfica e a paleta de cores. Plano de migração da biblioteca de componentes aprovado — prazo de 6 semanas a partir de 1 de maio.",
    keyPoints: [
      "Escala tipográfica finalizada",
      "Paleta de cores aprovada",
      "Migração de componentes: 6 semanas a partir de 1 de maio",
    ],
    transcript: [],
    actionItems: [],
    highlights: [],
  },
];

export const mockSpaces: Space[] = [
  {
    id: "s1",
    name: "Engenharia",
    color: "#5341CD",
    icon: "code",
    conversationCount: 3,
    description: "Syncs, standups e revisões de design",
  },
  {
    id: "s2",
    name: "Vendas",
    color: "#1D9E75",
    icon: "briefcase",
    conversationCount: 1,
    description: "Chamadas de clientes, onboarding e gestão de contas",
  },
  {
    id: "s3",
    name: "Liderança",
    color: "#EF9F27",
    icon: "star",
    conversationCount: 1,
    description: "Estratégia, captação e relações com investidores",
  },
  {
    id: "s4",
    name: "Pessoal",
    color: "#378ADD",
    icon: "user",
    conversationCount: 0,
    description: "Notas pessoais e gravações 1:1",
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
    description: "Entrar e gravar reuniões do Zoom automaticamente",
    connected: true,
    color: "#2D8CFF",
  },
  {
    id: "i2",
    name: "Google Meet",
    icon: "monitor",
    description: "Sincronizar com Google Calendar e entrar automaticamente",
    connected: false,
    color: "#1D9E75",
  },
  {
    id: "i3",
    name: "Microsoft Teams",
    icon: "users",
    description: "Gravar reuniões do Teams automaticamente",
    connected: false,
    color: "#5341CD",
  },
  {
    id: "i4",
    name: "Notion",
    icon: "file-text",
    description: "Exportar resumos para páginas do Notion",
    connected: true,
    color: "#1A1A36",
  },
  {
    id: "i5",
    name: "Slack",
    icon: "message-square",
    description: "Compartilhar resumos em canais do Slack",
    connected: false,
    color: "#E01E5A",
  },
  {
    id: "i6",
    name: "Google Agenda",
    icon: "calendar",
    description: "Importar reuniões e gravar automaticamente",
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
  topTopics: ["mobile", "roadmap", "API", "design", "Série B", "orçamento"],
};
