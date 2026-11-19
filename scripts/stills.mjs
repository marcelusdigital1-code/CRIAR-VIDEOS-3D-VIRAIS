// Check stills before rendering: node scripts/stills.mjs 1 2 3 [--frame=20] [--ep=ep1]
// Bundles once, then renders one still per shot into out/stills/sNN.png. Look at every one before you render.
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
const args = process.argv.slice(2);
const frame = (args.find((a) => a.startsWith("--frame=")) || "--frame=20").split("=")[1];
const epArg = (args.find((a) => a.startsWith("--ep=")) || "--ep=ep1").split("=")[1];
const compArg = args.find((a) => a.startsWith("--comp="));
const comp = compArg ? compArg.split("=")[1] : (epArg === "ep2" ? "Shot2" : "Shot");
const ids = args.filter((a) => !a.startsWith("--"));
fs.mkdirSync(`out/stills/${epArg}`, { recursive: true });
execSync("npx remotion bundle src/index.ts --out-dir=out/bundle --log=error", { stdio: "inherit" });
const run = (id) => new Promise((ok) => {
  const propPath = `out/stills/prop_${id}.json`;
  fs.writeFileSync(propPath, JSON.stringify({ id }));
  const p = spawn("npx", ["remotion", "still", "out/bundle", comp, `out/stills/${epArg}/s${String(id).padStart(2, "0")}.png`, `--props=${propPath}`, `--frame=${frame}`, "--log=error"], { stdio: "inherit", shell: process.platform === "win32" });
  p.on("close", () => {
    try { fs.unlinkSync(propPath); } catch {}
    ok();
  });
});
for (let i = 0; i < ids.length; i += 4) await Promise.all(ids.slice(i, i + 4).map(run));
console.log(`stills in out/stills/${epArg}:`, ids.map((i) => `s${String(i).padStart(2, "0")}.png`).join(" "));
