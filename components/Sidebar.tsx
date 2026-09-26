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
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-[76px] flex-col items-center border-r border-line/80 bg-base-900/80 py-5 backdrop-blur-xl">
      <Link
        href="/"
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow"
      >
        <Icon name="logo" className="h-5 w-5" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {railItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                active
                  ? "border-green-500/50 bg-brand-gradient-soft text-white shadow-glow"
                  : "border-transparent text-ink-500 hover:border-line hover:bg-base-800 hover:text-ink-100"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {active && (
                <span className="absolute -left-3 h-5 w-1 rounded-full bg-brand-gradient" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
