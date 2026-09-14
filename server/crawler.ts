import type { ScrapedEvent, ScrapedPage, ScrapedPost, SiteAnalysisData } from '../src/types';

const BASE_URL = 'https://adenauer-bonn.de';

// In-memory cache
let cachedAnalysis: SiteAnalysisData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectCohort(title: string): string {
  const match = title.match(/\b([5-9]|10)[a-d]?\b|\b(Q1|Q2|EF)\b/i);
  if (match) return match[0].toUpperCase();
  if (/unterstufe/i.test(title)) return 'Unterstufe (5-7)';
  if (/mittelstufe/i.test(title)) return 'Mittelstufe (8-10)';
  if (/oberstufe/i.test(title)) return 'Oberstufe (EF-Q2)';
  return 'Alle Stufen';
}

function isExamEvent(title: string): boolean {
  return /vokabel|test|arbeit|klausur|klassenarbeit|prüf/i.test(title);
}

export async function crawlAdenauerWebsite(forceRefresh = false): Promise<SiteAnalysisData> {
  const now = Date.now();
  if (!forceRefresh && cachedAnalysis && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedAnalysis;
  }

  const posts: ScrapedPost[] = [];
  const events: ScrapedEvent[] = [];
  const pages: ScrapedPage[] = [];

  // 1. Fetch latest posts from WordPress REST API
  try {
    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts?per_page=15&_embed=1`, {
      headers: { 'User-Agent': 'KAG-Bonn-Parent-Newsletter-Bot/1.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const data = (await res.json()) as any[];
      for (const item of data) {
        posts.push({
          id: item.id,
          title: stripHtml(item.title?.rendered || 'Ohne Titel'),
          link: item.link,
          date: item.date,
          excerpt: stripHtml(item.excerpt?.rendered || ''),
          contentPreview: stripHtml(item.content?.rendered || '').slice(0, 1000),
        });
      }
    }
  } catch (err) {
    console.error('Failed to fetch posts from adenauer-bonn.de:', err);
  }

  // 2. Fetch Tribe events / calendar
  try {
    const res = await fetch(`${BASE_URL}/wp-json/tribe/events/v1/events?per_page=35`, {
      headers: { 'User-Agent': 'KAG-Bonn-Parent-Newsletter-Bot/1.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      if (Array.isArray(data.events)) {
        for (const ev of data.events) {
          const rawTitle = stripHtml(ev.title || '');
          events.push({
            id: ev.id,
            title: rawTitle,
            startDate: ev.start_date || '',
            endDate: ev.end_date || '',
            description: stripHtml(ev.description || ''),
            cohort: detectCohort(rawTitle),
            isExam: isExamEvent(rawTitle),
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Tribe events from adenauer-bonn.de:', err);
  }

  // 2b. If events are sparse, try iCal feed as supplement
  if (events.length < 5) {
    try {
      const iCalRes = await fetch(`${BASE_URL}/klassenarbeitstermine/?ical=1`, {
        headers: { 'User-Agent': 'KAG-Bonn-Parent-Newsletter-Bot/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (iCalRes.ok) {
        const text = await iCalRes.text();
        const items = text.split('BEGIN:VEVENT');
        for (let i = 1; i < items.length; i++) {
          const block = items[i];
          const summaryMatch = block.match(/SUMMARY:(.*?)(?:\r?\n[A-Z]|\r?\n\r?\n|$)/s);
          const dtstartMatch = block.match(/DTSTART[^:]*:(.*?)\r?\n/);
          const dtendMatch = block.match(/DTEND[^:]*:(.*?)\r?\n/);
          const descMatch = block.match(/DESCRIPTION:(.*?)(?:\r?\n[A-Z]|\r?\n\r?\n|$)/s);

          const title = stripHtml(summaryMatch ? summaryMatch[1].replace(/\r?\n\s*/g, '') : '');
          const dtstart = dtstartMatch ? dtstartMatch[1].trim() : '';
          const dtend = dtendMatch ? dtendMatch[1].trim() : '';
          const desc = stripHtml(descMatch ? descMatch[1].replace(/\r?\n\s*/g, '') : '');

          if (title && !events.some((e) => e.title === title)) {
            // format YYYYMMDD or YYYYMMDDTHHMMSS
            let formattedDate = dtstart;
            if (dtstart.length >= 8) {
              formattedDate = `${dtstart.slice(0, 4)}-${dtstart.slice(4, 6)}-${dtstart.slice(6, 8)}`;
            }
            events.push({
              id: `ical-${i}`,
              title,
              startDate: formattedDate,
              endDate: dtend,
              description: desc,
              cohort: detectCohort(title),
              isExam: isExamEvent(title),
            });
          }
        }
      }
    } catch (icalErr) {
      console.error('Failed to parse iCal feed:', icalErr);
    }
  }

  // 3. Fetch key static/informational pages for parents (Mensa, Schulpflegschaft, Klassenarbeiten)
  const keySlugs = ['mensa', 'schulpflegschaft', 'klassenarbeiten', 'schulsozialarbeit', 'schulbucher'];
  for (const slug of keySlugs) {
    try {
      const pageRes = await fetch(`${BASE_URL}/wp-json/wp/v2/pages?slug=${slug}`, {
        headers: { 'User-Agent': 'KAG-Bonn-Parent-Newsletter-Bot/1.0' },
        signal: AbortSignal.timeout(8000),
      });
      if (pageRes.ok) {
        const pageData = (await pageRes.json()) as any[];
        if (pageData && pageData.length > 0) {
          const item = pageData[0];
          pages.push({
            id: item.id,
            title: stripHtml(item.title?.rendered || slug),
            slug: item.slug,
            link: item.link,
            contentPreview: stripHtml(item.content?.rendered || '').slice(0, 1200),
          });
        }
      }
    } catch (slugErr) {
      console.warn(`Failed to fetch page slug ${slug}:`, slugErr);
    }
  }

  // Compute stats
  const result: SiteAnalysisData = {
    lastCrawled: new Date().toISOString(),
    sourceUrl: BASE_URL,
    status: posts.length > 0 || events.length > 0 ? 'ready' : 'error',
    errorMessage: posts.length === 0 && events.length === 0 ? 'Could not retrieve data from adenauer-bonn.de' : undefined,
    stats: {
      totalPosts: posts.length,
      totalEvents: events.length,
      upcomingEventsCount: events.length,
      recentNewsCount: posts.length,
    },
    posts,
    events,
    pages,
  };

  cachedAnalysis = result;
  lastFetchTime = now;
  return result;
}

export function getCachedAnalysis(): SiteAnalysisData | null {
  return cachedAnalysis;
}
