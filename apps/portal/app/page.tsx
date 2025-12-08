"use client";
import { useState, useMemo } from "react";
import { AppItem } from "./data/apps";
import AppGrid from "./components/AppGrid";
import SearchBar from "./components/SearchBar";
import CategoryTabs from "./components/CategoryTabs";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useRecommendations, useCategories } from "@/hooks";

export default function Home() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { recommendations: apps, loading: appsLoading } = useRecommendations();
  const { categories: categoryList, loading: categoriesLoading } = useCategories();

  const categories = useMemo(() => {
    return ["All", ...categoryList.map(c => c.name)];
  }, [categoryList]);

  const loading = appsLoading || categoriesLoading;

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = app.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, apps]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-rose-500/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-amber-500/20 blur-[100px] animate-pulse-slow [animation-delay:2s]" />
        <div className="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-violet-500/20 blur-[80px] animate-pulse-slow [animation-delay:4s]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto flex min-h-screen flex-col items-center px-4 py-24 relative z-10">
        <div className="mb-16 flex w-full flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="absolute top-6 right-6">
              <LanguageSwitcher />
            </div>

            <h1 className="relative bg-gradient-to-br from-white via-rose-200 to-violet-200 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl drop-shadow-sm">
              {t('home.title')}
              <div className="absolute -inset-1 blur-3xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 -z-10 opacity-50" />
            </h1>
            <p className="max-w-2xl text-lg text-slate-400 leading-relaxed font-light">
              {t('home.subtitle')}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-8 animate-fade-in-up [animation-delay:0.2s] opacity-0 fill-mode-forwards">
            <div className="w-full max-w-xl">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        <div className="w-full animate-fade-in-up [animation-delay:0.4s] opacity-0 fill-mode-forwards">
          <AppGrid apps={filteredApps} />
        </div>
      </div>
    </main>
  );
}
