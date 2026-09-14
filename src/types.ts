export interface ScrapedPost {
  id: number;
  title: string;
  link: string;
  date: string;
  excerpt: string;
  categoryNames?: string[];
  contentPreview?: string;
}

export interface ScrapedEvent {
  id: string | number;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  cohort?: string; // e.g. "6a", "8B", "Q1", "Alle"
  isExam?: boolean;
}

export interface ScrapedPage {
  id: number;
  title: string;
  slug: string;
  link: string;
  contentPreview: string;
}

export interface SiteAnalysisData {
  lastCrawled: string;
  sourceUrl: string;
  status: 'idle' | 'crawling' | 'ready' | 'error';
  errorMessage?: string;
  stats: {
    totalPosts: number;
    totalEvents: number;
    upcomingEventsCount: number;
    recentNewsCount: number;
  };
  posts: ScrapedPost[];
  events: ScrapedEvent[];
  pages: ScrapedPage[];
}

export interface NewsletterSummary {
  id: string;
  weekLabel: string; // e.g. "KW 38 (14.09. – 20.09.2026)"
  generatedAt: string;
  headline: string;
  greeting: string;
  executiveHighlights: {
    title: string;
    detail: string;
    urgent?: boolean;
    tag?: string;
    sourceUrl?: string;
  }[];
  gradeLevelSections: {
    gradeBand: string; // "Unterstufe (5-7)" | "Mittelstufe (8-10)" | "Oberstufe (EF-Q2)" | "Schulweit"
    items: {
      title: string;
      date?: string;
      description: string;
      actionItem?: string;
    }[];
  }[];
  upcomingExamsAndEvents: {
    date: string;
    time?: string;
    title: string;
    cohort: string;
    type: 'exam' | 'event' | 'holiday' | 'meeting';
    details?: string;
  }[];
  schoolLifeAndProjects: {
    title: string;
    summary: string;
    sourceUrl?: string;
    category?: string;
  }[];
  parentTipsAndMensa: {
    mensaNotes: string;
    importantContacts: { role: string; contact: string }[];
    actionDeadlines: { task: string; deadline: string }[];
  };
  closingNote: string;
  grade5Focus?: {
    title: string;
    keyPoints: string[];
    parentAction?: string;
  };
  rawHtml: string;
  language: 'de' | 'en' | 'ru';
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  grades: string[];
  language: 'de' | 'en' | 'ru';
  active: boolean;
  createdAt: string;
}

export interface DeliveryLog {
  id: string;
  newsletterId: string;
  newsletterTitle: string;
  sentAt: string;
  recipientCount: number;
  recipients: string[];
  status: 'delivered' | 'simulated' | 'failed';
  method: 'smtp' | 'direct_preview' | 'manual_dispatch';
  note?: string;
}

export interface ScheduleConfig {
  enabled: boolean;
  dayOfWeek: number | string;
  time?: string;
  timeOfDay?: string;
  autoSend?: boolean;
  targetLanguage?: 'de' | 'en' | 'ru';
  language?: 'de' | 'en' | 'ru';
  lastRunAt?: string;
}
