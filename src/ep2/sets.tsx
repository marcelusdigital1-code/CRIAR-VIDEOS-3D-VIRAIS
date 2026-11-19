// Episode 2 sets: ancient Rome street + desert salt road + modern kitchen + throne room + market.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, Ground, House, Lamp, Roof, Window, Sign, Fire } from "../engine/kit";
import { sky, cobbles, painted, planks, bricks, rng, shade } from "../engine/tex";
import type { Look, V3 } from "../engine/Stage";

// ── Lighting presets ────────────────────────────────────────────────────────

// Hot midday desert sun — bleached highlights, cool-purple shadows
export const desertLook = (): Look => ({
  sky: sky("#4a8ad6", "#7ab4f0", "#d4e8ff", "#ffffff"),
  fog: "#c8d8f0", fogNear: 40, fogFar: 180,
  sun: { pos: [4, 28, 10], color: "#fff4d0", intensity: 4.2, shadow: 32 },
  hemi: { sky: "#b8d0ff", ground: "#8a6a3a", intensity: 0.9 },
  ambient: 0.08, exposure: 1.1, aperture: 0.38, warm: "#ffb870", cool: "#4a3fc8", vignette: 0.42, saturation: 1.22,
});

// Roman city — afternoon warm light
export const romanLook = (): Look => ({
  sky: sky("#3a7ad0", "#78a8e8", "#c8dcff", "#ffffff"),
  fog: "#b8c8e8", fogNear: 30, fogFar: 160,
  sun: { pos: [14, 18, 10], color: "#ffd090", intensity: 3.6, shadow: 28 },
  hemi: { sky: "#a0beff", ground: "#7a4a7a", intensity: 1.0 },
  ambient: 0.1, exposure: 1.05, aperture: 0.4, warm: "#ffaa60", cool: "#5a3fc0", vignette: 0.44, saturation: 1.2,
});

// Throne room — dramatic, dim, cool
export const throneLook = (): Look => ({
  fog: "#1a1228", fogNear: 12, fogFar: 50,
  sun: { pos: [0, 18, 6], color: "#ffd090", intensity: 1.8, shadow: 14 },
  hemi: { sky: "#6a60c0", ground: "#2a1a38", intensity: 0.7 },
  ambient: 0.08, exposure: 1.4, aperture: 0.5, warm: "#ffa040", cool: "#4a3aaa", vignette: 0.72, saturation: 1.1,
});

// Night smuggling — deep blue, lantern glow
export const smugglerLook = (): Look => ({
  sky: sky("#0d1640", "#1a2a6a", "#3a4a8a", "#0d1030", true),
  fog: "#10183a", fogNear: 10, fogFar: 60,
  sun: { pos: [-10, 16, 12], color: "#a0b0ff", intensity: 1.2, shadow: 20 },
  hemi: { sky: "#5060b0", ground: "#3a2060", intensity: 0.6 },
  ambient: 0.06, exposure: 1.3, aperture: 0.5, warm: "#ffa040", cool: "#4a30c0", vignette: 0.80, saturation: 1.1,
});

// Modern kitchen — bright, neutral
export const kitchenLook = (): Look => ({
  fog: "#e8e8f0", fogNear: 8, fogFar: 30,
  sun: { pos: [6, 12, 8], color: "#fff8f0", intensity: 2.8, shadow: 10 },
  hemi: { sky: "#dce8ff", ground: "#a8a8b8", intensity: 1.1 },
  ambient: 0.18, exposure: 1.0, aperture: 0.35, warm: "#ffe8c0", cool: "#6060a0", vignette: 0.30, saturation: 1.1,
});

// French revolution — late afternoon, smoky
export const frenchLook = (): Look => ({
  sky: sky("#c06030", "#e08048", "#f0c888", "#ffffff"),
  fog: "#c89060", fogNear: 20, fogFar: 100,
  sun: { pos: [-8, 14, 10], color: "#ffb060", intensity: 3.0, shadow: 24 },
  hemi: { sky: "#f0a060", ground: "#6a2a1a", intensity: 0.9 },
  ambient: 0.1, exposure: 1.15, aperture: 0.42, warm: "#ffaa50", cool: "#6030a0", vignette: 0.55, saturation: 1.28,
});

// ── Sets ─────────────────────────────────────────────────────────────────────

