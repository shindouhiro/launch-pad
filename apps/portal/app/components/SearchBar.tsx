"use client";

import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const t = useTranslations('common');

  return (
    <div className="relative w-full group">
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-zinc-400 group-focus-within:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('search')}
        className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-14 pr-6 text-lg text-white placeholder-zinc-500 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:border-purple-500/50 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-purple-500/10 shadow-lg"
      />
    </div>
  );
}
