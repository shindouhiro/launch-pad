"use client";

import { Category } from "../data/apps";
import { useTranslations } from "next-intl";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const t = useTranslations('common');

  const getCategoryLabel = (category: Category) => {
    const key = category.toLowerCase() as 'all' | 'productivity' | 'development' | 'social' | 'entertainment';
    return t(key);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 backdrop-blur-md border ${isSelected
              ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105"
              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105"
              }`}
          >
            {isSelected && (
              <div className="absolute inset-0 -z-10 rounded-full bg-rose-500 blur-md opacity-50" />
            )}
            {getCategoryLabel(category)}
          </button>
        );
      })}
    </div>
  );
}
