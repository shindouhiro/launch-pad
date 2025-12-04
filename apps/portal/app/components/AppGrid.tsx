"use client";

import { AppItem } from "../data/apps";
import AppCard from "./AppCard";
import { useTranslations } from "next-intl";

interface AppGridProps {
  apps: AppItem[];
}

export default function AppGrid({ apps }: AppGridProps) {
  const t = useTranslations('home');

  if (apps.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="text-4xl">🔍</div>
        <p className="text-lg text-zinc-400 font-light">{t('noApps')}</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
