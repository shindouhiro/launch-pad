export type Category = "All" | "Productivity" | "Development" | "Social" | "Entertainment" | string;

export interface AppItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: Category;
  description: string;
  images?: string[];
  coverImage?: string;
}

export const apps: AppItem[] = [
  {
    id: "1",
    title: "GitHub",
    url: "https://github.com",
    icon: "🐙",
    category: "Development",
    description: "Code hosting and collaboration",
  },
  {
    id: "2",
    title: "Vercel",
    url: "https://vercel.com",
    icon: "▲",
    category: "Development",
    description: "Develop. Preview. Ship.",
  },
];
