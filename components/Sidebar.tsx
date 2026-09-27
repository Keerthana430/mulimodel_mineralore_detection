"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { modalities } from "@/lib/modalities";

const railItems = [
  { href: "/", icon: "grid" as const, label: "Overview" },
  ...modalities.map((m) => ({ href: `/results/${m.key}`, icon: m.icon, label: m.label })),
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[72px] flex-col items-center border-r border-line/80 bg-base-900/90 py-4 backdrop-blur-xl">
      {/* Logo */}
      <Link
        href="/"
        className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow transition-transform hover:scale-105"
        aria-label="OreVision Home"
      >
        <Icon name="logo" className="h-5 w-5" strokeWidth={2} />
      </Link>

      {/* Divider */}
      <div className="mb-4 h-px w-8 bg-line/60" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {railItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
                active
                  ? "border-green-500/50 bg-brand-gradient-soft text-white shadow-glow"
                  : "border-transparent text-ink-500 hover:border-line hover:bg-base-800 hover:text-ink-100"
              }`}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
              {active && (
                <span className="absolute -left-[14px] h-5 w-[3px] rounded-full bg-brand-gradient" />
              )}

              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-base-800 border border-line/60 px-2.5 py-1 text-[11px] font-medium text-ink-100 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: version indicator */}
      <div className="mt-auto pt-4">
        <span className="text-[9px] font-mono text-ink-700 tracking-wider">v1.1</span>
      </div>
    </aside>
  );
}
