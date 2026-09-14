import React, { useState } from 'react';
import {
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  Search,
  BookOpen,
  Utensils,
  Phone,
  Mail,
  Sparkles,
  CheckSquare,
  Square,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import type { NewsletterSummary } from '../types';
import { downloadIcsFile } from '../lib/calendar';
import { RefreshCw } from 'lucide-react';

interface OnlineBriefingViewProps {
  briefing: NewsletterSummary | null;
  language: 'de' | 'en' | 'ru';
  onRefreshSummary: () => void;
  onLanguageChange?: (lang: 'de' | 'en' | 'ru') => void;
  isRefreshing: boolean;
}

export const OnlineBriefingView: React.FC<OnlineBriefingViewProps> = ({
  briefing,
  language,
  onRefreshSummary,
  isRefreshing,
}) => {
  const isEn = language === 'en';
  const isRu = language === 'ru';

  const [examSearch, setExamSearch] = useState<string>('');
  const [onlyExams, setOnlyExams] = useState<boolean>(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kag_briefing_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTask = (taskKey: string) => {
    setCheckedTasks((prev) => {
      const next = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem('kag_briefing_tasks', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Translations
  const t = {
    emptyTitle: isRu
      ? 'Онлайн-дайджест еще не создан'
      : isEn
      ? 'No Online Briefing Available Yet'
      : 'Noch kein Online-Briefing erstellt',
    emptyDesc: isRu
      ? 'Нажмите «Создать онлайн-дайджест», чтобы автоматически проанализировать сайт школы Konrad-Adenauer-Gymnasium и собрать актуальную информацию.'
      : isEn
      ? 'Click "Generate Online Briefing" to analyze the Konrad-Adenauer-Gymnasium portal and compile the latest summary.'
      : 'Klicken Sie auf "Online-Briefing erstellen", um die aktuellen Schuldaten von adenauer-bonn.de abzurufen und aufzubereiten.',
    createBtn: isRu ? 'Создать онлайн-дайджест' : isEn ? 'Generate Online Briefing' : 'Online-Briefing erstellen',
    allGrades: isRu ? 'Все классы' : isEn ? 'All Grades' : 'Alle Stufen',
    grade5Only: isRu ? '⭐ 5-й класс' : isEn ? '⭐ 5th Grade' : '⭐ 5. Klasse',
    unterstufe: isRu ? '5–7 классы (Unterstufe)' : isEn ? 'Grades 5–7 (Lower)' : 'Klassen 5–7 (Unterstufe)',
    mittelstufe: isRu ? '8–10 классы (Mittelstufe)' : isEn ? 'Grades 8–10 (Middle)' : 'Klassen 8–10 (Mittelstufe)',
    oberstufe: isRu ? 'Старшая школа (Oberstufe)' : isEn ? 'Upper (Oberstufe EF-Q2)' : 'Oberstufe (EF-Q2)',
    addToCalendar: isRu ? 'Экспорт в календарь (.ics)' : isEn ? 'Add to Calendar (.ics)' : 'In Kalender (.ics)',
    printPdf: isRu ? 'Печать / PDF' : isEn ? 'Print / PDF' : 'Drucken / PDF',
    shareLink: isRu ? 'Поделиться' : isEn ? 'Share Link' : 'Link teilen',
    qrCode: isRu ? 'QR-код для смартфона' : isEn ? 'Mobile QR Code' : 'QR-Code',
    linkCopied: isRu ? 'Ссылка скопирована!' : isEn ? 'Link copied!' : 'Link kopiert!',
    grade5HeroTag: isRu
      ? '⭐ СПЕЦИАЛЬНЫЙ ФОКУС: 5-Й КЛАСС (ERPROBUNGSSTUFE)'
      : isEn
      ? '⭐ SPECIAL FOCUS: 5TH GRADE (TRANSITION YEAR)'
      : '⭐ SCHWERPUNKT: 5. KLASSE (ERPROBUNGSSTUFE)',
    urgentActionTitle: isRu ? 'Ключевая задача для родителей 5-го класса:' : isEn ? 'Key Action for 5th Grade Parents:' : 'Wichtiges To-Do für Eltern der 5. Klassen:',
    checklistHeading: isRu ? 'Чек-лист родителя (интерактивный):' : isEn ? 'Interactive Parent Checklist:' : 'Interaktive Eltern-Checkliste:',
    highlightsHeading: isRu
      ? 'Ключевое для родителей (Сводка недели)'
      : isEn
      ? 'Executive Highlights for Parents'
      : 'Das Wichtigste der Woche auf einen Blick',
    examTimetableHeading: isRu
      ? 'Календарь контрольных работ и школьных дат'
      : isEn
      ? 'Exams, Tests & School Calendar'
      : 'Klassenarbeiten, Tests & Schultermine',
    officialCalLink: isRu ? 'Официальный календарь' : isEn ? 'Official Calendar' : 'Schulkalender (Portal)',
    searchPlaceholder: isRu
      ? 'Поиск по классу или предмету (напр. 5a, Englisch, Latein)...'
      : isEn
      ? 'Filter by class or subject (e.g. 5a, Latin, Math)...'
      : 'Klasse oder Fach filtern (z. B. 5a, 8ac, Latein)...',
    showExamsOnly: isRu ? 'Только контрольные работы' : isEn ? 'Exams only' : 'Nur Klassenarbeiten & Tests',
    dateCol: isRu ? 'Дата' : isEn ? 'Date' : 'Datum',
    cohortCol: isRu ? 'Класс' : isEn ? 'Class' : 'Klasse',
    eventCol: isRu ? 'Событие / Контрольная' : isEn ? 'Event / Exam' : 'Anlass / Klassenarbeit',
    calActionCol: isRu ? 'Календарь' : isEn ? 'Calendar' : 'Kalender',
    exportCalBtn: isRu ? '+ Календарь' : isEn ? '+ Cal' : '+ Kalender',
    noEventsFound: isRu ? 'Событий по указанному фильтру не найдено.' : isEn ? 'No dates match the filter.' : 'Keine Termine für diesen Filter gefunden.',
    gradeBandsHeading: isRu ? 'Информация по ступеням обучения' : isEn ? 'Grade Band Highlights' : 'Informationen nach Stufen',
    mensaHeading: isRu ? 'Столовая (Mensa) и практические вопросы' : isEn ? 'Canteen & School Routine' : 'Mensa & Ganztagsorganisation',
    deadlinesHeading: isRu ? 'Сроки и задачи недели' : isEn ? 'Action Deadlines' : 'Wichtige Fristen',
    contactsHeading: isRu ? 'Контакты школы' : isEn ? 'School Office Contacts' : 'Wichtige Kontakte',
    articlesHeading: isRu ? 'Новости и проекты на adenauer-bonn.de' : isEn ? 'School Articles & Projects' : 'Aktuelle Schulberichte (adenauer-bonn.de)',
    readMoreOnPortal: isRu ? 'Читать на сайте школы' : isEn ? 'Read on adenauer-bonn.de' : 'Auf adenauer-bonn.de lesen',
    refreshBriefing: isRu ? 'Обновить' : isEn ? 'Refresh' : 'Aktualisieren',
    onlineNotice: isRu
      ? 'Онлайн-брифинг для родителей KAG Bonn. Доступен в браузере в любое время без подписки на почту.'
      : isEn
      ? 'KAG Bonn Online Parent Briefing. Always accessible on any device without email clutter.'
      : 'KAG Bonn Online-Briefing. Jederzeit im Web-Portal abrufbar — ohne E-Mail-Überfüllung.',
  };

  if (!briefing) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2 font-serif">{t.emptyTitle}</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          {t.emptyDesc}
        </p>
        <button
          onClick={() => onRefreshSummary()}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          <span>{isRefreshing ? (isRu ? 'Обновление...' : isEn ? 'Refreshing...' : 'Wird aktualisiert...') : t.createBtn}</span>
        </button>
      </div>
    );
  }

  // Filter events by search
  const filteredEvents = briefing.upcomingExamsAndEvents.filter((ev) => {
    const q = examSearch.toLowerCase();
    const matchesSearch =
      ev.title.toLowerCase().includes(q) ||
      ev.cohort.toLowerCase().includes(q) ||
      (ev.details && ev.details.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (onlyExams && ev.type !== 'exam') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Main Online Briefing Card Container */}
      <article className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8 print:border-none print:shadow-none">
        {/* 1. ⭐ GRADE 5 FOCUS HERO CARD ⭐ */}
        {briefing.grade5Focus && (
            <section
              id="grade-5-focus-card"
              className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                    {t.grade5HeroTag}
                  </span>
                </div>
                <span className="text-xs font-medium text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                  Klasse 5a, 5b, 5c
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-amber-950 mb-3 font-serif">
                {briefing.grade5Focus.title}
              </h2>

              <ul className="space-y-2 mb-4">
                {briefing.grade5Focus.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-amber-900 leading-relaxed">
                    <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {briefing.grade5Focus.parentAction && (
                <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-3 text-xs sm:text-sm font-semibold text-amber-950 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold">{t.urgentActionTitle}</span>{' '}
                    <span>{briefing.grade5Focus.parentAction}</span>
                  </div>
                </div>
              )}

              {/* Interactive Checklist for Parents */}
              <div className="pt-3 border-t border-amber-200/70">
                <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                  {t.checklistHeading}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'mensa_chip', label: isRu ? 'Mensa-Chip пополнен (обеды Mo, Mi, Do)' : isEn ? 'Mensa account topped up' : 'Mensa-Chip Guthaben geladen' },
                    { key: 'schuelerticket', label: isRu ? 'Проездной билет (Schülerticket) проверен' : isEn ? 'School transit ticket packed' : 'Schülerticket (VRS) im Ranzen' },
                    { key: 'book_covers', label: isRu ? 'Защитные обложки на школьных книгах' : isEn ? 'Protective covers on loan books' : 'Schulbuch-Umschläge angebracht' },
                    { key: 'ag_form', label: isRu ? 'Бланк записи в кружки (AG) сдан' : isEn ? 'Clubs (AG) registration submitted' : 'AG-Wahlzettel abgegeben' },
                  ].map((task) => (
                    <button
                      key={task.key}
                      onClick={() => toggleTask(task.key)}
                      className={`text-left text-xs p-2 rounded-lg border transition flex items-center gap-2 cursor-pointer ${
                        checkedTasks[task.key]
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through opacity-80'
                          : 'bg-white border-amber-200/80 text-amber-950 hover:bg-amber-100/50'
                      }`}
                    >
                      {checkedTasks[task.key] ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. EXECUTIVE HIGHLIGHTS (3 High-Signal Cards) */}
          <section id="executive-highlights-section">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 font-serif">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {t.highlightsHeading}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {briefing.executiveHighlights.map((hl, idx) => (
                <a
                  key={idx}
                  href={hl.sourceUrl || 'https://adenauer-bonn.de/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col justify-between rounded-xl p-4 border transition duration-150 hover:shadow-md cursor-pointer ${
                    hl.urgent
                      ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300 text-rose-950 hover:bg-rose-50'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-900'
                  }`}
                  title={`${isRu ? 'Открыть источник на сайте' : isEn ? 'Open source on website' : 'Quelle auf adenauer-bonn.de öffnen'}: ${hl.title}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {hl.tag && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            hl.urgent
                              ? 'bg-rose-200 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {hl.tag}
                        </span>
                      )}
                      {hl.urgent && (
                        <span className="text-[10px] uppercase font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {isRu ? 'Срочно' : isEn ? 'Priority' : 'Frist'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 mb-1.5 leading-snug transition-colors">
                      {hl.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {hl.detail}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                    <span className="flex items-center gap-1">
                      {isRu ? 'К источнику на сайте' : isEn ? 'Open on website' : 'Quelle auf Website öffnen'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 3. EXAMS & SCHOOL CALENDAR (With 1-click .ics export and source links on each row) */}
          <section id="exams-calendar-section">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {t.examTimetableHeading}
                </h2>
                <a
                  href="https://adenauer-bonn.de/termine/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 transition"
                  title="adenauer-bonn.de/termine/"
                >
                  <span>{t.officialCalLink}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyExams}
                    onChange={(e) => setOnlyExams(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>{t.showExamsOnly}</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3 whitespace-nowrap">{t.dateCol}</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">{t.cohortCol}</th>
                    <th className="py-2.5 px-3">{t.eventCol}</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap print:hidden">{t.calActionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                          {ev.date}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              ev.type === 'exam'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-sky-100 text-sky-900'
                            }`}
                          >
                            {ev.cohort}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <a
                            href={
                              ev.sourceUrl ||
                              (ev.type === 'exam'
                                ? 'https://adenauer-bonn.de/klassenarbeitstermine/'
                                : 'https://adenauer-bonn.de/termine/')
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-blue-600 transition"
                            title={`${isRu ? 'Открыть на сайте школы' : isEn ? 'Open on school website' : 'Auf adenauer-bonn.de öffnen'}: ${ev.title}`}
                          >
                            <span>{ev.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-blue-600 opacity-60 group-hover/link:opacity-100 shrink-0 transition" />
                          </a>
                          {ev.details && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{ev.details}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap print:hidden">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => downloadIcsFile(ev)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition cursor-pointer text-[11px]"
                              title="Download .ics event to add to Google Calendar, Apple Calendar, or Outlook"
                            >
                              <Calendar className="w-3 h-3 text-blue-600" />
                              <span>{t.exportCalBtn}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        {t.noEventsFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. GRADE BAND HIGHLIGHTS (Unterstufe, Mittelstufe, Oberstufe) */}
          {briefing.gradeLevelSections && briefing.gradeLevelSections.length > 0 && (
            <section id="grade-bands-section">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 font-serif">
                <BookOpen className="w-4 h-4 text-blue-600" />
                {t.gradeBandsHeading}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {briefing.gradeLevelSections.map((band, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900 mb-2.5 flex items-center gap-1.5 text-blue-900">
                      🎓 {band.gradeBand}
                    </h3>
                    <div className="space-y-2.5">
                      {band.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                          <div className="font-semibold text-xs text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</div>
                          {item.actionItem && (
                            <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                              👉 {item.actionItem}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. MENSA, DEADLINES & CONTACTS */}
          <section id="mensa-and-contacts-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mensa & Routine */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2 text-slate-900">
                <Utensils className="w-4 h-4 text-amber-600" />
                {t.mensaHeading}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {briefing.parentTipsAndMensa.mensaNotes}
              </p>

              {briefing.parentTipsAndMensa.actionDeadlines.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase">
                    {t.deadlinesHeading}:
                  </div>
                  <div className="space-y-1">
                    {briefing.parentTipsAndMensa.actionDeadlines.map((dl, idx) => (
                      <div key={idx} className="text-xs flex items-center justify-between text-slate-800 bg-white p-1.5 rounded border border-slate-200/60">
                        <span>{dl.task}</span>
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                          {dl.deadline}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* School Contacts */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2 text-slate-900">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {t.contactsHeading}
                </h3>
                <div className="space-y-2">
                  {briefing.parentTipsAndMensa.importantContacts.map((c, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{c.role}</span>
                      <span className="text-blue-700 font-medium">{c.contact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick direct contact links */}
              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center gap-2">
                <a
                  href="tel:0228777630"
                  className="flex-1 text-center py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition"
                >
                  📞 Tel: 0228 777630
                </a>
                <a
                  href="mailto:sekretariat@adenauer-bonn.de"
                  className="flex-1 text-center py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                >
                  ✉️ Sekretariat E-Mail
                </a>
              </div>
            </div>
          </section>

          {/* 6. ARTICLES & SCHOOL LIFE FROM adenauer-bonn.de */}
          {briefing.schoolLifeAndProjects && briefing.schoolLifeAndProjects.length > 0 && (
            <section id="school-life-section">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 font-serif">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                {t.articlesHeading}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {briefing.schoolLifeAndProjects.map((art, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                    <div>
                      {art.category && (
                        <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded mb-1.5 inline-block">
                          {art.category}
                        </span>
                      )}
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {art.summary}
                      </p>
                    </div>

                    {art.sourceUrl && (
                      <a
                        href={art.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                      >
                        <span>{t.readMoreOnPortal}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. CLOSING NOTE */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-center text-xs text-slate-700 italic">
            "{briefing.closingNote}"
          </div>

        {/* Footer info within the briefing view */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <div>Konrad-Adenauer-Gymnasium Bonn • Max-Planck-Str. 24-36, 53177 Bonn • Tel: 0228 777630</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {t.onlineNotice}
          </div>
        </div>
      </article>
    </div>
  );
};
