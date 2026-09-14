import React, { useState } from 'react';
import {
  Sparkles,
  Archive,
  Calendar,
  Languages,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Filter,
  FileText,
  Clock,
  Trash2,
  Star
} from 'lucide-react';
import type { NewsletterSummary } from '../types';

interface GeneratorAndArchiveProps {
  newsletters: NewsletterSummary[];
  currentNewsletterId: string | null;
  onSelectNewsletter: (newsletter: NewsletterSummary) => void;
  onGenerate: (language: 'de' | 'en' | 'ru', customInstructions?: string) => Promise<void>;
  isGenerating: boolean;
  language: 'de' | 'en' | 'ru';
}

export const GeneratorAndArchive: React.FC<GeneratorAndArchiveProps> = ({
  newsletters,
  currentNewsletterId,
  onSelectNewsletter,
  onGenerate,
  isGenerating,
  language,
}) => {
  const isEn = language === 'en';
  const isRu = language === 'ru';

  const [selectedLang, setSelectedLang] = useState<'de' | 'en' | 'ru'>(language);
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('grade5');

  const presets = [
    {
      id: 'grade5',
      label: isRu ? '⭐ Фокус на 5-й класс (Erprobungsstufe)' : isEn ? '⭐ 5th Grade Transition Focus' : '⭐ Schwerpunkt 5. Klasse',
      prompt: isRu
        ? 'Сделайте максимальный упор на адаптацию 5-х классов, систему наставников (Paten), карточки питания в Mensa и школьный дневник.'
        : isEn
        ? 'Emphasize 5th grade arrival, student mentor program, Mensa cafeteria card, and homework planner checklist.'
        : 'Betone besonders das Einleben der 5. Klassen, Patenprogramm, Mensa-Chip und Hausaufgabenheft.',
    },
    {
      id: 'exams',
      label: isRu ? '📅 Расписание контрольных и тестов' : isEn ? '📅 Upcoming Exams & Tests' : '📅 Klassenarbeiten & Tests Fokus',
      prompt: isRu
        ? 'Выделите все ближайшие контрольные работы (Klassenarbeiten), тесты по иностранным языкам и сроки подготовки.'
        : isEn
        ? 'Highlight upcoming exams, vocabulary checks, and preparation deadlines.'
        : 'Hebe alle anstehenden Klassenarbeiten, Vokabelüberprüfungen und Termine hervor.',
    },
    {
      id: 'clubs_mensa',
      label: isRu ? '🍽️ Столовая (Mensa) и кружки (AG)' : isEn ? '🍽️ Cafeteria & Extracurricular Clubs' : '🍽️ Mensa & AG-Angebote',
      prompt: isRu
        ? 'Сделайте упор на запись в кружки (AG-Wahl, Kanu, Theater), питание в столовой и расписание продленного дня.'
        : isEn
        ? 'Focus on extracurricular club registration (canoe, drama, choir) and cafeteria meal logistics.'
        : 'Schwerpunkt auf AG-Wahlzettel, Kanu/Theater-AGs und Mensa-Verpflegung.',
    },
  ];

  const handleApplyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = presets.find((x) => x.id === presetId);
    if (p) {
      setCustomInstructions(p.prompt);
    }
  };

  const handleTriggerGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(selectedLang, customInstructions);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Column 1: Generator Studio */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                {isRu ? 'Создать онлайн-выпуск (ИИ)' : isEn ? 'AI Briefing Generator' : 'Online-Briefing generieren'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRu
                  ? 'Анализ сайта adenauer-bonn.de с помощью Gemini'
                  : isEn
                  ? 'Crawls adenauer-bonn.de & synthesizes live updates'
                  : 'Liest adenauer-bonn.de aus und fasst zusammen'}
              </p>
            </div>
          </div>

          <form onSubmit={handleTriggerGenerate} className="space-y-4 text-xs">
            {/* Language Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-blue-600" />
                <span>{isRu ? 'Язык дайджеста:' : isEn ? 'Briefing Language:' : 'Sprache des Briefings:'}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'de', label: 'Deutsch' },
                  { id: 'en', label: 'English' },
                  { id: 'ru', label: 'Русский' },
                ].map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => setSelectedLang(l.id as any)}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center transition cursor-pointer ${
                      selectedLang === l.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {isRu ? 'Тематические пресеты:' : isEn ? 'Editorial Focus Presets:' : 'Thematische Schwerpunkte:'}
              </label>
              <div className="space-y-1.5">
                {presets.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleApplyPreset(p.id)}
                    className={`w-full text-left p-2 rounded-lg border transition text-xs cursor-pointer ${
                      selectedPreset === p.id
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {isRu ? 'Дополнительные пожелания к выпуску:' : isEn ? 'Custom Instructions / Focus:' : 'Zusätzliche redaktionelle Wünsche:'}
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                placeholder={
                  isRu
                    ? 'Например: обратите особое внимание на расписание каноэ-секции и родительский вечер...'
                    : isEn
                    ? 'e.g. emphasize the upcoming canoe club schedule and parent evening...'
                    : 'z. B. Besondere Erwähnung des Kanu-Clubs und des Elternabends...'
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-amber-300'}`} />
              <span>
                {isGenerating
                  ? isRu ? 'Создание онлайн-выпуска...' : isEn ? 'Compiling Briefing...' : 'Online-Briefing wird generiert...'
                  : isRu ? 'Сгенерировать и открыть онлайн' : isEn ? 'Generate & View Online' : 'Jetzt generieren & online ansehen'}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Column 2: Saved Briefings Archive */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Archive className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                {isRu ? 'Архив онлайн-выпусков' : isEn ? 'Briefing Archive' : 'Archiv der Online-Briefings'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {newsletters.length} {isRu ? 'выпусков' : isEn ? 'briefings' : 'Ausgaben'}
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {newsletters.length > 0 ? (
              newsletters.map((nl) => {
                const isSelected = nl.id === currentNewsletterId;
                return (
                  <div
                    key={nl.id}
                    className={`p-4 rounded-xl border transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                          {nl.weekLabel}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                          {nl.language.toUpperCase()}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {isRu ? 'Активен' : isEn ? 'Currently Viewing' : 'Aktiv geöffnet'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(nl.generatedAt).toLocaleDateString(isRu ? 'ru-RU' : isEn ? 'en-US' : 'de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1 leading-snug">
                      {nl.headline}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {nl.greeting}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>📅 {nl.upcomingExamsAndEvents.length} Termine</span>
                        {nl.grade5Focus && (
                          <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> 5. Klasse
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectNewsletter(nl)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {isSelected
                            ? isRu ? 'Открыт' : isEn ? 'Viewing' : 'Geöffnet'
                            : isRu ? 'Открыть онлайн' : isEn ? 'Open Briefing' : 'Im Portal ansehen'}
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                {isRu ? 'Архив пуст. Создайте первый выпуск слева!' : isEn ? 'Archive is empty. Generate a briefing on the left!' : 'Noch keine archivierten Briefings vorhanden.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
