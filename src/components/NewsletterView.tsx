import React, { useState } from 'react';
import {
  Send,
  Mail,
  Calendar,
  AlertTriangle,
  GraduationCap,
  Utensils,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Sparkles,
  BookOpen,
  Search,
  Users,
  Star,
  CheckCircle2
} from 'lucide-react';
import type { NewsletterSummary, Subscriber } from '../types';

interface NewsletterViewProps {
  newsletter: NewsletterSummary | null;
  subscribers: Subscriber[];
  onSendNewsletter: (targetEmails?: string[]) => Promise<{ success: boolean; message: string }>;
  isSending: boolean;
  language: 'de' | 'en' | 'ru';
}

export const NewsletterView: React.FC<NewsletterViewProps> = ({
  newsletter,
  subscribers,
  onSendNewsletter,
  isSending,
  language,
}) => {
  const isEn = language === 'en';
  const isRu = language === 'ru';

  const [viewMode, setViewMode] = useState<'interactive' | 'email-preview' | 'html-code'>('interactive');
  const [emailViewport, setEmailViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [grade5Only, setGrade5Only] = useState<boolean>(false);
  const [selectedGradeBand, setSelectedGradeBand] = useState<string>('all');
  const [examSearch, setExamSearch] = useState<string>('');
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Localization dictionary
  const txt = {
    emptyTitle: isRu
      ? 'Дайджест еще не создан'
      : isEn
      ? 'No Newsletter Generated Yet'
      : 'Noch kein Elternbrief generiert',
    emptyDesc: isRu
      ? 'Нажмите «Создать дайджест» вверху, чтобы проанализировать сайт Konrad-Adenauer-Gymnasium и подготовить компактный дайджест для родителей.'
      : isEn
      ? 'Click "Generate Briefing" at the top to analyze the Konrad-Adenauer-Gymnasium website and compile the weekly parent digest.'
      : 'Klicken Sie oben auf "Briefing generieren", um die Website des Konrad-Adenauer-Gymnasiums zu analysieren und den wöchentlichen Elternbrief zu erstellen.',
    compiledAt: isRu ? 'Создан' : isEn ? 'Compiled at' : 'Erstellt am',
    tabInteractive: isRu ? 'Компактный дайджест' : isEn ? 'Interactive Digest' : 'Interaktives Briefing',
    tabEmail: isRu ? 'Вид в почте' : isEn ? 'Email Preview' : 'E-Mail Vorschau',
    tabHtml: isRu ? 'HTML код' : isEn ? 'HTML Source' : 'HTML Quelltext',
    dispatchLabel: isRu ? 'Отправка родителям:' : isEn ? 'Email Dispatch:' : 'Elternbrief versenden:',
    sendToUser: isRu ? 'Отправить на rumyua@gmail.com' : isEn ? 'Send to rumyua@gmail.com' : 'An rumyua@gmail.com senden',
    sendToAll: (count: number) =>
      isRu
        ? `Отправить всем (${count})`
        : isEn
        ? `Send to all (${count})`
        : `An gesamten Verteiler senden (${count})`,
    openMailApp: isRu ? 'Почтовая программа' : isEn ? 'Mail App' : 'Mail-App',
    grade5Spotlight: isRu
      ? '⭐ В ФОКУСЕ: 5-Й КЛАСС (ERPROBUNGSSTUFE)'
      : isEn
      ? '⭐ 5TH GRADE FOCUS (TRANSITION YEAR)'
      : '⭐ FOKUS 5. KLASSE (ERPROBUNGSSTUFE)',
    grade5Action: isRu
      ? 'Срочно для родителей пятиклассников'
      : isEn
      ? 'Action item for 5th grade parents'
      : 'Dringende To-Do für Eltern der 5. Klassen',
    filterGrade5Btn: isRu
      ? '⭐ Только 5-й класс'
      : isEn
      ? '⭐ 5th Grade Only'
      : '⭐ Nur 5. Klasse',
    filterAllBtn: isRu ? 'Все классы' : isEn ? 'All Grades' : 'Alle Klassen',
    highlightsHeading: isRu
      ? 'Ключевые события недели (Без лишней информации)'
      : isEn
      ? 'Executive Highlights for Parents'
      : 'Wichtigste Schwerpunkte der Woche (Kompakt)',
    urgentTag: isRu ? 'Срочно / Дедлайн' : isEn ? 'Action Required' : 'Frist / Dringend',
    importantTag: isRu ? 'Важно' : isEn ? 'Important' : 'Wichtig',
    examsHeading: isRu
      ? 'Контрольные работы и даты'
      : isEn
      ? 'Upcoming Tests & School Calendar'
      : 'Anstehende Klassenarbeiten & Termine',
    searchPlaceholder: isRu
      ? 'Поиск по классу (напр. 5a, 6b, 8ac)...'
      : isEn
      ? 'Filter by class (e.g. 5a, 6b, 8ac)...'
      : 'Klasse filtern (z. B. 5a, 6b, 8ac)...',
    dateCol: isRu ? 'Дата' : isEn ? 'Date' : 'Datum',
    eventCol: isRu ? 'Событие / Работа' : isEn ? 'Event / Exam' : 'Anlass / Klassenarbeit',
    cohortCol: isRu ? 'Класс / Ступень' : isEn ? 'Class / Cohort' : 'Klasse / Stufe',
    catCol: isRu ? 'Категория' : isEn ? 'Category' : 'Kategorie',
    notesCol: isRu ? 'Примечания' : isEn ? 'Notes' : 'Hinweise',
    examType: isRu ? 'Контрольная / Тест' : isEn ? 'Exam / Test' : 'Klassenarbeit / Test',
    schoolEventType: isRu ? 'Школьное событие' : isEn ? 'School Event' : 'Schultermin',
    noExamsMatch: isRu
      ? 'Нет событий по указанному фильтру.'
      : isEn
      ? 'No dates found matching filter.'
      : 'Keine Termine für diesen Filter gefunden.',
    gradeBandsHeading: isRu
      ? 'Информация по ступеням'
      : isEn
      ? 'Grade Band Briefings'
      : 'Stufenspezifische Informationen',
    allBands: isRu ? 'Все ступени' : isEn ? 'All Grades' : 'Alle Stufen',
    schoolLifeHeading: isRu
      ? 'Жизнь школы и проекты'
      : isEn
      ? 'School Life & Student Projects'
      : 'Schulleben & Aktuelle Berichte',
    readArticleOnSite: isRu
      ? 'Читать статью на adenauer-bonn.de'
      : isEn
      ? 'Read full article on adenauer-bonn.de'
      : 'Vollständigen Artikel lesen',
    canteenHeading: isRu
      ? 'Столовая (Mensa) и питание'
      : isEn
      ? 'Mensa Cafeteria & Meals'
      : 'Mensa & Mittagessen',
    deadlinesHeading: isRu
      ? 'Сроки и задачи для родителей'
      : isEn
      ? 'Action Deadlines'
      : 'Fristen & Erledigungen',
    contactsHeading: isRu
      ? 'Контакты школы'
      : isEn
      ? 'School Contacts'
      : 'Wichtige Ansprechpartner',
    emailSimulatorNotice: isRu
      ? 'Эмуляция отображения письма в почтовых клиентах (Gmail, Outlook, Apple Mail)'
      : isEn
      ? 'Simulated rendering as received by parent email inboxes (Apple Mail, Outlook, Gmail)'
      : 'Exakte E-Mail-Darstellung für Eltern (kompatibel mit Gmail, Outlook, Apple Mail)',
    htmlTitle: isRu
      ? 'HTML-код для почтовых рассылок'
      : isEn
      ? 'Responsive HTML Email Source Code'
      : 'HTML-Quelltext für E-Mail Kampagnen',
    htmlSubtitle: isRu
      ? 'Оптимизирован для всех почтовых клиентов'
      : isEn
      ? 'Inline-styled and table-structured for maximum compatibility.'
      : 'Inline-Styles und Tabellenstruktur für universelle Darstellung.',
    copyHtml: isRu ? 'Скопировать HTML' : isEn ? 'Copy HTML' : 'HTML kopieren',
    copiedHtml: isRu ? 'Скопировано!' : isEn ? 'Copied!' : 'Kopiert!',
  };

  if (!newsletter) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 font-serif mb-2">
          {txt.emptyTitle}
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {txt.emptyDesc}
        </p>
      </div>
    );
  }

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(newsletter.rawHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendToUser = async (email: string) => {
    setSendStatus(null);
    try {
      const res = await onSendNewsletter([email]);
      setSendStatus({ type: 'success', text: res.message });
    } catch (err: any) {
      setSendStatus({ type: 'error', text: err.message || 'Versand fehlgeschlagen' });
    }
  };

  const handleSendToAll = async () => {
    setSendStatus(null);
    try {
      const res = await onSendNewsletter();
      setSendStatus({ type: 'success', text: res.message });
    } catch (err: any) {
      setSendStatus({ type: 'error', text: err.message || 'Versand fehlgeschlagen' });
    }
  };

  // Filter exams/events
  const filteredEvents = (newsletter.upcomingExamsAndEvents || []).filter((e) => {
    if (grade5Only) {
      const matches5 =
        e.cohort.toLowerCase().includes('5') ||
        e.title.toLowerCase().includes('5') ||
        e.cohort.toLowerCase().includes('alle') ||
        e.cohort.toLowerCase().includes('all') ||
        e.cohort.toLowerCase().includes('все');
      if (!matches5) return false;
    }
    if (examSearch) {
      const q = examSearch.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.cohort.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeSubscribers = subscribers.filter((s) => s.active);
  const primaryUserEmail = 'rumyua@gmail.com';

  return (
    <div className="space-y-6">
      {/* Top Controls & Dispatch Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {newsletter.weekLabel}
              </span>
              <span className="text-xs text-slate-500">
                {txt.compiledAt}:{' '}
                {new Date(newsletter.generatedAt).toLocaleString(
                  isRu ? 'ru-RU' : isEn ? 'en-US' : 'de-DE',
                  {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }
                )}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                {newsletter.language}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif leading-snug">
              {newsletter.headline}
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start lg:self-center">
            <button
              id="view-interactive-btn"
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {txt.tabInteractive}
            </button>
            <button
              id="view-email-preview-btn"
              onClick={() => setViewMode('email-preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'email-preview'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{txt.tabEmail}</span>
            </button>
            <button
              id="view-html-code-btn"
              onClick={() => setViewMode('html-code')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                viewMode === 'html-code'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {txt.tabHtml}
            </button>
          </div>
        </div>

        {/* Email Dispatch Action Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700">
              {txt.dispatchLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Send to User */}
            <button
              id="send-to-user-btn"
              onClick={() => handleSendToUser(primaryUserEmail)}
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition disabled:opacity-60 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{txt.sendToUser}</span>
            </button>

            {/* Send to all subscribers */}
            <button
              id="send-to-all-btn"
              onClick={handleSendToAll}
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition disabled:opacity-60 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{txt.sendToAll(activeSubscribers.length)}</span>
            </button>

            {/* Native mailto option */}
            <a
              id="mailto-client-btn"
              href={`mailto:${primaryUserEmail}?subject=${encodeURIComponent(
                `[KAG Bonn] ${newsletter.headline} (${newsletter.weekLabel})`
              )}&body=${encodeURIComponent(
                `${newsletter.greeting}\n\n${newsletter.grade5Focus ? `[5. Klasse Fokus]\n${newsletter.grade5Focus.title}\n${newsletter.grade5Focus.keyPoints.join('\n')}\n\n` : ''}${newsletter.executiveHighlights.map((h) => `• ${h.title}: ${h.detail}`).join('\n')}\n\nhttps://adenauer-bonn.de\n`
              )}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              title={isRu ? 'Открыть в почтовой программе' : isEn ? 'Open in mail client' : 'In Mail-App öffnen'}
            >
              <ExternalLink className="w-3 h-3" />
              <span>{txt.openMailApp}</span>
            </a>
          </div>
        </div>

        {/* Feedback alert */}
        {sendStatus && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs flex items-center justify-between ${
              sendStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{sendStatus.text}</span>
            <button
              onClick={() => setSendStatus(null)}
              className="font-bold hover:underline cursor-pointer ml-2 text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: INTERACTIVE BRIEFING */}
      {viewMode === 'interactive' && (
        <div className="space-y-6">
          {/* Greeting Hero */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-blue-300 text-xs font-semibold tracking-wider uppercase">
                {isRu ? 'Официальный дайджест для родителей' : isEn ? 'Official Parent Briefing' : 'Offizielles Eltern-Briefing'}
              </span>
              {/* Quick toggle for 5th Grade Focus Mode */}
              <button
                onClick={() => setGrade5Only(!grade5Only)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  grade5Only
                    ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${grade5Only ? 'fill-amber-950' : ''}`} />
                <span>{grade5Only ? txt.filterAllBtn : txt.filterGrade5Btn}</span>
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">
              {newsletter.greeting}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {newsletter.closingNote}
            </p>
          </div>

          {/* ⭐ 5TH GRADE SPECIAL FOCUS SECTION ⭐ */}
          {newsletter.grade5Focus && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    5
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
                      {txt.grade5Spotlight}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-amber-950">
                      {newsletter.grade5Focus.title}
                    </h3>
                  </div>
                </div>

                <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                  {isRu ? 'Новый старт в KAG' : isEn ? 'Gymnasium Transition' : 'Erprobungsstufe KAG'}
                </span>
              </div>

              {/* Key points formatted into clear visual cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                {newsletter.grade5Focus.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 rounded-xl p-3.5 border border-amber-200/80 text-xs sm:text-sm text-slate-800 shadow-2xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>

              {/* Urgent Parent Action for Grade 5 */}
              {newsletter.grade5Focus.parentAction && (
                <div className="mt-3 bg-amber-200/80 border border-amber-300 rounded-xl p-3 text-xs font-semibold text-amber-950 flex items-center gap-2">
                  <span className="text-base">👉</span>
                  <div>
                    <span className="font-bold">{txt.grade5Action}: </span>
                    <span>{newsletter.grade5Focus.parentAction}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Executive Highlights (Crisp, High Signal) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  {txt.highlightsHeading}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {isRu ? 'Только самое важное' : isEn ? 'Filtered for high priority' : 'Gefiltert auf das Wesentliche'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsletter.executiveHighlights.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition ${
                    item.urgent
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.tag || txt.importantTag}
                      </span>
                      {item.urgent && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {txt.urgentTag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Upcoming Exams & Calendar Dates */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  {txt.examsHeading}
                </h3>
                {grade5Only && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    {isRu ? 'Только 5-й класс' : isEn ? 'Grade 5 only' : 'Nur 5. Klasse'}
                  </span>
                )}
              </div>

              {/* Search / Filter for specific classes */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  id="exam-search-input"
                  type="text"
                  placeholder={txt.searchPlaceholder}
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/80">
                      <th className="py-2.5 px-3 font-semibold">{txt.dateCol}</th>
                      <th className="py-2.5 px-3 font-semibold">{txt.cohortCol}</th>
                      <th className="py-2.5 px-3 font-semibold">{txt.eventCol}</th>
                      <th className="py-2.5 px-3 font-semibold">{txt.catCol}</th>
                      <th className="py-2.5 px-3 font-semibold">{txt.notesCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((e, idx) => {
                      const is5 = e.cohort.includes('5') || e.title.includes('5');
                      return (
                        <tr
                          key={idx}
                          className={`transition ${is5 ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/60'}`}
                        >
                          <td className="py-2 px-3 font-medium text-slate-900 whitespace-nowrap">
                            {e.date}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                is5
                                  ? 'bg-amber-200 text-amber-900 border border-amber-300'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}
                            >
                              {e.cohort}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-800">
                            {e.title}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {e.type === 'exam' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <BookOpen className="w-3 h-3" />
                                {txt.examType}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {txt.schoolEventType}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 text-xs">
                            {e.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                {txt.noExamsMatch}
              </p>
            )}
          </div>

          {/* Section 3: Grade Level Breakdown (Unterstufe, Mittelstufe, Oberstufe) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  {txt.gradeBandsHeading}
                </h3>
              </div>

              {/* Band selector */}
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedGradeBand('all')}
                  className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer ${
                    selectedGradeBand === 'all'
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {txt.allBands}
                </button>
                {newsletter.gradeLevelSections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGradeBand(sec.gradeBand)}
                    className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer ${
                      selectedGradeBand === sec.gradeBand
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sec.gradeBand}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {newsletter.gradeLevelSections
                .filter((s) => selectedGradeBand === 'all' || selectedGradeBand === s.gradeBand)
                .map((sec, sIdx) => (
                  <div key={sIdx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-indigo-950 mb-2 flex items-center gap-2 uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      {sec.gradeBand}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sec.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-white p-3 rounded-lg border border-slate-200/80">
                          <h5 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h5>
                          <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                            {item.description}
                          </p>
                          {item.actionItem && (
                            <div className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                              👉 {item.actionItem}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 4: School Life & Projects (Curated) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  {txt.schoolLifeHeading}
                </h3>
              </div>
              <a
                href="https://adenauer-bonn.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>adenauer-bonn.de</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {newsletter.schoolLifeAndProjects.slice(0, 3).map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition bg-white flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {proj.category || (isRu ? 'Жизнь школы' : isEn ? 'School Life' : 'Schulleben')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-2 mb-1 line-clamp-2">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                      {proj.summary}
                    </p>
                  </div>
                  {proj.sourceUrl && (
                    <a
                      href={proj.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start"
                    >
                      <span>{txt.readArticleOnSite}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Mensa Cafeteria & Important School Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mensa Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                  {txt.canteenHeading}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {newsletter.parentTipsAndMensa.mensaNotes}
              </p>

              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                {txt.deadlinesHeading}
              </h5>
              <ul className="space-y-1.5">
                {newsletter.parentTipsAndMensa.actionDeadlines.map((ad, idx) => (
                  <li
                    key={idx}
                    className="text-xs flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded"
                  >
                    <span>{ad.task}</span>
                    <span className="font-semibold text-blue-700">{ad.deadline}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* School Contacts */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                  {txt.contactsHeading}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Konrad-Adenauer-Gymnasium, Friedrich-Ebert-Allee 67 / Max-Planck-Str., Bonn
              </p>
              <div className="space-y-2">
                {newsletter.parentTipsAndMensa.importantContacts.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{c.role}</span>
                    <span className="text-slate-600 font-mono text-[11px]">{c.contact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: EMAIL PREVIEW SIMULATOR */}
      {viewMode === 'email-preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{txt.emailSimulatorNotice}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setEmailViewport('desktop')}
                className={`p-1.5 rounded transition ${
                  emailViewport === 'desktop' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Desktop Viewport (600px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEmailViewport('mobile')}
                className={`p-1.5 rounded transition ${
                  emailViewport === 'mobile' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Mobile Viewport (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-slate-200 p-4 sm:p-8 rounded-2xl overflow-x-auto">
            <div
              className={`bg-white shadow-xl rounded-xl transition-all duration-300 border border-slate-300 overflow-hidden ${
                emailViewport === 'desktop' ? 'w-full max-w-[640px]' : 'w-[375px]'
              }`}
            >
              {/* Fake Email Client Header */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs text-slate-600 flex flex-col gap-1">
                <div>
                  <span className="font-semibold text-slate-700">{isRu ? 'От:' : isEn ? 'From:' : 'Von:'}</span>{' '}
                  KAG Bonn Eltern-Briefing &lt;eltern-briefing@adenauer-bonn.de&gt;
                </div>
                <div>
                  <span className="font-semibold text-slate-700">{isRu ? 'Кому:' : isEn ? 'To:' : 'An:'}</span>{' '}
                  {primaryUserEmail}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">{isRu ? 'Тема:' : isEn ? 'Subject:' : 'Betreff:'}</span>{' '}
                  [KAG Bonn] {newsletter.headline} ({newsletter.weekLabel})
                </div>
              </div>

              {/* Iframe sandbox rendering the HTML email */}
              <iframe
                title="HTML Email Preview"
                srcDoc={newsletter.rawHtml}
                className="w-full h-[850px] border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: HTML CODE EXPORT */}
      {viewMode === 'html-code' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                {txt.htmlTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {txt.htmlSubtitle}
              </p>
            </div>
            <button
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? txt.copiedHtml : txt.copyHtml}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px]">
            <code>{newsletter.rawHtml}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
