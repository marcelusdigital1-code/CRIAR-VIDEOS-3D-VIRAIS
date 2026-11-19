import type { ToonSpec } from "../engine/draw";

export const C: Record<string, ToonSpec> = {
  // Roman merchant — earthy red cloak, sandals feel, grey hair
  merchant: { hat: "none", coat: "#8b2a1a", vest: "#c9a46a", hair: "#8a7a68", scarf: "#d4b87a", height: 1.0 },
  // Roman soldier — crested helmet (use "helmet"), deep red cloak, brass
  soldier1: { hat: "helmet", hatColor: "#8a3a1a", band: "#d4a020", coat: "#8b1a1a", vest: "#c0a030", hair: "#3a2a1e", moustache: true },
  soldier2: { hat: "helmet", hatColor: "#7a2a12", band: "#c8961e", coat: "#7a1a1a", vest: "#b89020", hair: "#2a1e14", beard: true },
  // King / ruler — crown-like top hat, purple robe, pompous
  king: { hat: "top", hatColor: "#4a1a6a", band: "#d4a020", coat: "#6a1a8a", vest: "#e0c050", hair: "#c8b87a", whiskers: true, glasses: false, height: 1.03 },
  // Tax collector — bowler, dark coat, ledger in hand
  taxman: { hat: "bowler", hatColor: "#1c1c1c", coat: "#2a2a3a", vest: "#6a3a1a", hair: "#2a1e14", moustache: true },
  // Smuggler — flatcap, rough dark coat, shifty
  smuggler: { hat: "flatcap", hatColor: "#3a3028", coat: "#2e3a2a", vest: "#6a5a3a", hair: "#4a3828", scarf: "#5a3a2a" },
  // French revolutionary — no hat (or flatcap), sash, animated
  rebel: { hat: "flatcap", hatColor: "#1a3a6a", coat: "#2a4a8a", vest: "#c8302a", scarf: "#f0f0e0", hair: "#4a3010" },
  // Modern person in kitchen — casual, contemporary
  modern: { hat: "none", coat: "#4a7ab0", vest: "#e8e4d8", hair: "#3a2a1e", height: 0.98 },
  // Desert guide with sack of salt — wide brim, linen
  guide: { hat: "flatcap", hatColor: "#c8b878", coat: "#c8a858", vest: "#e8d8a8", hair: "#2a1e14", scarf: "#e0c878", height: 1.0 },
};
