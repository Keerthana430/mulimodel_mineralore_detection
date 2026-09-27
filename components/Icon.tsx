import {
  LayoutGrid,
  Camera,
  Microscope,
  Waves,
  Radio,
  CircuitBoard,
  Zap,
  Upload,
  UploadCloud,
  Bell,
  Layers,
  Crosshair,
  ChevronRight,
  ChevronLeft,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

export type IconName =
  | "grid"
  | "camera"
  | "microscope"
  | "waveInfrared"
  | "waveAcoustic"
  | "capacitive"
  | "bolt"
  | "upload"
  | "cloudUpload"
  | "bell"
  | "layers"
  | "target"
  | "chevron"
  | "back"
  | "logo";

function RockIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M9 3 L17 4 L21 12 L15 21 L6 19 L3 10 Z" />
      <path d="M9 3 L11 11 L17 4 M11 11 L21 12 M11 11 L15 21 M11 11 L6 19 M11 11 L3 10" strokeOpacity="0.5" />
    </svg>
  );
}

const ICON_MAP: Record<IconName, FC<LucideProps>> = {
  grid: LayoutGrid,
  camera: Camera,
  microscope: Microscope,
  waveInfrared: Waves,
  waveAcoustic: Radio,
  capacitive: CircuitBoard,
  bolt: Zap,
  upload: Upload,
  cloudUpload: UploadCloud,
  bell: Bell,
  layers: Layers,
  target: Crosshair,
  chevron: ChevronRight,
  back: ChevronLeft,
  logo: RockIcon,
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
