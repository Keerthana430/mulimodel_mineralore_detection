export function MetricCard({
  label,
  value,
  suffix,
  accent = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="card px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className={`mt-1.5 font-mono text-xl font-semibold ${accent ? "text-green-400" : "text-ink-100"}`}>
        {value}
        {suffix && <span className="ml-1 text-xs text-ink-500">{suffix}</span>}
      </p>
    </div>
  );
}