// A Roman market street: stone pillars, terracotta stalls, amphorae
export const RomanStreet: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const stoneTex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const g = c.getContext("2d")!; const r = rng(42);
    g.fillStyle = "#d4c8a8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 800; i++) { g.fillStyle = `rgba(${80 + r() * 60},${70 + r() * 50},${50 + r() * 40},${0.08 + r() * 0.08})`; g.beginPath(); g.arc(r() * 512, r() * 512, 1 + r() * 8, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); return t;
  }, []);
  const groundTex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const g = c.getContext("2d")!; const r = rng(7);
    g.fillStyle = "#b8a888"; g.fillRect(0, 0, 512, 512);
    // cobblestone-ish blocks
    g.strokeStyle = "rgba(80,60,30,0.4)"; g.lineWidth = 4;
    for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
      const x = col * 64 + r() * 10, y = row * 64 + r() * 10, w = 55 + r() * 10, h = 55 + r() * 10;
      g.fillStyle = shade("#b8a080", 0.9 + r() * 0.2); g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10); return t;
  }, []);

  return (
    <group>
      <Ground map={groundTex} size={200} />
      {/* pillared portico on north side */}
      {[-12, -6, 0, 6, 12, 18].map((x) => (
        <group key={"p" + x} position={[x, 0, -10]}>
          <Cyl r={0.4} h={5.5} pos={[0, 2.75, 0]} color="#d4c8a8" />
          <Box size={[1.0, 0.4, 1.0]} pos={[0, 5.5, 0]} color="#c8bc9c" />
          <Box size={[1.2, 0.3, 1.2]} pos={[0, 0.15, 0]} color="#c0b490" />
        </group>
      ))}
      {/* entablature */}
      <Box size={[36, 0.6, 1.0]} pos={[3, 5.7, -10]} color="#c8bc9c" />
      <Box size={[36, 2.0, 0.5]} pos={[3, 7.0, -10.1]} map={stoneTex} />
      {/* terracotta stalls */}
      {[[-8, 10], [0, 11], [10, 10.5], [18, 10]].map(([x, z], i) => (
        <group key={"stall" + i} position={[x, 0, z]}>
          <Box size={[2.6, 1.0, 1.4]} pos={[0, 0.5, 0]} color={["#c8683a", "#b85a30", "#d07040", "#c06030"][i]} />
          <Box size={[2.8, 0.1, 1.6]} pos={[0, 1.06, 0]} color="#8a4a20" />
          {/* awning */}
          <Box size={[2.9, 0.08, 1.4]} pos={[0, 2.1, -0.3]} color={["#c03a1a", "#2a5a8a", "#c8a020", "#3a7a3a"][i]} />
          <Box size={[0.08, 1.1, 0.08]} pos={[-1.3, 1.55, 0.6]} color="#6a3a1a" />
          <Box size={[0.08, 1.1, 0.08]} pos={[1.3, 1.55, 0.6]} color="#6a3a1a" />
        </group>
      ))}
      {/* amphorae (salt jars) */}
      {[[-7, 9.8], [-8.6, 9.5], [1, 10.6], [-0.5, 10.3], [11, 9.5]].map(([x, z], i) => (
        <group key={"amp" + i} position={[x, 0, z]}>
          <Cyl r={0.22} r2={0.08} h={0.8} pos={[0, 0.4, 0]} color={["#b8784a", "#c88060", "#a86840", "#c07050", "#b06838"][i % 5]} />
          <Cyl r={0.26} r2={0.22} h={0.12} pos={[0, 0.82, 0]} color="#8a4a28" />
        </group>
      ))}
      {/* Sign: SALT */}
      <Sign lines={["SAL"]} pos={[-8.3, 2.5, 9.0]} w={1.8} h={0.6} bg="#c8903a" fg="#f4f0e0" />
      {children}
    </group>
  );
};

// Desert road: dunes, rocky cliffs, camels in distance, merchant caravan
export const DesertRoad: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const sandTex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const g = c.getContext("2d")!; const r = rng(21);
    g.fillStyle = "#d8c090"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2000; i++) { g.fillStyle = `rgba(${160 + r() * 60},${120 + r() * 50},${60 + r() * 30},${0.06 + r() * 0.1})`; g.beginPath(); g.arc(r() * 512, r() * 512, 0.5 + r() * 4, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(8, 8); return t;
  }, []);

  return (
    <group>
      <Ground map={sandTex} size={300} />
      {/* dunes */}
      {[[-20, -20], [15, -18], [-5, -30], [25, -25], [-30, -15]].map(([x, z], i) => (
        <Cyl key={"dune" + i} r={8 + i * 2} r2={0} h={3 + i * 0.8} seg={12} pos={[x, -0.5, z]} color={["#d0b880", "#c8b070", "#d8c090", "#c0a860", "#ccc080"][i]} />
      ))}
      {/* rocky cliffs on the left */}
      {[0, 1, 2, 3].map((i) => (
        <Box key={"cliff" + i} size={[4 + i, 6 + i * 2, 3]} pos={[-18 + i * 1.5, 3 + i, -8 - i]} color={["#9a7850", "#8a6840", "#b08860", "#907050"][i]} />
      ))}
      {/* road track (packed earth) */}
      <Box size={[200, 0.04, 4]} pos={[0, 0.02, 1]} color="#b8a068" />
      {/* distance mountain silhouette */}
      {[-30, -15, 0, 15, 30, 45].map((x, i) => (
        <Cyl key={"mt" + i} r={10 + i * 2} r2={0} h={18 + i * 3} seg={8} pos={[x, -8, -60 - i * 4]} color="#8a7050" />
      ))}
      {children}
    </group>
  );
};

