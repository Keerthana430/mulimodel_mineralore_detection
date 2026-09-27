import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ModalityCard } from "@/components/ModalityCard";
import { Icon } from "@/components/Icon";
import { modalities } from "@/lib/modalities";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-[76px]">
        <main className="mx-auto max-w-7xl px-8 py-8 space-y-8">
          {/* Hero / Workspace Row */}
          <div className="w-full">
            {/* Mineral Classification */}
            <section className="card flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded bg-base-850 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-300 border border-line/60">
                    <Icon name="layers" className="h-3.5 w-3.5 text-green-400" />
                    Fused Multimodal Launcher
                  </span>
                </div>
                <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink-100">
                  MINERAL CLASSIFICATION
                </h1>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Analyze mineral ore using five sensing modalities and generate a final classification.
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Link
                  href="/results/classification"
                  className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-xs font-semibold text-base-950 transition-colors hover:bg-green-400"
                >
                  <Icon name="bolt" className="h-3.5 w-3.5" />
                  Run Full Classification
                  <Icon name="chevron" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          </div>

          {/* Classification Methods Section */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                CLASSIFICATION METHODS
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modalities.map((m) => (
                <ModalityCard key={m.key} modality={m} />
              ))}
            </div>
          </section>

          {/* Analysis Pipeline Section */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                ANALYSIS PIPELINE
              </h2>
            </div>
            <div className="card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {[
                  { step: "01", name: "Hardware", desc: "Edge Device Rig" },
                  { step: "02", name: "Sensors", desc: "5 Active Channels" },
                  { step: "03", name: "Cloud", desc: "Stream Processing" },
                  { step: "04", name: "AI Models", desc: "Inference Engine" },
                  { step: "05", name: "Classification", desc: "Fused Vote Decision" },
                  { step: "06", name: "Result", desc: "Mineral Report" },
                ].map((stage, idx, arr) => (
                  <div key={stage.step} className="flex flex-1 items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                      <div>
                        <div className="text-xs font-semibold text-ink-100">{stage.name}</div>
                        <div className="text-[10px] font-mono text-ink-500">{stage.desc}</div>
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="hidden flex-1 md:block">
                        <div className="h-px w-full bg-line/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* System Overview Section */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                SYSTEM OVERVIEW
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="card p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  Modalities
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-ink-100">
                  {modalities.length}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">Sensing channels</div>
              </div>
              <div className="card p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  Deployed Models
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-ink-100">
                  {modalities.length}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">Deployed endpoints</div>
              </div>
              <div className="card p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  Network Status
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-green-400">
                  Online
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">Edge network connected</div>
              </div>
              <div className="card p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  Decision Logic
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-ink-100">
                  Fused Vote
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">Consensus classification</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
