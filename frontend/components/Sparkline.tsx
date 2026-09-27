export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const max = Math.max(...values, 0.001);
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {values.map((v, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm bg-gradient-to-t from-green-600/70 to-green-400/80"
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
