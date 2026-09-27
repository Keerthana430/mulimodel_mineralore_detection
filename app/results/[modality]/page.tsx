"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Icon } from "@/components/Icon";
import { MetricCard } from "@/components/MetricCard";
import { ProbabilityBars } from "@/components/ProbabilityBars";
import { TrendChart } from "@/components/TrendChart";
import { getModality, ModalityKey } from "@/lib/modalities";
import { runModality, runComposite, ModalityResult, CompositeResult } from "@/lib/api";

type ErrorKind = "no-endpoint" | "fetch-error";

interface AppError {
  kind: ErrorKind;
  message: string;
}

export default function ResultsPage() {
  const params = useParams<{ modality: string }>();
  const key = params.modality as ModalityKey | "classification";
  const config = getModality(key);

  const [loading, setLoading] = useState(true);
  const [single, setSingle] = useState<ModalityResult | null>(null);
  const [composite, setComposite] = useState<CompositeResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    setLoading(true);
    setSingle(null);
    setComposite(null);
    setError(null);

    if (key === "classification") {
      runComposite()
        .then((res) => {
          setComposite(res);
          setLoading(false);
        })
        .catch((err: unknown) => {
          setError(classifyError(err));
          setLoading(false);
        });
    } else {
      runModality(key as ModalityKey)
        .then((res) => {
          setSingle(res);
          setLoading(false);
        })
        .catch((err: unknown) => {
          setError(classifyError(err));
          setLoading(false);
        });
    }
  }, [key]);

  const active =
    single ??
    (composite
      ? composite.results.find((r) => r.modality === composite.winner) ?? null
      : null);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-[72px]">

        <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-100 transition-colors"
          >
            <Icon name="back" className="h-3.5 w-3.5" />
            Back to overview
          </Link>

          {/* Loading */}
          {loading && (
            <div className="card flex h-48 items-center justify-center">
              <div className="flex items-center gap-3 text-xs text-ink-300">
                <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-green-400" />
                Running inference
                {key === "classification" ? " across all modalities" : ""}…
              </div>
            </div>
          )}

          {/* Empty / error state */}
          {!loading && !active && (
            <div className="card flex h-52 flex-col items-center justify-center gap-2.5 text-center p-6">
              <Icon name="target" className="h-7 w-7 text-ink-600" />
              {error?.kind === "no-endpoint" ? (
                <>
                  <p className="text-xs font-semibold text-ink-300">
                    Waiting for sensor data
                  </p>
                  <p className="max-w-sm text-xs text-ink-500">
                    No endpoint is configured for this modality. Set{" "}
                    <code className="rounded bg-base-850 border border-line/60 px-1 py-0.5 font-mono text-[11px] text-ink-300">
                      NEXT_PUBLIC_{(key as string).toUpperCase()}_ENDPOINT
                    </code>{" "}
                    in your environment to enable live inference.
                  </p>
                </>
              ) : error?.kind === "fetch-error" ? (
                <>
                  <p className="text-xs font-semibold text-red-400">
                    Sensor endpoint returned an error
                  </p>
                  <p className="max-w-sm text-xs text-ink-500">{error.message}</p>
                </>
              ) : (
                <p className="text-xs text-ink-400">No data available.</p>
              )}
            </div>
          )}

          {/* Results */}
          {!loading && active && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Left: analyzed graphs */}
              <div className="space-y-4 lg:col-span-1">
                <section className="card p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Class probabilities
                  </h3>
                  <ProbabilityBars data={active.probabilities} />
                </section>
                <section className="card p-4">
                  <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Confidence trend
                  </h3>
                  <TrendChart values={active.trend} />
                </section>
                {composite && (
                  <section className="card p-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Modality comparison
                    </h3>
                    <div className="space-y-2.5">
                      {composite.results
                        .slice()
                        .sort((a, b) => b.confidence - a.confidence)
                        .map((r) => (
                          <div
                            key={r.modality}
                            className="flex items-center justify-between text-xs"
                          >
                            <span
                              className={`capitalize ${
                                r.modality === composite.winner
                                  ? "font-medium text-green-400"
                                  : "text-ink-300"
                              }`}
                            >
                              {r.modality}
                              {r.modality === composite.winner && " · best"}
                            </span>
                            <span className="font-mono text-ink-500 text-[11px]">
                              {(r.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right: metric values */}
              <div className="space-y-4 lg:col-span-2">
                <section className="card p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                    Predicted mineral
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-green-400 font-mono">
                    {active.predictedClass}
                  </h2>
                  <p className="mt-1.5 text-xs text-ink-500">
                    Confidence{" "}
                    <span className="font-mono text-ink-100">
                      {(active.confidence * 100).toFixed(1)}%
                    </span>{" "}
                    · Latency{" "}
                    <span className="font-mono text-ink-100">{active.latencyMs}ms</span>
                    {composite && (
                      <>
                        {" "}
                        · Winning modality{" "}
                        <span className="font-mono capitalize text-green-400">
                          {composite.winner}
                        </span>
                      </>
                    )}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                  <MetricCard
                    label="Accuracy"
                    value={(active.accuracy * 100).toFixed(1)}
                    suffix="%"
                    accent
                  />
                  <MetricCard
                    label="Precision"
                    value={(active.precision * 100).toFixed(1)}
                    suffix="%"
                  />
                  <MetricCard
                    label="Recall"
                    value={(active.recall * 100).toFixed(1)}
                    suffix="%"
                  />
                  <MetricCard
                    label="F1 score"
                    value={(active.f1 * 100).toFixed(1)}
                    suffix="%"
                  />
                </div>

                {composite && (
                  <section className="card p-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Per-modality breakdown
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-line/60 text-ink-500">
                            <th className="pb-2 font-normal">Modality</th>
                            <th className="pb-2 font-normal">Prediction</th>
                            <th className="pb-2 font-normal">Confidence</th>
                            <th className="pb-2 font-normal">Accuracy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/40">
                          {composite.results.map((r) => (
                            <tr key={r.modality}>
                              <td className="py-2.5 capitalize text-ink-300">
                                {r.modality}
                              </td>
                              <td className="py-2.5 font-medium text-ink-100">{r.predictedClass}</td>
                              <td className="py-2.5 font-mono text-ink-100">
                                {(r.confidence * 100).toFixed(1)}%
                              </td>
                              <td className="py-2.5 font-mono text-ink-500">
                                {(r.accuracy * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/** Map a thrown value to a typed AppError. */
function classifyError(err: unknown): AppError {
  if (err instanceof Error) {
    if (err.name === "NoEndpointError") {
      return { kind: "no-endpoint", message: err.message };
    }
    return { kind: "fetch-error", message: err.message };
  }
  return { kind: "fetch-error", message: String(err) };
}
