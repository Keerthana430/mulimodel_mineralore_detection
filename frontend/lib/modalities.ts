import type { IconName } from "@/components/Icon";

export type ModalityKey =
  | "classification"
  | "rgb"
  | "microscopic"
  | "infrared"
  | "acoustic"
  | "capacitive";

export interface ModalityConfig {
  key: ModalityKey;
  label: string;
  short: string;
  icon: IconName;
  backbone: string;
  accent: "green";
}

export const modalities: ModalityConfig[] = [
  { key: "rgb", label: "RGB Vision", short: "RGB", icon: "camera", backbone: "ConvNeXtSmall", accent: "green" },
  { key: "microscopic", label: "Microscopic", short: "Microscopic", icon: "microscope", backbone: "EfficientNetB7", accent: "green" },
  { key: "infrared", label: "Infrared Spectral", short: "Infrared", icon: "waveInfrared", backbone: "1D-CNN", accent: "green" },
  { key: "acoustic", label: "Acoustic Resonance", short: "Acoustic", icon: "waveAcoustic", backbone: "ResNet1D", accent: "green" },
  { key: "capacitive", label: "Capacitive Sensing", short: "Capacitive", icon: "capacitive", backbone: "GBM Ensemble", accent: "green" },
];

export function getModality(key: string): ModalityConfig | undefined {
  if (key === "classification") {
    return {
      key: "classification",
      label: "Mineral Classification",
      short: "Full Run",
      icon: "target",
      backbone: "Fused Vote",
      accent: "green",
    };
  }
  return modalities.find((m) => m.key === key);
}

export const accentMap: Record<string, { text: string; ring: string; glow: string; bar: string }> = {
  green: { text: "text-green-400", ring: "ring-green-500/40", glow: "shadow-glow", bar: "bg-green-500" },
};
