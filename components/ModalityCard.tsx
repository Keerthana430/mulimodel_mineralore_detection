import Link from "next/link";
import type { ModalityConfig } from "@/lib/modalities";

const descriptions: Record<string, string> = {
  rgb: "Classify minerals using RGB color imagery from high-resolution cameras",
  microscopic: "Analyze grain structure and texture through microscopic imaging",
  infrared: "Detect mineral composition via infrared spectral absorption patterns",
  acoustic: "Identify minerals through acoustic resonance frequency analysis",
  capacitive: "Measure dielectric properties using capacitive sensor arrays",
};

export function ModalityCard({ modality }: { modality: ModalityConfig }) {
  const desc = descriptions[modality.key] ?? "Classify using sensor data";

  return (
    <Link
      href={`/results/${modality.key}`}
      id={`modality-card-${modality.key}`}
      className="group flex flex-col justify-center rounded-sm border border-line/60 bg-base-850 p-4 lg:p-5 transition-all duration-300 hover:border-line hover:bg-base-800 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold text-ink-100 transition-colors group-hover:text-ink-100">
          {modality.label}
        </div>
      </div>
      <div className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
        {desc}
      </div>
    </Link>
  );
}
