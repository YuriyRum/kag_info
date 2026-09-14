import fs from 'fs';
import path from 'path';
import type { DeliveryLog, NewsletterSummary, ScheduleConfig, Subscriber } from '../src/types';

interface StoreData {
  subscribers: Subscriber[];
  newsletters: NewsletterSummary[];
  deliveryLogs: DeliveryLog[];
  schedule: ScheduleConfig;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-user-primary',
    name: 'Parent User',
    email: 'rumyua@gmail.com',
    grades: ['5a', '8b'],
    language: 'de',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    name: 'Dr. Susanne Becker (Schulpflegschaft)',
    email: 'elternvertretung.becker@beispiel.de',
    grades: ['6b', 'Q1'],
    language: 'de',
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'sub-3',
    name: 'Marc & Elena DuPont (International Parent)',
    email: 'elena.dupont@international-bonn.org',
    grades: ['7b', '10a'],
    language: 'en',
    active: true,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'sub-4',
    name: 'Florian Wagner',
    email: 'f.wagner.bonn@posteo.de',
    grades: ['5c'],
    language: 'de',
    active: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const INITIAL_SCHEDULE: ScheduleConfig = {
  enabled: true,
  dayOfWeek: 1, // Monday
  time: '07:30',
  autoSend: true,
  targetLanguage: 'de',
  lastRunAt: undefined,
};

function ensureStoreExists(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    const initial: StoreData = {
      subscribers: INITIAL_SUBSCRIBERS,
      newsletters: [],
      deliveryLogs: [],
      schedule: INITIAL_SCHEDULE,
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const content = fs.readFileSync(STORE_FILE, 'utf-8');
    const data = JSON.parse(content) as StoreData;
    // ensure rumyua@gmail.com is present
    if (!data.subscribers.some((s) => s.email.toLowerCase() === 'rumyua@gmail.com')) {
      data.subscribers.unshift(INITIAL_SUBSCRIBERS[0]);
      saveStore(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading store file, recreating with defaults:', err);
    const initial: StoreData = {
      subscribers: INITIAL_SUBSCRIBERS,
      newsletters: [],
      deliveryLogs: [],
      schedule: INITIAL_SCHEDULE,
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store file:', err);
  }
}

export const store = {
  getSubscribers(): Subscriber[] {
    const data = ensureStoreExists();
    return data.subscribers;
  },

  addSubscriber(subscriber: Omit<Subscriber, 'id' | 'createdAt'>): Subscriber {
    const data = ensureStoreExists();
    const existing = data.subscribers.find(
      (s) => s.email.toLowerCase() === subscriber.email.trim().toLowerCase()
    );
    if (existing) {
      existing.name = subscriber.name;
      existing.grades = subscriber.grades;
      existing.language = subscriber.language;
      existing.active = subscriber.active;
      saveStore(data);
      return existing;
    }

    const newSub: Subscriber = {
      ...subscriber,
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    data.subscribers.push(newSub);
    saveStore(data);
    return newSub;
  },

  updateSubscriber(id: string, updates: Partial<Subscriber>): Subscriber | null {
    const data = ensureStoreExists();
    const idx = data.subscribers.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    data.subscribers[idx] = { ...data.subscribers[idx], ...updates };
    saveStore(data);
    return data.subscribers[idx];
  },

  deleteSubscriber(id: string): boolean {
    const data = ensureStoreExists();
    const initialLen = data.subscribers.length;
    data.subscribers = data.subscribers.filter((s) => s.id !== id);
    if (data.subscribers.length !== initialLen) {
      saveStore(data);
      return true;
    }
    return false;
  },

  getNewsletters(): NewsletterSummary[] {
    const data = ensureStoreExists();
    return data.newsletters;
  },

  getNewsletterById(id: string): NewsletterSummary | undefined {
    const data = ensureStoreExists();
    return data.newsletters.find((n) => n.id === id);
  },

  saveNewsletter(newsletter: NewsletterSummary): void {
    const data = ensureStoreExists();
    const existingIndex = data.newsletters.findIndex((n) => n.id === newsletter.id);
    if (existingIndex >= 0) {
      data.newsletters[existingIndex] = newsletter;
    } else {
      data.newsletters.unshift(newsletter);
    }
    saveStore(data);
  },

  getDeliveryLogs(): DeliveryLog[] {
    const data = ensureStoreExists();
    return data.deliveryLogs;
  },

  addDeliveryLog(log: Omit<DeliveryLog, 'id' | 'sentAt'>): DeliveryLog {
    const data = ensureStoreExists();
    const newLog: DeliveryLog = {
      ...log,
      id: `log-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    data.deliveryLogs.unshift(newLog);
    saveStore(data);
    return newLog;
  },

  getSchedule(): ScheduleConfig {
    const data = ensureStoreExists();
    return data.schedule || INITIAL_SCHEDULE;
  },

  updateSchedule(updates: Partial<ScheduleConfig>): ScheduleConfig {
    const data = ensureStoreExists();
    data.schedule = { ...data.schedule, ...updates };
    saveStore(data);
    return data.schedule;
  },
};
