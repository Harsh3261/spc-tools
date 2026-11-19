/* Does the analysis behave sensibly? Simulates thousands of 40-week scrap
   histories where the truth is known and measures false alarms and detection.
   Run: node tests/qc.sim.js   (uses the shipped QC block from index.html) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const blk = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8").match(/\/\* @@QC-CALC BEGIN[\s\S]*?\/\* @@QC-CALC END \*\//)[0];
const ctx = {}; vm.createContext(ctx); vm.runInContext(blk + "\nthis.QC = QC;", ctx); const QC = ctx.QC;
let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pois = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
const batch = () => { const u = rnd(); return u < 0.75 ? 1 + Math.floor(rnd() * 3) : u < 0.97 ? 3 + Math.floor(rnd() * 8) : 20 + Math.floor(rnd() * 50); }; /* most NCPs scrap 1–3, a few lose a batch */
const W = 40, N = 4000;
function run(gen, mode, shiftAt) {
  let seriesAlarm = 0, pts = 0, ptsAlarm = 0, detected = 0, laney = 0, ordPts = 0, ordAlarm = 0, bigPts = 0, bigAlarm = 0;
  for (let s = 0; s < N; s++) {
    const x = gen();
    const od = QC.overdispersion("c", x, null); const lim = mode === "auto" ? (od.flag ? "laney" : "standard") : mode; if (lim === "laney") laney++;
    const r = QC.attr("c", x, null, lim);
    const flagged = new Set(r.signals); r.runs.forEach((ru) => { for (let i = ru.from; i <= ru.to; i++) flagged.add(i); });
    if (shiftAt) { if ([...flagged].some((i) => i > shiftAt)) detected++; }
    else { if (flagged.size) seriesAlarm++; pts += W; ptsAlarm += r.signals.length;
      for (let i = 0; i < W; i++) { const hit = r.signals.indexOf(i + 1) >= 0; if (big[i]) { bigPts++; if (hit) bigAlarm++; } else { ordPts++; if (hit) ordAlarm++; } } }
  }
  return shiftAt ? { detected: detected / N, laney: laney / N } : { anyAlarm: seriesAlarm / N, perPoint: ptsAlarm / pts, laney: laney / N, ordinary: ordAlarm / Math.max(1, ordPts), bigWeeks: bigAlarm / Math.max(1, bigPts) };
}
const stable = () => { big = []; return Array.from({ length: W }, () => pois(8)); };
let big = []; /* weeks that contained a batch loss of 20+ parts */
const pieces = () => { big = []; return Array.from({ length: W }, (_, i) => { let s = 0, n = pois(8); while (n--) { const b = batch(); if (b >= 20) big[i] = true; s += b; } return s; }); };
const shift = () => { big = []; return Array.from({ length: W }, (_, i) => pois(i >= 30 ? 14 : 8)); };
const pct = (x) => (100 * x).toFixed(1) + "%";
const A = run(stable, "standard"), B = run(stable, "auto");
console.log("1. Stable NCP counts (avg 8/week, 40 weeks, nothing changed):");
console.log("   standard limits: false alarm per week " + pct(A.perPoint) + ", any alarm in 40 weeks " + pct(A.anyAlarm));
console.log("   Auto:            false alarm per week " + pct(B.perPoint) + ", any alarm in 40 weeks " + pct(B.anyAlarm) + " (switched to Laney in " + pct(B.laney) + ")");
const C = run(pieces, "standard"), D = run(pieces, "auto");
console.log("2. Scrap PIECES, stable process but NCPs lose 1–70 parts each:");
console.log("   standard c chart: false alarm per week " + pct(C.perPoint) + ", any alarm in 40 weeks " + pct(C.anyAlarm));
console.log("   Auto (Laney):     alarm per week " + pct(D.perPoint) + " (switched to Laney in " + pct(D.laney) + ")");
console.log("     ordinary weeks flagged " + pct(D.ordinary) + " (standard chart: " + pct(C.ordinary) + "); weeks with a 20+ part batch loss flagged " + pct(D.bigWeeks));
const E = run(shift, "auto", 30);
console.log("3. Real change: NCPs rise from 8 to 14 a week for the last 10 weeks:");
console.log("   Auto catches it within those 10 weeks in " + pct(E.detected) + " of histories");
let failed = 0; const need = (c, l) => { if (!c) { failed++; console.log("FAIL", l); } };
need(B.perPoint < 0.01 && Math.abs(B.perPoint - A.perPoint) < 0.003, "Auto must not add false alarms on Poisson data");
need(B.laney < 0.05, "Auto rarely switches on Poisson data");
need(C.perPoint > 0.05, "standard chart is misleading on batch data (expected)");
need(D.ordinary < 0.01 && C.ordinary > 0.1 && D.laney > 0.8, "Auto stops false alarms on ordinary weeks of batch data");
need(E.detected > 0.8, "a real 75% rise is caught");
console.log(failed ? "FAILED" : "OK — all behaviour checks passed");
process.exit(failed ? 1 : 0);
