import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OreVision — Multimodal Ore Characterization",
  description: "Non-destructive, IoT edge-to-cloud mineral classification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
