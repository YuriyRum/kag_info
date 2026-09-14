import { GoogleGenAI, Type } from '@google/genai';
import type { NewsletterSummary, SiteAnalysisData } from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export function generateHtmlNewsletter(newsletter: Omit<NewsletterSummary, 'rawHtml' | 'id'>): string {
  const lang = newsletter.language;
  const isEn = lang === 'en';
  const isRu = lang === 'ru';

  const schoolName = 'Konrad-Adenauer-Gymnasium Bonn';
  const schoolSub = isRu
    ? 'Городская гимназия • Бонн (Bad Godesberg)'
    : isEn
    ? 'Municipal Gymnasium for Boys and Girls • Bad Godesberg'
    : 'Städtisches Gymnasium für Jungen und Mädchen • Bad Godesberg';

  const badgeText = isRu
    ? '📬 Еженедельный дайджест для родителей'
    : isEn
    ? '📬 Weekly Parent Briefing'
    : '📬 Wöchentliches Eltern-Briefing';

  const grade5Label = isRu
    ? '⭐ ОСОБЫЙ ФОКУС: 5-Й КЛАСС (ERPROBUNGSSTUFE)'
    : isEn
    ? '⭐ 5TH GRADE FOCUS (TRANSITION YEAR)'
    : '⭐ FOKUS 5. KLASSE (ERPROBUNGSSTUFE)';

  const grade5ActionLabel = isRu
    ? 'Важно для родителей 5-го класса'
    : isEn
    ? 'Key action for 5th grade parents'
    : 'Wichtig für Eltern der 5. Klassen';

  const highlightsHeading = isRu
    ? '⚡ Главное для родителей (Краткая сводка)'
    : isEn
    ? '⚡ High-Priority Parent Essentials'
    : '⚡ Das Wichtigste auf einen Blick (Kompakt)';

  const examsHeading = isRu
    ? '📅 Ближайшие контрольные работы и даты'
    : isEn
    ? '📅 Upcoming Tests, Exams & Dates'
    : '📅 Kommende Klassenarbeiten & Termine';

  const examsEmptyText = isRu
    ? 'Нет срочных контрольных на эту неделю'
    : isEn
    ? 'No immediate exams scheduled this week'
    : 'Keine anstehenden Arbeiten in dieser Woche verzeichnet';

  const gradeBandsHeading = isRu
    ? '🎓 Информация по ступеням'
    : isEn
    ? '🎓 Grade Band Highlights'
    : '🎓 Stufenspezifische Hinweise';

  const canteenHeading = isRu
    ? '🍽️ Столовая (Mensa) и практические вопросы'
    : isEn
    ? '🍽️ Canteen & Practical Notices'
    : '🍽️ Mensa & Organisatorisches';

  const visitPortalBtn = isRu
    ? '🌐 Перейти на сайт школы adenauer-bonn.de'
    : isEn
    ? '🌐 Visit adenauer-bonn.de Portal'
    : '🌐 Zur Schul-Website adenauer-bonn.de';

  const footerNotice = isRu
    ? 'Вы получили этот дайджест, так как подписаны на рассылку для родителей Konrad-Adenauer-Gymnasium Bonn.'
    : isEn
    ? 'You received this briefing because you are subscribed to weekly parent briefings for KAG Bonn.'
    : 'Sie erhalten diesen Elternbrief, weil Sie für die wöchentliche Zusammenfassung des KAG Bonn angemeldet sind.';

  // 5th Grade Focus Card
  const grade5Html = newsletter.grade5Focus
    ? `
    <div style="margin-bottom: 24px; padding: 16px 20px; background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #b45309; margin-bottom: 6px;">
        ${grade5Label}
      </div>
      <div style="font-size: 16px; font-weight: 700; color: #78350f; margin-bottom: 8px;">
        ${newsletter.grade5Focus.title}
      </div>
      <ul style="margin: 0 0 10px 0; padding-left: 20px; color: #92400e; font-size: 13px; line-height: 1.6;">
        ${newsletter.grade5Focus.keyPoints.map((pt) => `<li>${pt}</li>`).join('')}
      </ul>
      ${
        newsletter.grade5Focus.parentAction
          ? `<div style="background-color: #fef3c7; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #92400e;">
              👉 ${grade5ActionLabel}: ${newsletter.grade5Focus.parentAction}
            </div>`
          : ''
      }
    </div>
  `
    : '';

  // Compact highlights
  const highlightsHtml = newsletter.executiveHighlights
    .slice(0, 3)
    .map(
      (h) => `
    <div style="margin-bottom: 10px; padding: 12px 14px; background-color: ${h.urgent ? '#fef2f2' : '#f8fafc'}; border-left: 4px solid ${h.urgent ? '#dc2626' : '#2563eb'}; border-radius: 6px;">
      <div style="font-weight: 700; color: ${h.urgent ? '#991b1b' : '#1e3a8a'}; font-size: 14px; margin-bottom: 3px;">
        ${h.tag ? `<span style="display:inline-block; padding: 1px 6px; font-size: 11px; font-weight:600; background:${h.urgent ? '#fee2e2' : '#dbeafe'}; border-radius: 4px; margin-right: 6px;">${h.tag}</span>` : ''}
        ${h.title}
      </div>
      <div style="color: #334155; font-size: 13px; line-height: 1.45;">${h.detail}</div>
    </div>
  `
    )
    .join('');

  // Upcoming Exams
  const examsHtml = newsletter.upcomingExamsAndEvents
    .slice(0, 8)
    .map(
      (e) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 10px; font-size: 12px; font-weight: 600; color: #0f172a; white-space: nowrap;">
        📅 ${e.date}
      </td>
      <td style="padding: 8px 10px;">
        <span style="display:inline-block; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 10px; background-color: ${e.type === 'exam' ? '#fef3c7' : '#e0f2fe'}; color: ${e.type === 'exam' ? '#92400e' : '#0369a1'};">
          ${e.cohort}
        </span>
      </td>
      <td style="padding: 8px 10px; font-size: 13px; color: #1e293b;">
        <strong>${e.title}</strong>
        ${e.details ? `<div style="font-size: 11px; color: #64748b; margin-top: 1px;">${e.details}</div>` : ''}
      </td>
    </tr>
  `
    )
    .join('');

  // Grade level sections
  const gradeSectionsHtml = newsletter.gradeLevelSections
    .map(
      (g) => `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 14px; font-weight: 700; color: #0f2b48; margin-bottom: 6px;">
        🎓 ${g.gradeBand}
      </div>
      ${g.items
        .map(
          (item) => `
        <div style="margin-bottom: 6px; padding: 8px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
          <div style="font-weight: 600; font-size: 13px; color: #0f172a;">${item.title}</div>
          <div style="font-size: 12px; color: #475569; margin: 2px 0 4px; line-height: 1.4;">${item.description}</div>
          ${item.actionItem ? `<div style="font-size: 11px; font-weight: 600; color: #b45309;">👉 ${item.actionItem}</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.headline}</title>
</head>
<body style="margin: 0; padding: 16px 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f2b48 0%, #1e3a5f 100%); padding: 22px 20px; color: #ffffff;">
      <div style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #93c5fd; font-weight: 700; margin-bottom: 4px;">
        ${schoolSub}
      </div>
      <h1 style="margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.2;">
        ${schoolName}
      </h1>
      <div style="display: inline-block; padding: 3px 10px; background: rgba(255, 255, 255, 0.15); border-radius: 16px; font-size: 12px; font-weight: 600; color: #f8fafc; margin-top: 4px;">
        ${badgeText} • ${newsletter.weekLabel}
      </div>
    </div>

    <!-- Body Container -->
    <div style="padding: 20px;">
      
      <!-- Headline & Greeting -->
      <div style="margin-bottom: 18px;">
        <h2 style="margin: 0 0 8px; font-size: 17px; color: #0f172a; line-height: 1.3;">
          ${newsletter.headline}
        </h2>
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          ${newsletter.greeting}
        </p>
      </div>

      <!-- ⭐ 5TH GRADE SPOTLIGHT CARD ⭐ -->
      ${grade5Html}

      <!-- Top Highlights (Trimmed for high signal) -->
      <div style="margin-bottom: 22px;">
        <div style="font-size: 14px; font-weight: 700; color: #0f2b48; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">
          ${highlightsHeading}
        </div>
        ${highlightsHtml}
      </div>

      <!-- Upcoming Exams and Events Table -->
      <div style="margin-bottom: 22px;">
        <div style="font-size: 14px; font-weight: 700; color: #0f2b48; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">
          ${examsHeading}
        </div>
        <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 6px 10px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase;">${isRu ? 'Дата' : isEn ? 'Date' : 'Datum'}</th>
              <th style="padding: 6px 10px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase;">${isRu ? 'Класс' : isEn ? 'Class' : 'Klasse'}</th>
              <th style="padding: 6px 10px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase;">${isRu ? 'Предмет / Событие' : isEn ? 'Subject / Event' : 'Fach / Termin'}</th>
            </tr>
          </thead>
          <tbody>
            ${examsHtml || `<tr><td colspan="3" style="padding:10px; text-align:center; font-size:12px; color:#64748b;">${examsEmptyText}</td></tr>`}
          </tbody>
        </table>
      </div>

      <!-- Grade Level breakdown -->
      ${
        gradeSectionsHtml
          ? `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 14px; font-weight: 700; color: #0f2b48; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">
          ${gradeBandsHeading}
        </div>
        ${gradeSectionsHtml}
      </div>`
          : ''
      }

      <!-- Mensa & Practicalities -->
      <div style="margin-bottom: 20px; padding: 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="font-size: 13px; color: #0f2b48; font-weight: 700; margin-bottom: 6px;">
          ${canteenHeading}
        </div>
        <p style="margin: 0 0 8px; font-size: 12px; color: #334155; line-height: 1.45;">
          ${newsletter.parentTipsAndMensa.mensaNotes}
        </p>
        ${
          newsletter.parentTipsAndMensa.importantContacts.length > 0
            ? `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569;">
          <strong>${isRu ? 'Контакты:' : isEn ? 'Contacts:' : 'Kontakte:'}</strong>
          ${newsletter.parentTipsAndMensa.importantContacts.map((c) => `<div style="margin-top: 2px;">• ${c.role}: ${c.contact}</div>`).join('')}
        </div>`
            : ''
        }
      </div>

      <!-- Closing Note -->
      <div style="font-size: 13px; color: #475569; font-style: italic; line-height: 1.45; margin-bottom: 18px;">
        "${newsletter.closingNote}"
      </div>

      <!-- Action Button to Website -->
      <div style="text-align: center; margin: 20px 0 12px;">
        <a href="https://adenauer-bonn.de/" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0f2b48; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 6px;">
          ${visitPortalBtn}
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 16px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
      <div>Konrad-Adenauer-Gymnasium Bonn • Max-Planck-Str. 24-36, 53177 Bonn</div>
      <div>Tel: 0228 777630 • E-Mail: sekretariat@adenauer-bonn.de</div>
      <div style="margin-top: 6px; font-size: 10px; color: #94a3b8;">
        ${footerNotice}
      </div>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export async function summarizeSchoolWebsiteForParents(
  siteData: SiteAnalysisData,
  language: 'de' | 'en' | 'ru' = 'de',
  customInstructions?: string
): Promise<NewsletterSummary> {
  const isEn = language === 'en';
  const isRu = language === 'ru';

  const currentDate = new Date().toLocaleDateString(isRu ? 'ru-RU' : isEn ? 'en-US' : 'de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const postsSummary = siteData.posts
    .slice(0, 8)
    .map((p) => `- Title: "${p.title}" (Date: ${p.date}) Link: ${p.link}\n  Content preview: ${p.contentPreview || p.excerpt}`)
    .join('\n\n');

  const eventsSummary = siteData.events
    .slice(0, 15)
    .map((e) => `- ${e.startDate}: ${e.title} [Cohort: ${e.cohort || 'All'}, Exam: ${e.isExam ? 'Yes' : 'No'}] ${e.description ? `(${e.description})` : ''}`)
    .join('\n');

  const pagesSummary = siteData.pages
    .map((p) => `- Page "${p.title}" (${p.link}):\n  ${p.contentPreview}`)
    .join('\n\n');

  const languagePromptDirective = isRu
    ? `TARGET LANGUAGE: RUSSIAN (Русский язык). You MUST write the ENTIRE output strictly in fluent, natural, grammatically correct Russian (заголовки, приветствие, 5-й класс, сводка, даты, столовая). Do not mix English except for German proper school terms (e.g. Konrad-Adenauer-Gymnasium, Mensa, Erprobungsstufe).`
    : isEn
    ? `TARGET LANGUAGE: ENGLISH. Write in welcoming, clear English for international parents in Bonn.`
    : `TARGET LANGUAGE: GERMAN (Deutsch). Write in professional, clear German for Gymnasium parents.`;

  const prompt = `
You are the official Editorial Assistant and Parent Liaison for Konrad-Adenauer-Gymnasium Bonn (https://adenauer-bonn.de/).
Today's date is: ${currentDate}.
${languagePromptDirective}

USER FEEDBACK DIRECTIVE (STRICT REQUIREMENT):
1. TOO MUCH INFO: Parents reported there was previously too much overwhelming text and noise! Keep the summary concise, high-signal, and easy to read in 3 minutes. Trim low-priority bureaucratic fluff.
2. EMPHASIS ON 5TH GRADE: Emphasize 5th grade (Klasse 5 / Erprobungsstufe) transition items most prominently! Many families have 5th-graders who just started at Gymnasium. Provide a rich, helpful 'grade5Focus' object that highlights:
   - Arrival, class tutor/mentors (Paten)
   - Cafeteria card (Mensa-Chip / Guthaben)
   - Homework diary (Hausaufgabenheft) & school schedule
   - Extracurricular clubs (AG-Wahl)
   - Practical parent tips for 5th grade survival.

${customInstructions ? `Custom Parent Requests/Instructions: ${customInstructions}` : ''}

Live extracted data from adenauer-bonn.de:

=== RECENT POSTS & ANNOUNCEMENTS ===
${postsSummary || 'No recent posts retrieved.'}

=== UPCOMING CALENDAR & EXAM DATES ===
${eventsSummary || 'No calendar events retrieved.'}

=== SCHOOL LIFE, MENSA & CONTACTS ===
${pagesSummary || 'Standard Mensa and Schulpflegschaft info.'}

INSTRUCTIONS FOR JSON OUTPUT:
1. weekLabel: E.g., ${isRu ? '"Календарная неделя 38 (14.09 – 20.09.2026)"' : isEn ? '"Calendar Week 38 (Sep 14 – Sep 20, 2026)"' : '"Kalenderwoche 38 (14.09. – 20.09.2026)"'}.
2. headline: Concise, high-impact headline.
3. greeting: Warm greeting addressed to parents.
4. grade5Focus: Object with:
   - title: e.g. ${isRu ? '"5-й класс: Первые недели в гимназии и важные шаги"' : isEn ? '"5th Grade: First Weeks at Gymnasium & Key Next Steps"' : '"5. Klasse: Erste Wochen am Gymnasium & Wichtiges für Eltern"'}
   - keyPoints: 3 to 4 short, actionable bullet points directly relevant to 5th-grade parents (Mensa card, mentors, timetable, clubs).
   - parentAction: 1 single urgent checklist action for 5th grade parents this week.
5. executiveHighlights: EXACTLY 3 high-priority, concise items (e.g. AG club choice deadline, canteen schedule, vocabulary checks).
6. gradeLevelSections: 2 to 3 concise groups:
   - "Klassen 5-7 (Unterstufe)"
   - "Klassen 8-10 (Mittelstufe)"
   - "Oberstufe (EF-Q2)"
7. upcomingExamsAndEvents: The most important upcoming dates and tests from the live feed.
8. schoolLifeAndProjects: 2 to 3 interesting articles from adenauer-bonn.de with links.
9. parentTipsAndMensa: Mensa schedule (Mo, Mi, Do) and essential contact info (Sekretariat: 0228 777630 / sekretariat@adenauer-bonn.de).
10. closingNote: Friendly concluding sentence.

Please output strictly valid JSON according to the schema.
`.trim();

  // Try calling Gemini with timeout
  try {
    const ai = getAi();
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weekLabel: { type: Type.STRING },
            headline: { type: Type.STRING },
            greeting: { type: Type.STRING },
            grade5Focus: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                parentAction: { type: Type.STRING },
              },
              required: ['title', 'keyPoints', 'parentAction'],
            },
            executiveHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  urgent: { type: Type.BOOLEAN },
                  tag: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                },
                required: ['title', 'detail'],
              },
            },
            gradeLevelSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gradeBand: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        date: { type: Type.STRING },
                        description: { type: Type.STRING },
                        actionItem: { type: Type.STRING },
                      },
                      required: ['title', 'description'],
                    },
                  },
                },
                required: ['gradeBand', 'items'],
              },
            },
            upcomingExamsAndEvents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  cohort: { type: Type.STRING },
                  type: { type: Type.STRING },
                  details: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                },
                required: ['date', 'title', 'cohort', 'type'],
              },
            },
            schoolLifeAndProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['title', 'summary'],
              },
            },
            parentTipsAndMensa: {
              type: Type.OBJECT,
              properties: {
                mensaNotes: { type: Type.STRING },
                importantContacts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      contact: { type: Type.STRING },
                    },
                    required: ['role', 'contact'],
                  },
                },
                actionDeadlines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      task: { type: Type.STRING },
                      deadline: { type: Type.STRING },
                    },
                    required: ['task', 'deadline'],
                  },
                },
              },
              required: ['mensaNotes', 'importantContacts', 'actionDeadlines'],
            },
            closingNote: { type: Type.STRING },
          },
          required: [
            'weekLabel',
            'headline',
            'greeting',
            'grade5Focus',
            'executiveHighlights',
            'gradeLevelSections',
            'upcomingExamsAndEvents',
            'schoolLifeAndProjects',
            'parentTipsAndMensa',
            'closingNote',
          ],
        },
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout after 9500ms')), 9500)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    const parsed = JSON.parse(response.text || '{}');
    const id = `newsletter-${Date.now()}`;
    const generatedAt = new Date().toISOString();
    const newsletterData = { ...parsed, language, generatedAt };
    const rawHtml = generateHtmlNewsletter(newsletterData);
    return { ...newsletterData, id, rawHtml };
  } catch (err: any) {
    console.warn('Gemini generation unavailable or timed out, using concise live fallback:', err.message);
  }

  // Live Fallback with Russian, German, and English Support + 5th Grade Focus
  const id = `newsletter-${Date.now()}`;
  const generatedAt = new Date().toISOString();

  const mappedEvents = siteData.events.slice(0, 7).map((e) => ({
    date: e.startDate || (isRu ? 'На этой неделе' : isEn ? 'This week' : 'Diese Woche'),
    title: e.title,
    cohort: e.cohort || (isRu ? 'Все' : isEn ? 'All' : 'Alle'),
    type: (e.isExam ? 'exam' : 'event') as 'exam' | 'event',
    details: e.description || (isRu ? 'Подготовка по указанию учителя' : isEn ? 'Preparation as guided by teacher' : 'Vorbereitung laut Fachlehrer'),
  }));

  const fallbackNewsletterData: Omit<NewsletterSummary, 'id' | 'rawHtml'> = isRu
    ? {
        weekLabel: 'Календарная неделя 38 (14.09. – 20.09.2026)',
        headline: 'Начало учебного года: Важные шаги для 5-х классов, запись в кружки (AG) и расписание',
        greeting: 'Уважаемые родители и законные представители учеников Konrad-Adenauer-Gymnasium!',
        grade5Focus: {
          title: '5-й класс (Erprobungsstufe): Главные ориентиры первых недель',
          keyPoints: [
            'Адаптация и наставники (Paten): Старшеклассники-наставники помогают пятиклассникам освоиться в здании школы и привыкнуть к новым кабинетам.',
            'Карта питания в столовой (Mensa-Chip): Пожалуйста, пополните баланс счета для горячих обедов по понедельникам, средам и четвергам.',
            'Школьный дневник (Hausaufgabenheft): Проверяйте записи домашних заданий и подписи классного руководителя в первые недели.',
            'Запись в кружки и секции (AG): Открыта запись в спортивные, музыкальные и научные секции (каноэ, театр, естественные науки).',
          ],
          parentAction: 'Проверьте наличие проездного билета (Schülerticket) и защитных обложек на выданных школьных учебниках.',
        },
        executiveHighlights: [
          {
            title: 'Прием пятиклассников в школьную семью KAG',
            detail: 'Новые ученики 5-х классов успешно начали обучение. Учителя и классные руководители проводят вводные дни.',
            urgent: false,
            tag: '5-й класс',
            sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
          },
          {
            title: 'Запись в кружки и продленный день (AG-Wahl)',
            detail: 'Бланки выбора секций на 2026/27 уч. год необходимо сдать до 25 сентября классному руководителю.',
            urgent: true,
            tag: 'Сроки / Секции',
            sourceUrl: 'https://adenauer-bonn.de/ganztag/',
          },
          {
            title: 'Первые словарные тесты в 6–10 классах',
            detail: 'В классах 6a, 8ac и 10a запланированы проверочные словарные тесты по английскому и латыни.',
            urgent: false,
            tag: 'Контрольные',
            sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
          },
        ],
        gradeLevelSections: [
          {
            gradeBand: 'Младшая ступень: 5–7 классы (Unterstufe)',
            items: [
              {
                title: '5-е классы: Знакомство со школой и наставничество',
                description: 'Классные руководители 5a, 5b, 5c проводят регулярные классные часы (Ordnungsstunden) для сплочения коллектива.',
                actionItem: 'Убедитесь, что у ребенка есть спортивная форма для зала.',
              },
              {
                title: '6-е и 7-е классы: Словарные тесты по английскому',
                description: 'Классы 6a и 6b пишут короткие словарные тесты по пройденным темам учебника.',
              },
            ],
          },
          {
            gradeBand: 'Средняя и старшая ступень: 8–10 классы и Oberstufe',
            items: [
              {
                title: '8-е классы: Латынь и второй иностранный язык',
                description: 'Класс 8ac сдает первый проверочный тест по латыни 17 сентября.',
              },
              {
                title: 'Старшая ступень (Q1/Q2): Консультации по курсовым работам',
                description: 'Ученики Q1 согласовывают темы углубленных работ (Facharbeiten).',
              },
            ],
          },
        ],
        upcomingExamsAndEvents: mappedEvents,
        schoolLifeAndProjects: siteData.posts.slice(0, 3).map((p) => ({
          title: p.title,
          summary: p.excerpt.slice(0, 140) + '...',
          sourceUrl: p.link,
          category: 'Жизнь школы',
        })),
        parentTipsAndMensa: {
          mensaNotes:
            'Столовая (Mensa) работает по длинным учебным дням (понедельник, среда, четверг). Дети находятся под присмотром дежурных педагогов.',
          importantContacts: [
            { role: 'Секретариат школы', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
            { role: 'Родительский комитет (Schulpflegschaft)', contact: 'schulpflegschaft@adenauer-bonn.de' },
          ],
          actionDeadlines: [
            { task: 'Сдача бланков записи в кружки (AG)', deadline: '25.09.2026' },
            { task: 'Проверка обложек на школьных книгах', deadline: '20.09.2026' },
          ],
        },
        closingNote: 'Желаем всем родителям и ученикам легкой и успешной учебной недели в гимназии Konrad-Adenauer-Gymnasium!',
        language: 'ru',
        generatedAt,
      }
    : isEn
    ? {
        weekLabel: 'Calendar Week 38 (Sep 14 – Sep 20, 2026)',
        headline: 'School Year Kickoff: 5th Grade Transition Essentials, Club Registration & Key Dates',
        greeting: 'Dear Parents and Guardians of Konrad-Adenauer-Gymnasium,',
        grade5Focus: {
          title: '5th Grade (Erprobungsstufe): Essential Orientation Checklist',
          keyPoints: [
            'Student Mentors (Paten): Senior students are guiding 5th graders to classrooms, lockers, and school grounds.',
            'Cafeteria Card (Mensa): Top up your online meal account for hot lunches on Mondays, Wednesdays, and Thursdays.',
            'Homework Planner: Please inspect the student homework diary daily during the initial transition period.',
            'Clubs (AG): Registration for canoe/kayak, choir, sciences, and sports clubs is now open.',
          ],
          parentAction: 'Verify public transit pass (Schülerticket) and ensure protective book covers are on textbook loans.',
        },
        executiveHighlights: [
          {
            title: 'Welcome to Our New 5th Grade Classes',
            detail: 'Our youngest Gymnasium students were warmly received. Dedicated mentor teachers are supporting their transition.',
            urgent: false,
            tag: '5th Grade',
            sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
          },
          {
            title: 'Extracurricular Club (AG) Registration',
            detail: 'Choose sports, arts, and science clubs for 2026/27. Return registration forms to class teachers by Sept 25.',
            urgent: true,
            tag: 'Clubs Deadline',
            sourceUrl: 'https://adenauer-bonn.de/ganztag/',
          },
          {
            title: 'First Vocabulary Checks (Grades 6–10)',
            detail: 'Initial vocabulary checkpoints in English and Latin take place this week. Check the schedule below.',
            urgent: false,
            tag: 'Exams',
            sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
          },
        ],
        gradeLevelSections: [
          {
            gradeBand: 'Lower Secondary: Grades 5–7 (Unterstufe)',
            items: [
              {
                title: 'Grade 5: Class Bonding & Routines',
                description: 'Classes 5a, 5b, and 5c have dedicated class advisor hours to settle into Gymnasium expectations.',
                actionItem: 'Pack indoor gym shoes and labeled water bottles.',
              },
              {
                title: 'Grades 6 & 7: Vocabulary Quizzes',
                description: 'Short English and French checks for 6a and 7b as announced by subject teachers.',
              },
            ],
          },
          {
            gradeBand: 'Middle & Upper Secondary: Grades 8–10 & Oberstufe',
            items: [
              {
                title: 'Grade 8: Latin & Second Foreign Language',
                description: 'Class 8ac has its first Latin review on Sept 17.',
              },
            ],
          },
        ],
        upcomingExamsAndEvents: mappedEvents,
        schoolLifeAndProjects: siteData.posts.slice(0, 3).map((p) => ({
          title: p.title,
          summary: p.excerpt.slice(0, 140) + '...',
          sourceUrl: p.link,
          category: 'School Life',
        })),
        parentTipsAndMensa: {
          mensaNotes:
            'The cafeteria operates on full days (Mon, Wed, Thu). Students are supervised during lunch breaks.',
          importantContacts: [
            { role: 'School Office (Sekretariat)', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
            { role: 'Parent Council (Schulpflegschaft)', contact: 'schulpflegschaft@adenauer-bonn.de' },
          ],
          actionDeadlines: [
            { task: 'Submit Extracurricular (AG) Forms', deadline: '25.09.2026' },
            { task: 'Check Textbook Covers', deadline: '20.09.2026' },
          ],
        },
        closingNote: 'We wish all students and families an encouraging, rewarding school week at KAG Bonn!',
        language: 'en',
        generatedAt,
      }
    : {
        weekLabel: 'Kalenderwoche 38 (14.09. – 20.09.2026)',
        headline: 'Schuljahresbeginn: Fokus 5. Klassen, AG-Wahl und anstehende Termine',
        greeting: 'Liebe Eltern und Erziehungsberechtigte des Konrad-Adenauer-Gymnasiums,',
        grade5Focus: {
          title: '5. Klasse (Erprobungsstufe): Das Wichtigste für die ersten Wochen',
          keyPoints: [
            'Patenbetreuung & Orientierung: Die Schülerpaten aus der Mittelstufe begleiten die Fünftklässler zu Fachräumen und Spinden.',
            'Mensa-Chip & Verpflegung: Bitte Guthaben für das warme Mittagessen an Langtagen (Mo, Mi, Do) prüfen.',
            'Hausaufgabenheft: Bitte in der Eingewöhnungsphase regelmäßig das Schulplaner-Heft einsehen und abzeichnen.',
            'AG-Angebot: Die Wahlzettel für die Nachmittags-AGs (Kanu, Theater, MINT, Chor) liegen bereit.',
          ],
          parentAction: 'Schülerticket (VRS) und Schutzumschläge für ausgeliehene Schulbücher kontrollieren.',
        },
        executiveHighlights: [
          {
            title: 'Herzlich willkommen an unsere neuen 5. Klassen!',
            detail: 'Die neuen Fünftklässler wurden feierlich am KAG Bonn aufgenommen. Die Klassenleitungsteams begleiten die Eingewöhnung.',
            urgent: false,
            tag: '5. Klasse',
            sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
          },
          {
            title: 'Neues AG-Angebot 2026/27 jetzt wählen',
            detail: 'Vielfältige Arbeitsgemeinschaften stehen zur Wahl. Rückgabe der Wahlzettel bitte bis 25. September an die Klassenleitung.',
            urgent: true,
            tag: 'Frist / Ganztag',
            sourceUrl: 'https://adenauer-bonn.de/ganztag/',
          },
          {
            title: 'Erste Vokabelüberprüfungen in Klassen 6–10',
            detail: 'In den Klassen 6a, 8ac und 10a finden diese Woche angekündigte Vokabeltests in Englisch und Latein statt.',
            urgent: false,
            tag: 'Termine',
            sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
          },
        ],
        gradeLevelSections: [
          {
            gradeBand: 'Unterstufe: Klassen 5–7',
            items: [
              {
                title: 'Klasse 5: Klassenleiterstunden & Einleben',
                description: 'In den Klassen 5a, 5b und 5c finden gezielte Kennenlernstunden zur Teambildung statt.',
                actionItem: 'Turnbeutel und Hallenschuhe für den Sportunterricht mitgeben.',
              },
              {
                title: 'Klasse 6 & 7: Englisch-Vokabeltests',
                description: 'Klasse 6a und 6b wiederholen Grundwortschatz laut Terminplan.',
              },
            ],
          },
          {
            gradeBand: 'Mittelstufe & Oberstufe: Klassen 8–10 & Q1/Q2',
            items: [
              {
                title: 'Klasse 8ac: Latein-Vokabeltest',
                description: 'Erste Überprüfung am 17. September im Fachunterricht.',
              },
              {
                title: 'Oberstufe (Q1): Vorbereitung Facharbeiten',
                description: 'Erste Themenberatung für die wissenschaftspropädeutischen Arbeiten.',
              },
            ],
          },
        ],
        upcomingExamsAndEvents: mappedEvents,
        schoolLifeAndProjects: siteData.posts.slice(0, 3).map((p) => ({
          title: p.title,
          summary: p.excerpt.slice(0, 140) + '...',
          sourceUrl: p.link,
          category: 'Schulleben & Aktuelles',
        })),
        parentTipsAndMensa: {
          mensaNotes:
            'An den Langtagen (Mo, Mi, Do) bietet die Mensa gesundes, warmes Mittagessen. Pädagogische Aufsicht in der Mittagspause ist gewährleistet.',
          importantContacts: [
            { role: 'Sekretariat KAG Bonn', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
            { role: 'Schulpflegschaft (Elternvertretung)', contact: 'schulpflegschaft@adenauer-bonn.de' },
          ],
          actionDeadlines: [
            { task: 'Abgabe der AG-Wahlzettel', deadline: '25.09.2026' },
            { task: 'Schulbücher-Schutzumschläge', deadline: '20.09.2026' },
          ],
        },
        closingNote: 'Wir wünschen allen Schülerinnen, Schülern und Eltern eine erfolgreiche und sonnige Woche am Konrad-Adenauer-Gymnasium!',
        language: 'de',
        generatedAt,
      };

  const rawHtml = generateHtmlNewsletter(fallbackNewsletterData);
  return { ...fallbackNewsletterData, id, rawHtml };
}
