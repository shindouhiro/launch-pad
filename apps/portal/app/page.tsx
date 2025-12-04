"use client";

import { useState, useMemo, useEffect } from "react";
import { AppItem, Category } from "./data/apps";
import AppGrid from "./components/AppGrid";
import SearchBar from "./components/SearchBar";
import CategoryTabs from "./components/CategoryTabs";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [apps, setApps] = useState<AppItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/recommendations")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error("Failed to fetch apps", err));
  }, []);

  const categories: Category[] = [
    "All",
    "Productivity",
    "Development",
    "Social",
    "Entertainment",
  ];

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
    <main className="min-h-screen w-full bg-black text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 -z-10 h-full w-full bg-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto flex min-h-screen flex-col items-center px-4 py-20">
        <div className="mb-12 flex w-full flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4">
            <h1 className="bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              {t('home.title')}
            </h1>
            <LanguageSwitcher />
          </div>
          <p className="max-w-lg text-lg text-zinc-400">
            {t('home.subtitle')}
          </p>

          <div className="flex w-full flex-col items-center gap-6">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        <AppGrid apps={filteredApps} />
      </div>
    </main>
  );
}
