import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ModalityCard } from "@/components/ModalityCard";
import { SystemStatus } from "@/components/SystemStatus";
import { modalities } from "@/lib/modalities";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      <Sidebar />
      <div className="flex-1 pl-[72px] h-full overflow-hidden">
        <main className="mx-auto flex h-full max-w-[1300px] flex-col justify-center px-6 py-4 lg:px-8 lg:py-6">
          
          <SystemStatus />

          {/* Hero — Full Classification Launcher */}
          <section
            id="hero-launcher"
            className="card relative overflow-hidden p-6 sm:p-8 mb-8 shrink-0"
          >
            {/* Animated Background Blob */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-500/10 blur-[80px] animate-blob" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-sm bg-base-850 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-300 border border-line/60">
                  Fused Multimodal
                </span>
                <span className="inline-flex items-center rounded-sm bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-400 border border-green-500/20">
                  Ready
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-ink-100">
                Mineral Classification
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-500">
                Run inference across all five sensing modalities simultaneously
                and generate a consensus-based mineral classification report.
              </p>

              <div className="mt-6">
                <Link
                  href="/results/classification"
                  id="btn-run-classification"
                  className="inline-block rounded-md bg-green-500 px-6 py-2.5 text-xs font-semibold text-base-950 transition-colors hover:bg-green-400 active:bg-green-600 shadow-sm"
                >
                  Run Full Classification
                </Link>
              </div>
            </div>
          </section>

          {/* Classification Methods */}
          <section className="mb-8 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Specific Modality Detection
              </h2>
              <span className="text-[10px] font-mono text-ink-700">
                {modalities.length} modalities
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
              {modalities.map((m) => (
                <ModalityCard key={m.key} modality={m} />
              ))}
            </div>
          </section>

          {/* Control Flow Pipeline */}
          <section className="shrink-0">
            <div className="mb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Control Flow Pipeline
              </h2>
            </div>
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {[
                  {
                    step: "01",
                    name: "Command Init",
                    desc: "Request user goes to Pi controller",
                  },
                  {
                    step: "02",
                    name: "Acquisition",
                    desc: "Pi captures the data",
                  },
                  {
                    step: "03",
                    name: "Processing",
                    desc: "Basic preprocessing",
                  },
                  {
                    step: "04",
                    name: "Transmission",
                    desc: "Give to cloud",
                  },
                  {
                    step: "05",
                    name: "Inference",
                    desc: "Cloud detects the answer",
                  },
                  {
                    step: "06",
                    name: "Output",
                    desc: "Display and visualization",
                  },
                ].map((stage, idx, arr) => (
                  <div
                    key={stage.step}
                    className="flex flex-1 flex-col relative"
                  >
                    <div className="flex items-center mb-3 w-full">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-base-800 text-[10px] font-mono font-bold text-ink-300 border border-line/60 z-10 transition-colors hover:bg-base-700 hover:text-green-400">
                        {stage.step}
                      </span>
                      {idx < arr.length - 1 && (
                        <div className="hidden lg:block h-[1px] w-full bg-line/80 mx-3 relative overflow-hidden">
                          <div
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60 animate-data-flow"
                            style={{ animationDelay: `${idx * 0.4}s` }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-ink-100 mb-1">
                        {stage.name}
                      </div>
                      <div className="text-[10px] text-ink-500 leading-relaxed pr-2">
                        {stage.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
