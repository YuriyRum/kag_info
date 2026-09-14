import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Send,
  Star,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import type { Subscriber } from '../types';

interface SubscribersManagerProps {
  subscribers: Subscriber[];
  onAddSubscriber: (subscriber: Omit<Subscriber, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteSubscriber: (id: string) => Promise<void>;
  onSendToEmail: (email: string) => Promise<void>;
  isSending: boolean;
  language: 'de' | 'en';
}

export const SubscribersManager: React.FC<SubscribersManagerProps> = ({
  subscribers,
  onAddSubscriber,
  onDeleteSubscriber,
  onSendToEmail,
  isSending,
  language,
}) => {
  const isEn = language === 'en';
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGrades, setNewGrades] = useState('5a, 8b');
  const [newLanguage, setNewLanguage] = useState<'de' | 'en'>('de');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      alert(isEn ? 'Please enter a valid email address.' : 'Bitte eine gültige E-Mail eingeben.');
      return;
    }

    const gradesArray = newGrades
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    await onAddSubscriber({
      name: newName || 'Elternteil',
      email: newEmail.trim(),
      grades: gradesArray.length ? gradesArray : ['Alle Stufen'],
      language: newLanguage,
      active: true,
    });

    setNewName('');
    setNewEmail('');
    setNewGrades('');
    setShowAddForm(false);
    setFeedback(isEn ? 'New subscriber registered successfully!' : 'Neuer Abonnent erfolgreich registriert!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {isEn ? 'Parent Subscriber Directory' : 'Eltern-E-Mail Verteilerliste'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {isEn
              ? 'Every week, the curated KAG Bonn digest is dispatched directly to these verified parent email accounts.'
              : 'Jede Woche wird die KAG Bonn Zusammenfassung direkt an diese verifizierten Eltern-E-Mail-Konten zugestellt.'}
          </p>
        </div>

        <button
          id="add-subscriber-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs self-start sm:self-center cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isEn ? 'Add Parent Email' : 'Elternteil hinzufügen'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
          {feedback}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
        >
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            {isEn ? 'Register New Parent Email' : 'Neues Eltern-Konto für Wochen-Briefing anlegen'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isEn ? 'Parent / Contact Name' : 'Name des Elternteils'}
              </label>
              <input
                id="input-sub-name"
                type="text"
                required
                placeholder={isEn ? 'e.g. Familie Müller' : 'z. B. Familie Müller'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isEn ? 'Email Address' : 'E-Mail-Adresse'}
              </label>
              <input
                id="input-sub-email"
                type="email"
                required
                placeholder="name@beispiel.de"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isEn ? 'Classes / Grades (comma separated)' : 'Klassen / Jahrgangsstufen'}
              </label>
              <input
                id="input-sub-grades"
                type="text"
                placeholder="5a, 8b, Q1"
                value={newGrades}
                onChange={(e) => setNewGrades(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isEn ? 'Language Preference' : 'Sprachpräferenz'}
              </label>
              <select
                id="select-sub-lang"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value as 'de' | 'en')}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="de">Deutsch (DE)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Abbrechen'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              {isEn ? 'Save Subscriber' : 'Abonnent speichern'}
            </button>
          </div>
        </form>
      )}

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-3 px-4 font-semibold">{isEn ? 'Parent / Subscriber' : 'Elternteil / Name'}</th>
                <th className="py-3 px-4 font-semibold">{isEn ? 'Email Account' : 'E-Mail-Konto'}</th>
                <th className="py-3 px-4 font-semibold">{isEn ? 'Associated Classes' : 'Betroffene Klassen'}</th>
                <th className="py-3 px-4 font-semibold">{isEn ? 'Language' : 'Sprache'}</th>
                <th className="py-3 px-4 font-semibold">{isEn ? 'Status' : 'Status'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isEn ? 'Actions' : 'Aktionen'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((sub) => {
                const isUserSelf = sub.email === 'rumyua@gmail.com';
                return (
                  <tr key={sub.id} className={`hover:bg-slate-50/70 transition ${isUserSelf ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {isUserSelf && (
                          <span
                            title={isEn ? 'Active User Account' : 'Haupt-Benutzerkonto'}
                            className="text-amber-500"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          </span>
                        )}
                        <span>{sub.name}</span>
                        {isUserSelf && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                            {isEn ? 'You' : 'Sie'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {sub.grades.map((g, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-xs font-semibold text-slate-600">
                      {sub.language}
                    </td>
                    <td className="py-3 px-4">
                      {sub.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          {isEn ? 'Active' : 'Aktiv'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          {isEn ? 'Paused' : 'Pausiert'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSendToEmail(sub.email)}
                          disabled={isSending}
                          className="p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50 cursor-pointer"
                          title={isEn ? `Send briefing to ${sub.email}` : `Briefing an ${sub.email} senden`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        {!isUserSelf && (
                          <button
                            onClick={() => onDeleteSubscriber(sub.id)}
                            className="p-1.5 text-xs text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                            title={isEn ? 'Remove subscriber' : 'Abonnent entfernen'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
