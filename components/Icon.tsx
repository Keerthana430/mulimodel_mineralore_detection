import {
  LayoutGrid,
  Camera,
  Microscope,
  Activity,
  AudioWaveform,
  Zap,
  Upload,
  UploadCloud,
  Bell,
  Layers,
  Target,
  ChevronRight,
  ChevronLeft,
  Gem,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

export type IconName =
  | "grid"
  | "camera"
  | "microscope"
  | "waveInfrared"
  | "waveAcoustic"
  | "bolt"
  | "upload"
  | "cloudUpload"
  | "bell"
  | "layers"
  | "target"
  | "chevron"
  | "back"
  | "logo";

const ICON_MAP: Record<IconName, FC<LucideProps>> = {
  grid: LayoutGrid,
  camera: Camera,
  microscope: Microscope,
  waveInfrared: Activity,
  waveAcoustic: AudioWaveform,
  bolt: Zap,
  upload: Upload,
  cloudUpload: UploadCloud,
  bell: Bell,
  layers: Layers,
  target: Target,
  chevron: ChevronRight,
  back: ChevronLeft,
  logo: Gem,
};

export function Icon({
  name,
  className = "w-5 h-5",
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const LucideIcon = ICON_MAP[name];
  return <LucideIcon className={className} strokeWidth={strokeWidth} />;
}
