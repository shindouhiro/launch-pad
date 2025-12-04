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
      className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)]"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-all duration-500 group-hover:from-purple-500/10 group-hover:via-transparent group-hover:to-blue-500/10 group-hover:opacity-100" />

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-5xl shadow-inner ring-1 ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:ring-purple-500/30 group-hover:shadow-purple-500/20">
        <span className="drop-shadow-lg filter">{app.icon}</span>
      </div>

      <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300">
        {app.title}
      </h3>

      <p className="text-center text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors line-clamp-2">
        {app.description}
      </p>

      {/* Launch Indicator */}
      <div className="absolute top-4 right-4 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </div>
    </Link>
  );
}
