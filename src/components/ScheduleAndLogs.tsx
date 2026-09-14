import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Settings,
  Save,
  ShieldCheck,
  Send
} from 'lucide-react';
import type { DeliveryLog, ScheduleConfig } from '../types';

interface ScheduleAndLogsProps {
  schedule: ScheduleConfig;
  logs: DeliveryLog[];
  onUpdateSchedule: (schedule: Partial<ScheduleConfig>) => Promise<void>;
  language: 'de' | 'en';
}

export const ScheduleAndLogs: React.FC<ScheduleAndLogsProps> = ({
  schedule,
  logs,
  onUpdateSchedule,
  language,
}) => {
  const isEn = language === 'en';
  const [dayOfWeek, setDayOfWeek] = useState(schedule.dayOfWeek);
  const [timeOfDay, setTimeOfDay] = useState(schedule.timeOfDay);
  const [enabled, setEnabled] = useState(schedule.enabled);
  const [schedLang, setSchedLang] = useState(schedule.language);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateSchedule({
      dayOfWeek,
      timeOfDay,
      enabled,
      language: schedLang,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const daysGerman = [
    { value: 'Sunday', label: 'Sonntag' },
    { value: 'Monday', label: 'Montag' },
    { value: 'Tuesday', label: 'Dienstag' },
    { value: 'Wednesday', label: 'Mittwoch' },
    { value: 'Thursday', label: 'Donnerstag' },
    { value: 'Friday', label: 'Freitag' },
  ];

  return (
    <div className="space-y-6">
      {/* Schedule Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {isEn ? 'Automated Weekly Dispatch Schedule' : 'Wöchentlicher automatischer E-Mail-Versand'}
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {enabled ? (isEn ? 'Active Cron' : 'Aktiviert') : (isEn ? 'Paused' : 'Deaktiviert')}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          {isEn
            ? 'The engine scrapes https://adenauer-bonn.de, digests all announcements and tests, and emails the briefing to parents on schedule.'
            : 'Das System analysiert https://adenauer-bonn.de, fasst alle Termine zusammen und sendet den Elternbrief pünktlich an alle Konten.'}
        </p>

        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEn ? 'Dispatch Day' : 'Versandtag'}
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {daysGerman.map((d) => (
                  <option key={d.value} value={d.value}>
                    {isEn ? d.value : d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEn ? 'Time (CET)' : 'Uhrzeit (Morgens/Abends)'}
              </label>
              <input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEn ? 'Default Language' : 'Standardsprache'}
              </label>
              <select
                value={schedLang}
                onChange={(e) => setSchedLang(e.target.value as 'de' | 'en')}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="de">Deutsch (DE)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>{isEn ? 'Enable automated dispatch' : 'Automatischen Versand aktivieren'}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-[11px] text-slate-400">
              {isEn ? 'Next scheduled briefing:' : 'Nächster geplanter Versand:'}{' '}
              <strong className="text-slate-700 font-semibold">{dayOfWeek}, {timeOfDay} Uhr</strong>
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? (isEn ? 'Saving...' : 'Wird gespeichert...') : (isEn ? 'Save Schedule' : 'Zeitplan speichern')}</span>
            </button>
          </div>
        </form>

        {saveSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Schedule updated successfully.' : 'Zeitplan erfolgreich aktualisiert.'}</span>
          </div>
        )}
      </div>

      {/* Delivery Logs & Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
              {isEn ? 'Delivery Logs & Dispatch History' : 'Versandprotokolle & Zustellhistorie'}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {logs.length} {isEn ? 'total dispatches recorded' : 'Zustellungen protokolliert'}
          </span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Time' : 'Zeitpunkt'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Subject / Headline' : 'Newsletter-Thema'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Recipients' : 'Empfänger'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Method' : 'Kanal'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Status' : 'Zustellstatus'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString(isEn ? 'en-US' : 'de-DE')}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {log.newsletterTitle}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold">{log.recipientCount} Eltern</span>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {log.recipients.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
                        {log.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {isEn ? 'Delivered' : 'Erfolgreich zugestellt'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          {isEn ? 'Failed' : 'Fehlgeschlagen'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            {isEn ? 'No dispatches sent yet.' : 'Noch keine E-Mails versendet.'}
          </div>
        )}
      </div>
    </div>
  );
};