// Throne room: imposing pillars, dark stone, a throne on a dais
export const ThroneRoom: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const stoneTex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512;
    const g = c.getContext("2d")!; const r = rng(55);
    g.fillStyle = "#2a2228"; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = "rgba(60,50,70,0.5)"; g.lineWidth = 3;
    for (let row = 0; row < 6; row++) for (let col = 0; col < 4; col++) {
      const x = col * 128 + (row % 2 ? 64 : 0), y = row * 85;
      g.fillStyle = shade("#2e2434", 0.85 + r() * 0.3); g.fillRect(x, y, 128, 85); g.strokeRect(x, y, 128, 85);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3); return t;
  }, []);

  return (
    <group>
      <Ground map={planks("#3a2820", [5, 5])} size={60} />
      {/* walls */}
      <Box size={[30, 10, 0.4]} pos={[0, 5, -12]} map={stoneTex} />
      <Box size={[0.4, 10, 24]} pos={[-14, 5, 0]} map={stoneTex} />
      <Box size={[0.4, 10, 24]} pos={[14, 5, 0]} map={stoneTex} />
      <Box size={[30, 0.5, 24]} pos={[0, 10.3, 0]} color="#1e1820" />
      {/* pillars */}
      {[-10, -4, 4, 10].map((x) => (
        <group key={"thrp" + x}>
          <Cyl r={0.55} h={9.5} pos={[x, 4.75, -8]} color="#2a2030" />
          <Box size={[1.3, 0.5, 1.3]} pos={[x, 9.75, -8]} color="#221828" />
          <Box size={[1.3, 0.3, 1.3]} pos={[x, 0.15, -8]} color="#221828" />
        </group>
      ))}
      {/* throne dais */}
      <Box size={[6, 0.5, 4]} pos={[0, 0.25, -9]} color="#3a2838" />
      <Box size={[4, 0.4, 3]} pos={[0, 0.7, -9.2]} color="#4a2a40" />
      {/* throne chair */}
      <Box size={[2.2, 2.6, 0.4]} pos={[0, 2.1, -10.8]} color="#3a1a30" />
      <Box size={[2.2, 0.4, 1.6]} pos={[0, 0.9, -10.1]} color="#3a1a30" />
      {[-1, 1].map((x) => <Box key={"arm" + x} size={[0.3, 0.6, 1.4]} pos={[x, 1.4, -10.2]} color="#3a1a30" />)}
      {/* gold trim on throne */}
      <Box size={[2.3, 0.1, 0.1]} pos={[0, 3.4, -10.6]} color="#c8a020" />
      {[-1, 1].map((x) => <Box key={"gold" + x} size={[0.1, 2.6, 0.1]} pos={[x * 1.1, 2.1, -10.6]} color="#c8a020" />)}
      {/* torches */}
      {[-11, 11].map((x) => (
        <group key={"torch" + x} position={[x, 4.5, -8.5]}>
          <Box size={[0.18, 1.0, 0.18]} pos={[0, -0.5, 0]} color="#6a3a1a" />
          <Fire pos={[0, 0.1, 0]} scale={0.5} light={12} />
        </group>
      ))}
      {children}
    </group>
  );
};

