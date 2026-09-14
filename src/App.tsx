/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { OnlineBriefingView } from './components/OnlineBriefingView';
import { getClientFallbackBriefing } from './fallbackData';
import type {
  NewsletterSummary,
  SiteAnalysisData,
} from './types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [siteData, setSiteData] = useState<SiteAnalysisData | null>(null);
  const [newsletters, setNewsletters] = useState<NewsletterSummary[]>([]);
  const [currentNewsletter, setCurrentNewsletter] = useState<NewsletterSummary | null>(null);

  const [language, setLanguage] = useState<'de' | 'en' | 'ru'>('de');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 1. Initial Data Fetching
  const fetchAllData = useCallback(async () => {
    try {
      setGlobalError(null);
      const [siteRes, newsRes] = await Promise.all([
        fetch('/api/site/analyze').catch(() => null),
        fetch('/api/newsletters').catch(() => null),
      ]);

      let loadedBriefing: NewsletterSummary | null = null;

      if (siteRes && siteRes.ok) {
        const data = await siteRes.json().catch(() => null);
        if (data) setSiteData(data);
      }

      if (newsRes && newsRes.ok) {
        const newsList: NewsletterSummary[] = await newsRes.json().catch(() => []);
        if (Array.isArray(newsList) && newsList.length > 0) {
          setNewsletters(newsList);
          const matchLang = newsList.find((n) => n.language === language) || newsList[0];
          loadedBriefing = matchLang;
        }
      }

      // If on static host (Netlify) without backend server responses, provide client briefing
      if (!loadedBriefing) {
        const clientBriefing = getClientFallbackBriefing(language);
        setNewsletters([clientBriefing]);
        setCurrentNewsletter(clientBriefing);
      } else {
        setCurrentNewsletter(loadedBriefing);
      }
    } catch (err: any) {
      console.warn('Backend API unavailable, using client briefing:', err);
      const clientBriefing = getClientFallbackBriefing(language);
      setNewsletters([clientBriefing]);
      setCurrentNewsletter(clientBriefing);
    } finally {
      setInitialLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 2. Full Refresh & Regenerate: crawl live adenauer-bonn.de site + generate fresh briefing
  const handleRefreshSummary = async (targetLang?: string | unknown) => {
    const validLang: 'de' | 'en' | 'ru' =
      typeof targetLang === 'string' && (targetLang === 'de' || targetLang === 'en' || targetLang === 'ru')
        ? targetLang
        : language;

    setIsRefreshing(true);
    setGlobalError(null);
    try {
      // Step A: Background refresh of crawled site data (if backend exists)
      const crawlRes = await fetch('/api/site/crawl', { method: 'POST' }).catch(() => null);
      if (crawlRes && crawlRes.ok) {
        const updatedSiteData = await crawlRes.json().catch(() => null);
        if (updatedSiteData) setSiteData(updatedSiteData);
      }

      // Step B: Generate fresh parent briefing with Gemini (if backend exists)
      let freshBriefing: NewsletterSummary | null = null;
      const genRes = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: validLang }),
      }).catch(() => null);

      if (genRes && genRes.ok) {
        freshBriefing = await genRes.json().catch(() => null);
      }

      // If on Netlify / static deployment where /api/ endpoints are not hosted, seamlessly use client generator
      if (!freshBriefing) {
        freshBriefing = getClientFallbackBriefing(validLang);
      }

      setNewsletters((prev) => [freshBriefing!, ...prev.filter((n) => n.id !== freshBriefing!.id)]);
      setCurrentNewsletter(freshBriefing);
      setLanguage(validLang);
    } catch (err: any) {
      console.warn('Using client localized fallback on static host:', err);
      const fallback = getClientFallbackBriefing(validLang);
      setCurrentNewsletter(fallback);
      setLanguage(validLang);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Switch language and refresh summary
  const handleLanguageChange = async (newLang: 'de' | 'en' | 'ru') => {
    setLanguage(newLang);
    await handleRefreshSummary(newLang);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Clean Top Toolbar with ONLY School Icon and Refresh Button */}
      <Header
        isRefreshing={isRefreshing}
        onRefreshSummary={() => handleRefreshSummary()}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="w-9 h-9 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">
              {language === 'ru'
                ? 'Загрузка актуального онлайн-дайджеста adenauer-bonn.de...'
                : language === 'en'
                ? 'Loading live parent briefing from adenauer-bonn.de...'
                : 'Aktuelles Online-Briefing von adenauer-bonn.de wird geladen...'}
            </p>
          </div>
        ) : globalError ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{globalError}</span>
              </div>
              <button
                onClick={() => handleRefreshSummary()}
                disabled={isRefreshing}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg font-medium text-xs text-red-900 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{language === 'ru' ? 'Повторить' : language === 'en' ? 'Retry' : 'Erneut versuchen'}</span>
              </button>
            </div>

            {currentNewsletter && (
              <OnlineBriefingView
                briefing={currentNewsletter}
                language={language}
                onRefreshSummary={() => handleRefreshSummary()}
                onLanguageChange={handleLanguageChange}
                isRefreshing={isRefreshing}
              />
            )}
          </div>
        ) : (
          <OnlineBriefingView
            briefing={currentNewsletter}
            language={language}
            onRefreshSummary={() => handleRefreshSummary()}
            onLanguageChange={handleLanguageChange}
            isRefreshing={isRefreshing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-700">KAG Bonn Aktuelles Online-Briefing</span> •{' '}
            {language === 'ru'
              ? 'Официальный онлайн-дайджест на основе данных с'
              : language === 'en'
              ? 'Official parent briefing synthesized from'
              : 'Offizielles Eltern-Briefing basierend auf'}{' '}
            <a
              href="https://adenauer-bonn.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-medium"
            >
              https://adenauer-bonn.de
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Konrad-Adenauer-Gymnasium Bonn</span>
            <span>•</span>
            <span>Gemini AI Digest</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
