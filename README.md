# OreVision — Multimodal Ore Characterization

Next.js 14 (App Router, TypeScript, Tailwind) frontend.

## Run
```
npm install
npm run dev
```

## Structure
- `app/page.tsx` — overview dashboard: icon nav rail, upload button,
  "Run full classification" launcher, model readiness gauge, and a
  button-style card grid for RGB / Microscopic / Infrared / Acoustic /
  Capacitive (no description paragraphs — icon, name, backbone tag only).
- `app/results/[modality]/page.tsx` — shared results screen for both a
  single modality and the fused "classification" run. Left column holds
  the analyzed graphs (class probabilities, confidence trend, and, for
  the full run, a modality comparison list). Right/center holds the
  analyzed values (predicted mineral, confidence, accuracy/precision/
  recall/F1, and a per-modality breakdown table for the full run).
- `lib/api.ts` — one place to wire real inference. Drop your Hugging
  Face Space / Inference Endpoint URLs into `.env.local` (see
  `.env.example`) and `runModality()` will call them instead of the
  seeded mock data. Edit `normalizeBackendPayload()` once your response
  JSON shape is finalized.
- `lib/modalities.ts` — single source of truth for the 5 modalities
  (icon, label, backbone, accent color) used by the sidebar, homepage
  cards and results page.

## Design tokens
Dark navy base (`#07080f` / `#0b0e1a`) with a violet → magenta → cyan
brand gradient (`tailwind.config.ts` → `colors`, `boxShadow.glow*`,
`backgroundImage.brand-gradient*`) — unchanged from the previous pass,
just applied to the new icon-rail + card-grid layout.

## Upload
The upload button (sidebar + hero card) stores the selected image as a
data URL in `sessionStorage`. Whichever "Run" button you press next
reads it and sends it along to that modality's endpoint (or the mock).
