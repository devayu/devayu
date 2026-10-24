"use client";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

// Two blades, two ghosts: Atsu (Ghost of Yōtei) and Jin (Ghost of Tsushima).
const Blade = ({ jin: night, active }: { jin: boolean; active: boolean }) => (
  <svg
    viewBox="0 0 120 16"
    aria-hidden
    className={cn(
      "absolute inset-0 m-auto w-[64px] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
      active
        ? "opacity-100 rotate-[-14deg] scale-100"
        : "opacity-0 rotate-[160deg] scale-50"
    )}
  >
    {/* saya (scabbard) */}
    <path
      d="M4 8 Q 50 5.5 86 6.2 L 86 9.8 Q 50 10.5 4 8 Z"
      fill={night ? "#121820" : "#dfe5ea"}
      stroke={night ? "#d9a520" : "#7d8a96"}
      strokeWidth="0.8"
    />
    {/* gold kintsugi seams */}
    <path
      d="M18 7.4 l6 1.2 l5 -1 l7 1.1 M52 7 l5 1.4 l6 -1.2 M70 7.2 l4 1.3 l5 -0.8"
      fill="none"
      stroke="#d9a520"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    {/* tsuba (guard) */}
    <rect x="86" y="3.6" width="3" height="8.8" rx="1" fill="#d9a520" />
    {/* tsuka (handle) wrapped */}
    <path
      d="M89 6.3 L 116 6.6 Q 118 8 116 9.4 L 89 9.7 Z"
      fill={night ? "#2a2a2a" : "#6f7b87"}
      stroke={night ? "#d9a520" : "none"}
      strokeWidth="0.5"
    />
    <path
      d="M93 6.4 l3 3.2 M99 6.5 l3 3.1 M105 6.5 l3 3.1 M111 6.6 l3 3"
      stroke={night ? "#3a3a3a" : "#c8d0d7"}
      strokeWidth="1.1"
    />
  </svg>
);

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isJin = theme === "jin";
  const label = isJin ? "Switch to Atsu (Ghost of Yōtei)" : "Switch to Jin (Ghost of Tsushima)";

  return (
    <button
      type="button"
      onClick={() => setTheme(isJin ? "atsu" : "jin")}
      aria-label={label}
      title={label}
      className={cn(
        "group flex h-10 items-center gap-1 rounded-full border border-line bg-paper/60 pl-1 pr-4 backdrop-blur-md transition-colors hover:border-crimson/50",
        className
      )}
    >
      {/* The blade spins away and the other one is drawn */}
      <span className="relative h-full w-[70px]">
        <Blade jin={false} active={theme !== null && !isJin} />
        <Blade jin active={isJin} />
      </span>
      <span className="hidden font-mincho text-[13px] font-semibold sm:inline">
        {theme === null ? "" : isJin ? "Jin" : "Atsu"}
      </span>
    </button>
  );
}
