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
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === category
              ? "bg-white text-black shadow-lg shadow-white/10"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
