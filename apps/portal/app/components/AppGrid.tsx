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
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
        <p className="text-zinc-400">{t('noApps')}</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