// Modern kitchen: clean white/grey counters, cabinets, salt shaker
export const Kitchen: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Ground map={painted("#e0e0e8", [4, 4], 300)} size={40} />
    {/* back wall */}
    <Box size={[20, 7, 0.3]} pos={[0, 3.5, -6]} color="#f0f0f4" />
    {/* side walls */}
    <Box size={[0.3, 7, 12]} pos={[-9, 3.5, 0]} color="#ebebef" />
    <Box size={[0.3, 7, 12]} pos={[9, 3.5, 0]} color="#ebebef" />
    {/* ceiling */}
    <Box size={[20, 0.3, 12]} pos={[0, 7.15, 0]} color="#f4f4f8" />
    {/* counter left */}
    <Box size={[7, 1.0, 1.8]} pos={[-4.5, 0.5, -4.2]} color="#d0d0d8" />
    <Box size={[7, 0.1, 2.0]} pos={[-4.5, 1.06, -4.2]} color="#c0c0cc" />
    {/* counter right */}
    <Box size={[7, 1.0, 1.8]} pos={[4.5, 0.5, -4.2]} color="#d0d0d8" />
    <Box size={[7, 0.1, 2.0]} pos={[4.5, 1.06, -4.2]} color="#c0c0cc" />
    {/* upper cabinets */}
    <Box size={[7, 2.0, 0.6]} pos={[-4.5, 4.4, -5.4]} color="#e0e0e8" />
    <Box size={[7, 2.0, 0.6]} pos={[4.5, 4.4, -5.4]} color="#e0e0e8" />
    {/* cabinet handles */}
    {[-7, -5.5, -4, -2.5, -1].map((x) => <Box key={"h1" + x} size={[0.8, 0.08, 0.08]} pos={[x, 3.6, -5.08]} color="#a0a0b0" />)}
    {[1, 2.5, 4, 5.5, 7].map((x) => <Box key={"h2" + x} size={[0.8, 0.08, 0.08]} pos={[x, 3.6, -5.08]} color="#a0a0b0" />)}
    {/* sink */}
    <Box size={[2.0, 0.08, 1.4]} pos={[0, 1.08, -4.3]} color="#b0b8c8" />
    <Cyl r={0.14} h={0.4} pos={[0, 1.5, -4.4]} color="#b0b8c8" />
    <Cyl r={0.06} h={0.1} pos={[0, 1.9, -4.5]} r2={0.03} color="#c0c8d8" />
    {/* salt shaker — HERO PROP, in the world */}
    <group position={[-2.0, 1.1, -3.8]}>
      <Cyl r={0.18} r2={0.14} h={0.6} pos={[0, 0.3, 0]} color="#f4f4f8" rough={0.3} />
      <Cyl r={0.14} h={0.08} pos={[0, 0.64, 0]} color="#c0b898" />
      {/* label "SALT" on the shaker */}
      <Sign lines={["SALT"]} pos={[0, 0.3, 0.2]} w={0.3} h={0.18} bg="#f4f4f8" fg="#2a2a3a" />
      {/* little holes for the salt to come out */}
    </group>
    {/* overhead light */}
    <Box size={[1.4, 0.12, 0.6]} pos={[0, 6.8, -1]} color="#f8f8ff" emissive="#f0f0ff" emissiveIntensity={0.8} />
    <pointLight position={[0, 6.5, -1]} intensity={40} distance={12} decay={2} color="#fff8f0" />
    {children}
  </group>
);

// Night alley for smuggling scene
export const NightAlley: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Ground map={cobbles("#707080", [8, 8])} size={80} />
    {/* alley walls */}
    <Box size={[0.5, 7, 20]} pos={[-5, 3.5, 0]} map={bricks("#4a3a2a", [1.5, 1])} />
    <Box size={[0.5, 7, 20]} pos={[5, 3.5, 0]} map={bricks("#3a3028", [1.5, 1])} />
    <Box size={[11, 7, 0.5]} pos={[0, 3.5, -8]} map={bricks("#4a3028", [2, 1])} />
    {/* single hanging lantern */}
    <group position={[0, 5.8, -2]}>
      <Cyl r={0.015} h={1.5} pos={[0, 0.75, 0]} color="#2a1a0a" />
      <Cyl r={0.18} r2={0.14} h={0.4} pos={[0, 0, 0]} color="#6a4a1a" rough={0.4} />
      <pointLight intensity={18} distance={8} decay={2} color="#ffa040" />
    </group>
    {/* sacks on the ground (salt contraband) */}
    {[[-2, 2], [0, 1.5], [1.5, 2.5]].map(([x, z], i) => (
      <Cyl key={"sack" + i} r={0.3} r2={0.2} h={0.5} pos={[x, 0.25, z]} color={["#b8a870", "#c0b080", "#a89860"][i]} />
    ))}
    {children}
  </group>
);

// French street (revolution era): cobbles, gas lamp, poster wall
export const FrenchStreet: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Ground map={cobbles("#7a706a", [6, 6])} size={180} />
    {[-8, -1.5, 6, 13, 20].map((x, i) => (
      <House key={"fr" + i} pos={[x, 0, -12]} seed={i + 80} brick={["#8a4a35", "#7a4030", "#9a5040", "#8a3a28", "#704030"][i]} h={i % 2 === 0 ? 12 : 10} lit={0.5} />
    ))}
    {[-20, -8, 4, 16].map((x) => <Lamp key={"fl" + x} pos={[x, 0.25, -7]} on />)}
    {/* revolutionary poster on wall */}
    <Sign lines={["LIBERTE", "EGALITE", "GABELLE"]} pos={[-11, 2.8, -11.4]} w={3.2} h={2.0} bg="#f0e0c0" fg="#8a1a1a" />
    {children}
  </group>
);

export { planks };
