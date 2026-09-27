import type { ClassProbability } from "@/lib/api";

export function ProbabilityBars({ data }: { data: ClassProbability[] }) {
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-300">{d.label}</span>
            <span className="font-mono text-ink-500">{(d.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-800">
            <div
              className={`h-full rounded-full ${i === 0 ? "bg-brand-gradient" : "bg-base-600"}`}
              style={{ width: `${Math.max(2, d.probability * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
