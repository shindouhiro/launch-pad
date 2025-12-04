"use client";

import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const t = useTranslations('common');

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <span className="text-xl">🔍</span>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('search')}
        className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-zinc-400 backdrop-blur-md transition-all focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      />
    </div>
  );
}
