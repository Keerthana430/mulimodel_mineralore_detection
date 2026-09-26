import { ModalityKey, modalities } from "./modalities";

export interface ClassProbability {
  label: string;
  probability: number;
}

export interface ModalityResult {
  modality: ModalityKey;
  predictedClass: string;
  confidence: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  probabilities: ClassProbability[];
  trend: number[];
  latencyMs: number;
}

export interface CompositeResult {
  winner: ModalityKey;
  results: ModalityResult[];
}

/**
 * Returns the base URL for the FastAPI backend.
 * Defaults to http://localhost:8000 when NEXT_PUBLIC_BACKEND_URL is not set.
 */
function getBackendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ??
    "http://localhost:8000"
  );
}

/**
 * Throws `NoEndpointError` when the backend is unreachable.
 * Throws a plain `Error` when the backend returns a non-OK response.
 */
export class NoEndpointError extends Error {
  constructor(public readonly modalityKey: ModalityKey | "classification") {
    super(
      `Backend is unreachable or returned an error for modality "${modalityKey}". ` +
        `Ensure the FastAPI backend is running at ${getBackendUrl()}.`
    );
    this.name = "NoEndpointError";
  }
}

export async function runModality(key: ModalityKey): Promise<ModalityResult> {
  const url = `${getBackendUrl()}/api/classify/${key}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new NoEndpointError(key);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 404 || res.status === 503) {
      throw new NoEndpointError(key);
    }
    throw new Error(
      `${key} classification returned HTTP ${res.status}: ${body}`
    );
  }

  return normalizeBackendPayload(key, await res.json());
}

export async function runComposite(): Promise<CompositeResult> {
  const url = `${getBackendUrl()}/api/classify/full`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new NoEndpointError("classification");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 404 || res.status === 503) {
      throw new NoEndpointError("classification");
    }
    throw new Error(`Full classification returned HTTP ${res.status}: ${body}`);
  }

  const data = await res.json();

  return {
    winner: data.winner as ModalityKey,
    results: (data.results ?? []).map((r: Record<string, unknown>) =>
      normalizeBackendPayload(r.modality as ModalityKey, r)
    ),
  };
}

/** Normalize the backend's snake_case JSON into the frontend's camelCase shape. */
function normalizeBackendPayload(
  key: ModalityKey,
  payload: Record<string, unknown>
): ModalityResult {
  return {
    modality: key,
    predictedClass:
      (payload.predicted_class as string) ??
      (payload.label as string) ??
      "Unknown",
    confidence: Number(payload.confidence ?? 0),
    accuracy: Number(payload.accuracy ?? 0),
    precision: Number(payload.precision ?? 0),
    recall: Number(payload.recall ?? 0),
    f1: Number(payload.f1 ?? payload.f1_score ?? 0),
    probabilities: (payload.probabilities as ClassProbability[]) ?? [],
    trend: (payload.trend as number[]) ?? [],
    latencyMs: Number(payload.latency_ms ?? 0),
  };
}
