import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Calendar,
  BookOpen,
  FileText,
  Clock,
  Layers,
  Filter,
  CheckCircle2
} from 'lucide-react';
import type { SiteAnalysisData } from '../types';

interface WebsiteDataExplorerProps {
  siteData: SiteAnalysisData | null;
  language: 'de' | 'en';
}

export const WebsiteDataExplorer: React.FC<WebsiteDataExplorerProps> = ({
  siteData,
  language,
}) => {
  const isEn = language === 'en';
  const [subTab, setSubTab] = useState<'posts' | 'events' | 'pages'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [examOnly, setExamOnly] = useState(false);

  if (!siteData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
        {isEn ? 'No website data cached. Please sync the website.' : 'Keine Website-Daten vorhanden. Bitte Website synchronisieren.'}
      </div>
    );
  }

  const filteredPosts = siteData.posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
  });

  const filteredEvents = siteData.events.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      e.title.toLowerCase().includes(q) ||
      (e.cohort && e.cohort.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q));
    if (examOnly) {
      return matchesSearch && e.isExam;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {isEn ? 'Scraped Website Knowledge Base' : 'Extrahierte Datenbasis von adenauer-bonn.de'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {isEn ? 'Last refreshed:' : 'Letzte Aktualisierung:'}{' '}
            {new Date(siteData.lastCrawled).toLocaleString(isEn ? 'en-US' : 'de-DE')} • {isEn ? 'Target:' : 'Ziel-Domain:'}{' '}
            <a
              href="https://adenauer-bonn.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-medium"
            >
              https://adenauer-bonn.de
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
            <span className="font-bold">{siteData.stats.totalPosts}</span> {isEn ? 'News Posts' : 'Aktuelle Beiträge'}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
            <span className="font-bold">{siteData.stats.totalEvents}</span> {isEn ? 'Calendar Items' : 'Termine & Arbeiten'}
          </div>
        </div>
      </div>

      {/* Filter and Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSubTab('posts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              subTab === 'posts'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? `News & Articles (${siteData.posts.length})` : `Aktuelle Beiträge (${siteData.posts.length})`}</span>
          </button>
          <button
            onClick={() => setSubTab('events')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              subTab === 'events'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isEn ? `Calendar & Exams (${siteData.events.length})` : `Terminkalender (${siteData.events.length})`}</span>
          </button>
          <button
            onClick={() => setSubTab('pages')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              subTab === 'pages'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isEn ? `Core Pages (${siteData.pages.length})` : `Schul-Seiten (${siteData.pages.length})`}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'events' && (
            <button
              onClick={() => setExamOnly(!examOnly)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                examOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{isEn ? 'Exams Only' : 'Nur Tests/Arbeiten'}</span>
            </button>
          )}

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? 'Search live data...' : 'Durchsuchen...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: POSTS */}
      {subTab === 'posts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString(isEn ? 'en-US' : 'de-DE')}
                  </span>
                  <span className="font-mono">ID: {post.id}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">adenauer-bonn.de</span>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>{isEn ? 'Read on site' : 'Artikel öffnen'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 2: EVENTS */}
      {subTab === 'events' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Date' : 'Datum'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Title / Event' : 'Titel / Anlass'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Cohort' : 'Zielgruppe'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Type' : 'Typ'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Description' : 'Beschreibung'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {evt.startDate}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {evt.title}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {evt.cohort || 'Alle'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {evt.isExam ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {isEn ? 'Exam / Test' : 'Test / Arbeit'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          {isEn ? 'School Event' : 'Schultermin'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-xs">
                      {evt.description || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CORE PAGES */}
      {subTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteData.pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {page.slug}
                  </span>
                  <a
                    href={page.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    <span>{isEn ? 'View page' : 'Seite öffnen'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{page.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {page.contentPreview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
