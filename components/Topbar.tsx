export function Topbar({
  title = "OreVision",
  subtitle = "Multimodal ore characterization",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-line/80 px-8">
      <div>
        <p className="text-[15px] font-semibold leading-tight text-ink-100">{title}</p>
        <p className="text-xs leading-tight text-ink-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-base-850 px-3 py-1.5 text-xs text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(0,230,118,0.6)]" />
          Edge network online
        </span>
      </div>
    </header>
  );
}
