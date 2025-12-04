import Link from "next/link";
import { AppItem } from "../data/apps";

interface AppCardProps {
  app: AppItem;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/20"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-4xl shadow-inner ring-1 ring-white/20 transition-transform duration-300 group-hover:rotate-6">
        {app.icon}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-purple-300">
        {app.title}
      </h3>
      <p className="text-center text-xs text-zinc-400 group-hover:text-zinc-300">
        {app.description}
      </p>
    </Link>
  );
}
