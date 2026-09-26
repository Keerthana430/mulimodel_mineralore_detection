import Link from "next/link";
import { Icon } from "./Icon";
import type { ModalityConfig } from "@/lib/modalities";

const descriptions: Record<string, string> = {
  rgb: "Classify using RGB data",
  microscopic: "Classify using microscopic imagery",
  infrared: "Classify using infrared spectral data",
  acoustic: "Classify using acoustic resonance data",
  capacitive: "Classify using capacitive sensing data",
};

export function ModalityCard({ modality }: { modality: ModalityConfig }) {
  const desc = descriptions[modality.key] ?? "Classify using sensor data";

  return (
    <Link
      href={`/results/${modality.key}`}
      className="group flex items-center justify-between gap-3 rounded-md border border-line/60 bg-base-850 p-4 transition-all hover:border-green-500/50 hover:bg-base-800/80"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line/60 bg-base-900 text-ink-300 transition-colors group-hover:border-green-500/40 group-hover:text-green-400">
          <Icon name={modality.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-ink-100 transition-colors group-hover:text-green-300">
            {modality.label}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-ink-500">
            {desc}
          </div>
        </div>
      </div>

      <Icon
        name="chevron"
        className="h-4 w-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-green-400"
      />
    </Link>
  );
}
