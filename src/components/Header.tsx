import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  isRefreshing: boolean;
  onRefreshSummary: () => void;
  language: 'de' | 'en' | 'ru';
}

export const Header: React.FC<HeaderProps> = ({
  isRefreshing,
  onRefreshSummary,
  language,
}) => {
  const isEn = language === 'en';
  const isRu = language === 'ru';

  const label = isRefreshing
    ? isRu
      ? 'Обновление...'
      : isEn
      ? 'Refreshing...'
      : 'Wird aktualisiert...'
    : isRu
    ? 'Обновить дайджест'
    : isEn
    ? 'Refresh Briefing'
    : 'Briefing aktualisieren';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-serif font-bold text-lg shadow-inner border border-blue-400/30 shrink-0">
            KAG
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-serif">
            Konrad-Adenauer-Gymnasium Bonn
          </span>
        </div>

        {/* Refresh Button and Icon */}
        <button
          id="refresh-summary-btn"
          onClick={onRefreshSummary}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-blue-500/25 transition disabled:opacity-60 cursor-pointer"
          title={isRu ? 'Обновить дайджест' : isEn ? 'Refresh briefing' : 'Briefing aktualisieren'}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-white'}`} />
          <span>{label}</span>
        </button>
      </div>
    </header>
  );
};
