// Episode 2 shot list: 30 shots — The White Gold (Salt history)
// One entry per line in episodes/ep2/shots.json.
// All 30 shots matched to user audio timestamps.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CamKeys, Look } from "../engine/Stage";
import { Toon } from "../engine/Toon";
import { Box, Cyl, Sign, Fire } from "../engine/kit";
import {
  RomanStreet, DesertRoad, ThroneRoom, Kitchen, NightAlley, FrenchStreet,
  desertLook, romanLook, throneLook, smugglerLook, kitchenLook, frenchLook,
} from "./sets";
import { C } from "./cast";

export type Shot = { look: Look; cam: CamKeys; focus: number; Body: React.FC<{ dur: number }> };

const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const B = (fn: (t: number, dur: number) => React.ReactNode): React.FC<{ dur: number }> => ({ dur }) => { const t = useT(); return <>{fn(t, dur)}</>; };

// precomputed looks
const roman   = romanLook();
const desert  = desertLook();
const throne  = throneLook();
const smuggle = smugglerLook();
const kitchen = kitchenLook();
const french  = frenchLook();

export const SHOTS: Record<number, Shot> = {

  // ── SHOT 1 ── "Imagine living in a time when a simple handful of salt could be worth far more than you might think."
  // Ancient market / merchant showing salt
  1: {
    look: roman, focus: 9, cam: { from: [5, 6.5, 13], to: [2, 3.5, 10], lookFrom: [-3, 1.5, 1], fov: 55 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "sack", eyes: "wide", mouth: "open" }} pos={[-3, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "hips", armR: "down", eyes: "dot", mouth: "flat" }} pos={[-1, 0, 1.5]} seed={2} />
      </RomanStreet>
    )),
  },

  // ── SHOT 2 ── "Today, we find salt in practically every kitchen."
  // Modern kitchen wide: character next to counter and salt shaker
  2: {
    look: kitchen, focus: 4.5, cam: { from: [5, 5.5, 8], to: [1.5, 2.8, 5], lookFrom: [-2.0, 1.1, -3.8], fov: 52 },
    Body: B(() => (
      <Kitchen>
        <Toon spec={C.modern} pose={{ armL: "down", armR: "hips", eyes: "dot", mouth: "smile" }} pos={[1.2, 0, 1.2]} />
      </Kitchen>
    )),
  },

  // ── SHOT 3 ── "But in the past, this mineral helped generate fortunes, fuel the growth of cities,"
  // Grand Roman street, bustling with trade and pillars
  3: {
    look: roman, focus: 10, cam: { from: [12, 6.5, 14], to: [3, 3.5, 11], lookFrom: [0, 1.8, 1], fov: 58 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.taxman} pose={{ armL: "hold", prop: "coin", eyes: "happy", mouth: "grin" }} pos={[-4, 0, 1]} />
        <Toon spec={C.merchant} pose={{ armL: "down", armR: "hold", prop: "sack", eyes: "dot" }} pos={[-1.5, 0, 1.5]} seed={4} />
      </RomanStreet>
    )),
  },

  // ── SHOT 4 ── "and transformed trade across great civilizations."
  // Portico view / amphorae being traded
  4: {
    look: roman, focus: 9, cam: { from: [-10, 6, 13], to: [-3, 3.2, 10], lookFrom: [-4, 1.4, 1], fov: 54 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "point", armL: "down", eyes: "happy", mouth: "smile" }} pos={[-5, 0, 1]} />
        <Toon spec={C.soldier1} pose={{ armL: "cross", armR: "cross", eyes: "dot", mouth: "flat" }} pos={[-2, 0, 1.5]} seed={3} />
      </RomanStreet>
    )),
  },

  // ── SHOT 5 ── "For thousands of years, preserving food was a huge challenge."
  // Market stall with merchant and distressed expression
  5: {
    look: roman, focus: 9, cam: { from: [-6, 5.5, 13], to: [-3, 3, 10.5], lookFrom: [-5, 1.2, 1], fov: 52 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "plate", eyes: "sad", mouth: "frown" }} pos={[-5, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "down", armR: "shrug", eyes: "wide", mouth: "o" }} pos={[-2.5, 0, 1.5]} seed={2} />
      </RomanStreet>
    )),
  },

  // ── SHOT 6 ── "Without refrigerators, meat and fish spoiled quickly."
  // Close-up on the distressed merchant
  6: {
    look: roman, focus: 8, cam: { from: [-3, 5, 12], to: [-3, 3, 10], lookFrom: [-4, 1.2, 1], fov: 44 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "plate", eyes: "angry", mouth: "wavy" }} pos={[-4, 0, 1]} />
      </RomanStreet>
    )),
  },

  // ── SHOT 7 ── "Salt changed that, allowing food to be preserved for much longer,"
  // Merchant happily curing with salt crystals
  7: {
    look: roman, focus: 9, cam: { from: [-4, 5.5, 12.5], to: [-2, 3.2, 10], lookFrom: [-4, 1.3, 1], fov: 48 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "sack", armL: "up", eyes: "happy", mouth: "grin" }} pos={[-4, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "wave", eyes: "happy", mouth: "smile" }} pos={[-1.5, 0, 1.5]} seed={5} />
      </RomanStreet>
    )),
  },

  // ── SHOT 8 ── "and becoming essential to the survival of entire communities."
  // Bustling Roman street community gathering
  8: {
    look: roman, focus: 10, cam: { from: [9, 6.5, 14], to: [2, 3.5, 11], lookFrom: [-2, 1.5, 1], fov: 57 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "sack", eyes: "happy", mouth: "smile" }} pos={[-3, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "hold", prop: "plate", eyes: "happy", mouth: "grin" }} pos={[0, 0, 1.5]} seed={3} />
        <Toon spec={C.taxman} pose={{ armL: "down", armR: "hips", eyes: "dot", mouth: "smile" }} pos={[2.5, 0, 1]} seed={7} />
      </RomanStreet>
    )),
  },

  // ── SHOT 9 ── "As cities grew, the demand for salt increased."
  // City architecture panorama with carts moving
  9: {
    look: roman, focus: 11, cam: { from: [-14, 6.5, 15], to: [2, 3.5, 11], lookFrom: [0, 2.0, 0], fov: 60, ease: "linear" },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.guide} pose={{ armL: "down", armR: "down", walk: 1, eyes: "dot" }} pos={[-2, 0, 3]} path={{ from: [-10, 0, 3], to: [12, 0, 3], start: 0, end: 4 }} />
      </RomanStreet>
    )),
  },

  // ── SHOT 10 ── "Regions with large natural deposits became more important,"
  // Wide open desert/salt flats vista
  10: {
    look: desert, focus: 14.0, cam: { from: [-10, 7.0, 18], to: [0, 4.0, 12], lookFrom: [0, 1.0, 0], fov: 60 },
    Body: B(() => (
      <DesertRoad>
        <Toon spec={C.guide} pose={{ armR: "point", armL: "hips", eyes: "wide", mouth: "open" }} pos={[-3, 0, 4]} />
      </DesertRoad>
    )),
  },

  // ── SHOT 11 ── "while merchants transported this resource over long distances,"
  // Desert road caravan moving
  11: {
    look: desert, focus: 8.0, cam: { from: [-8, 4.5, 14], to: [4, 2.8, 9], lookFrom: [0, 1.5, 2], fov: 54, ease: "linear" },
    Body: B(() => (
      <DesertRoad>
        <Toon spec={C.guide} pose={{ armL: "hold", prop: "sack", walk: 1, eyes: "dot", mouth: "flat" }} pos={[-2, 0, 3]} path={{ from: [-8, 0, 4], to: [14, 0, 1], start: 0, end: 4 }} />
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "sack", walk: 1, eyes: "dot" }} pos={[0, 0, 4]} path={{ from: [-6, 0, 5], to: [16, 0, 2], start: 0.3, end: 4.3 }} seed={2} />
      </DesertRoad>
    )),
  },

  // ── SHOT 12 ── "crossing deserts, mountains, and dangerous trade routes."
  // Close on merchant trudging through heat & dunes
  12: {
    look: desert, focus: 3.2, cam: { from: [4.5, 2.0, 6.5], to: [3.0, 1.6, 5.0], lookFrom: [0, 1.4, 1.0], fov: 48 },
    Body: B(() => (
      <DesertRoad>
        <Toon spec={C.guide} pose={{ armL: "hold", prop: "sack", armR: "down", walk: 1, eyes: "dot", mouth: "frown" }} pos={[0, 0, 1.5]} path={{ from: [3, 0, 3], to: [-3, 0, -1], start: 0, end: 4 }} />
      </DesertRoad>
    )),
  },

  // ── SHOT 13 ── "In ancient Rome, salt held great economic and strategic importance."
  // Roman soldiers standing guard in forum
  13: {
    look: roman, focus: 10, cam: { from: [-8, 6, 14], to: [2, 3.5, 11], lookFrom: [-2, 1.8, 1], fov: 56 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.soldier1} pose={{ armR: "hold", prop: "whip", eyes: "dot", mouth: "flat" }} pos={[-2.5, 0, 1]} />
        <Toon spec={C.soldier2} pose={{ armL: "cross", armR: "cross", eyes: "dot", mouth: "flat" }} pos={[0.5, 0, 1.2]} seed={3} />
      </RomanStreet>
    )),
  },

  // ── SHOT 14 ── "One of the ancient routes associated with its trade became known as the Via Salaria — the Salt Road."
  // Roman paved road with stone sign "VIA SALARIA"
  14: {
    look: roman, focus: 10, cam: { from: [-14, 6, 15], to: [2, 3.2, 11], lookFrom: [-4, 1.6, 1], lookTo: [2, 1.8, 0], fov: 57, ease: "linear" },
    Body: B(() => (
      <RomanStreet>
        <Sign lines={["VIA SALARIA"]} pos={[-5, 2.6, -2]} w={4.5} h={0.9} bg="#d4c8a0" fg="#4a2a10" />
        <Toon spec={C.soldier1} pose={{ armR: "hold", prop: "whip", walk: 1, eyes: "dot" }} pos={[-3, 0, 1]} path={{ from: [-14, 0, 1], to: [10, 0, 1], start: 0, end: 5 }} />
        <Toon spec={C.soldier2} pose={{ armR: "hold", prop: "whip", walk: 1, eyes: "dot" }} pos={[-5, 0, 2.5]} path={{ from: [-16, 0, 2.5], to: [8, 0, 2.5], start: 0.3, end: 5.3 }} seed={3} />
      </RomanStreet>
    )),
  },

  // ── SHOT 15 ── "The mineral was used to preserve food and played a role in a trading network that connected different regions."
  // Trade network hub with merchants and sacks
  15: {
    look: roman, focus: 10, cam: { from: [8, 6, 14], to: [3, 3.2, 11], lookFrom: [0, 1.5, 1], fov: 54 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "point", armL: "hold", prop: "sack", eyes: "happy", mouth: "smile" }} pos={[-2, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "down", armR: "hold", prop: "sack", eyes: "dot" }} pos={[1.5, 0, 1.5]} seed={4} />
      </RomanStreet>
    )),
  },

  // ── SHOT 16 ── "But the true power of salt wasn't just in the kitchen."
  // Dramatic transition into shadowy Throne Room
  16: {
    look: throne, focus: 8.0, cam: { from: [0, 5.5, 14], to: [0, 3.8, 9.5], lookFrom: [0, 2.2, -6], fov: 56 },
    Body: B(() => (
      <ThroneRoom>
        <Toon spec={C.king} pose={{ armR: "down", armL: "down", eyes: "dot", mouth: "flat" }} pos={[0, 0.9, -9.2]} />
      </ThroneRoom>
    )),
  },

  // ── SHOT 17 ── "Those who controlled production, transportation routes, or trading points could influence prices and collect revenue."
  // Toll point / tax collector counting coins
  17: {
    look: throne, focus: 3.5, cam: { from: [3.5, 2.6, 5.0], to: [2.0, 1.8, 3.5], lookFrom: [-1.0, 1.2, -2.0], fov: 48 },
    Body: B(() => (
      <ThroneRoom>
        <Toon spec={C.taxman} pose={{ armL: "hold", prop: "coin", armR: "hold", propHand: "L", eyes: "happy", mouth: "grin" }} pos={[-1.2, 0, -2.5]} />
        <Toon spec={C.merchant} pose={{ armL: "down", armR: "shrug", eyes: "sad", mouth: "frown" }} pos={[1.2, 0, -2.0]} seed={3} />
      </ThroneRoom>
    )),
  },

  // ── SHOT 18 ── "In certain periods and places, rulers imposed taxes and monopolies on this resource,"
  // King commanding from throne with tax document
  18: {
    look: throne, focus: 5.5, cam: { from: [0, 4.0, 8.0], to: [0, 2.8, 5.5], lookFrom: [0, 2.0, -8.0], fov: 50 },
    Body: B(() => (
      <ThroneRoom>
        <Toon spec={C.king} pose={{ armR: "point", armL: "down", eyes: "angry", mouth: "open" }} pos={[0, 0.9, -9.2]} />
        <Toon spec={C.taxman} pose={{ armL: "hold", prop: "newspaper", eyes: "dot", mouth: "flat" }} pos={[-2, 0, -6]} />
      </ThroneRoom>
    )),
  },

  // ── SHOT 19 ── "turning it into an important source of wealth."
  // Treasury: coin stacks and salt sacks
  19: {
    look: throne, focus: 2.2, cam: { from: [1.5, 2.5, 1.8], to: [0.5, 2.0, 0.8], lookFrom: [-1.5, 1.2, -3.0], fov: 44 },
    Body: B(() => (
      <ThroneRoom>
        {[0, 0.12, 0.24, 0.36].map((y) => <Cyl key={"coin" + y} r={0.25} h={0.07} pos={[-1.6 + y * 0.08, 1.08 + y, -3]} color="#c8a020" />)}
        <Toon spec={C.taxman} pose={{ armR: "up", armL: "hold", prop: "coin", eyes: "happy", mouth: "grin" }} pos={[1.2, 0, -2]} />
      </ThroneRoom>
    )),
  },

  // ── SHOT 20 ── "In some societies, salt also took on symbolic meaning, associated with hospitality, agreements, and preservation."
  // Agreement / treaty banquet table
  20: {
    look: roman, focus: 10, cam: { from: [-5, 6, 14], to: [-2, 3.2, 11], lookFrom: [-1.0, 1.4, 1], fov: 52 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "plate", eyes: "happy", mouth: "smile" }} pos={[-2.2, 0, 1]} />
        <Toon spec={C.soldier1} pose={{ armL: "wave", eyes: "happy", mouth: "smile" }} pos={[0.5, 0, 1.2]} seed={2} />
      </RomanStreet>
    )),
  },

  // ── SHOT 21 ── "Its value varied depending on the region, availability, and transportation costs."
  // Weighing / trade evaluation
  21: {
    look: roman, focus: 9, cam: { from: [5, 5.5, 13], to: [2, 3, 10.5], lookFrom: [0, 1.3, 1], fov: 48 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armL: "hold", armR: "hold", prop: "sack", eyes: "dot", mouth: "open" }} pos={[-0.8, 0, 1]} />
        <Toon spec={C.guide} pose={{ armL: "hips", armR: "point", eyes: "dot" }} pos={[1.8, 0, 1.2]} seed={4} />
      </RomanStreet>
    )),
  },

  // ── SHOT 22 ── "Where it was scarce, it could become especially expensive."
  // Night alley smuggler holding precious contraband salt
  22: {
    look: smuggle, focus: 3.2, cam: { from: [3.8, 2.4, 6.5], to: [2.2, 1.7, 5.0], lookFrom: [-1.5, 1.3, 1.0], fov: 48 },
    Body: B(() => (
      <NightAlley>
        <Toon spec={C.smuggler} pose={{ armL: "hold", prop: "sack", armR: "down", walk: 1, eyes: "wide", mouth: "o" }} pos={[-1, 0, 2]} path={{ from: [-4, 0, 3], to: [3, 0, -1], start: 0, end: 3.5 }} />
      </NightAlley>
    )),
  },

  // ── SHOT 23 ── "Over the centuries, new trade routes, production techniques, and sources of supply transformed the market."
  // French street / early industrial era
  23: {
    look: french, focus: 6.5, cam: { from: [-10, 4.2, 12], to: [-1.5, 2.4, 8.5], lookFrom: [-4, 1.6, -2], fov: 56 },
    Body: B(() => (
      <FrenchStreet>
        <Toon spec={C.rebel} pose={{ armR: "up", armL: "hold", prop: "newspaper", eyes: "angry", mouth: "open", walk: 1 }} pos={[-4, 0, -2]} path={{ from: [-10, 0, -1], to: [3, 0, -3], start: 0, end: 4 }} />
      </FrenchStreet>
    )),
  },

  // ── SHOT 24 ── "Salt became more accessible in many parts of the world,"
  // Accessible market street
  24: {
    look: french, focus: 4.5, cam: { from: [6, 2.8, 8], to: [2.5, 1.8, 6], lookFrom: [-1, 1.4, 0], fov: 52 },
    Body: B(() => (
      <FrenchStreet>
        <Toon spec={C.merchant} pose={{ armR: "hold", prop: "sack", armL: "wave", eyes: "happy", mouth: "smile" }} pos={[-1.5, 0, 0]} />
        <Toon spec={C.guide} pose={{ armL: "hold", prop: "plate", eyes: "happy", mouth: "grin" }} pos={[1.5, 0, 0.5]} seed={3} />
      </FrenchStreet>
    )),
  },

  // ── SHOT 25 ── "although it continued to play an essential role in food and industry."
  // Barrels and food preservation industry
  25: {
    look: french, focus: 4.0, cam: { from: [-5, 2.4, 7.5], to: [-2.5, 1.7, 5.5], lookFrom: [-1, 1.4, 1.0], fov: 48 },
    Body: B(() => (
      <FrenchStreet>
        <Toon spec={C.merchant} pose={{ armR: "point", armL: "hips", eyes: "dot", mouth: "flat" }} pos={[-1.5, 0, 1.0]} />
      </FrenchStreet>
    )),
  },

  // ── SHOT 26 ── "It's amazing to think that such a common mineral once had so much influence on the economy and people's lives."
  // Broad historical panorama overlooking Roman city
  26: {
    look: roman, focus: 11, cam: { from: [-14, 7, 15], to: [0, 4, 11], lookFrom: [0, 1.5, 0], fov: 62 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.merchant} pose={{ armL: "down", armR: "shrug", eyes: "wide", mouth: "open" }} pos={[-3.5, 0, 1]} />
        <Toon spec={C.taxman} pose={{ armL: "down", armR: "hips", eyes: "dot", mouth: "smile" }} pos={[1.5, 0, 1.2]} seed={5} />
      </RomanStreet>
    )),
  },

  // ── SHOT 27 ── "Salt didn't build empires on its own,"
  // Grand monument / pillars in golden afternoon
  27: {
    look: roman, focus: 10, cam: { from: [11, 6.5, 14], to: [3, 3.5, 11], lookFrom: [-1, 2.0, -4], fov: 56 },
    Body: B(() => (
      <RomanStreet>
        <Toon spec={C.soldier1} pose={{ armR: "hold", prop: "whip", eyes: "dot", mouth: "flat" }} pos={[-1.5, 0, 1]} />
      </RomanStreet>
    )),
  },

  // ── SHOT 28 ── "but it helped feed populations, sustain trade, and strengthen the power of those who managed to control it."
  // Roman legions marching with supply sacks
  28: {
    look: roman, focus: 10, cam: { from: [-16, 6.5, 15], to: [4, 3.5, 11], lookFrom: [-2, 1.6, 0], fov: 60, ease: "linear" },
    Body: B(() => (
      <RomanStreet>
        {[-3, 0, 3].map((x) =>
          <Toon key={"leg" + x} spec={x < 0 ? C.soldier1 : C.soldier2} pose={{ armR: "hold", prop: "whip", walk: 1, eyes: "dot" }} pos={[x, 0, 0]} path={{ from: [x - 16, 0, 0], to: [x + 16, 0, 0], start: 0, end: 5 }} seed={x + 10} />
        )}
      </RomanStreet>
    )),
  },

  // ── SHOT 29 ── "And the next time you sprinkle salt on your food, remember —"
  // Back to modern kitchen, close-up with salt shaker poised
  29: {
    look: kitchen, focus: 0.9, cam: { from: [-2.8, 1.8, 1.2], to: [-2.1, 1.4, 0.4], lookFrom: [-2.0, 1.1, -3.8], fov: 42 },
    Body: B((t) => {
      const reach = interpolate(t, [0.3, 1.0, 2.5, 3.5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Kitchen>
          <Toon spec={C.modern}
            pose={{ armR: reach > 0.3 ? "hold" : "down", prop: "sack", armL: "down", eyes: reach > 0.5 ? "dot" : "wide", mouth: "flat" }}
            pos={[0, 0, 1.5]} />
        </Kitchen>
      );
    }),
  },

  // ── SHOT 30 ── "what seems insignificant today was once a strategic resource capable of making the difference between wealth, survival, and power."
  // Dramatic glowing salt shaker, golden light from the ages of history
  30: {
    look: { ...kitchen, aperture: 0.55, vignette: 0.55 }, focus: 1.4, cam: { from: [-0.8, 2.4, 3.2], to: [-1.6, 1.9, 2.2], lookFrom: [-2.0, 1.1, -3.8], fov: 44 },
    Body: B((t) => {
      const glow = interpolate(t, [0, 1, 3], [0, 0.85, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Kitchen>
          <Cyl r={0.18} r2={0.14} h={0.6} pos={[-2.0, 1.4, -3.8]} color="#f4f4f8" rough={0.3} emissive="#ffe090" emissiveIntensity={glow * 0.6} />
          <pointLight position={[-2.0, 1.8, -3.4]} intensity={glow * 10} distance={4} decay={2} color="#ffe080" />
          <Toon spec={C.modern} pose={{ armL: "down", armR: "hips", eyes: "wide", mouth: "o" }} pos={[1.2, 0, 1.2]} />
        </Kitchen>
      );
    }),
  },
};
