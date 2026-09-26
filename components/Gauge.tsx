export function Gauge({
  value,
  label,
  sublabel,
}: {
  value: number; // 0-100
  label: string;
  sublabel?: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#18281d"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#00e676"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 800ms ease-out" }}
          />
        </svg>
        <span className="absolute font-mono text-xs font-semibold text-ink-100">
          {Math.round(clamped)}%
        </span>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-100 capitalize">{label}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
        </div>
        {sublabel && (
          <span className="mt-0.5 text-[11px] text-ink-500 font-mono">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
