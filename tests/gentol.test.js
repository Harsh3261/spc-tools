/* ISO 2768 general tolerances — data and lookup checks.
   Expected values are typed here independently from the sources (ISO 2768-1/-2:1989
   preview text, Wevolver transcription, Starrapid / UW-Madison sheets), so a slip in
   either copy shows up. Run: node tests/gentol.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("/* BEGIN DATA GT:"), b = s.indexOf("(function(){", s.indexOf("function gtAngTxt"));
eval(s.slice(a, b).replace(/\bvar (GT_\w+)/g, "global.$1").replace(/function (gt\w+)/g, "global.$1 = function"));
let n = 0, fails = [];
const eq = (lab, got, exp) => { n++; if (JSON.stringify(got) !== JSON.stringify(exp)) fails.push(lab + ": got " + JSON.stringify(got) + " expected " + JSON.stringify(exp)); };
const LIN = { f: [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, null], m: [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2], c: [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4], v: [null, 0.5, 1, 1.5, 2.5, 4, 6, 8] };
const UP = [3, 6, 30, 120, 400, 1000, 2000, 4000];
["f", "m", "c", "v"].forEach((c, ci) => UP.forEach((u, i) => eq("lin " + c + " " + u, GT_LIN[i][ci + 1], LIN[c][i])));
eq("lin bounds", GT_LIN.map(r => r[0]), UP);
const EDGE = { f: [0.2, 0.5, 1], m: [0.2, 0.5, 1], c: [0.4, 1, 2], v: [0.4, 1, 2] };
["f", "m", "c", "v"].forEach((c, ci) => [0, 1, 2].forEach(i => eq("edge " + c + i, GT_EDGE[i][ci + 1], EDGE[c][i])));
const ANG = { f: [60, 30, 20, 10, 5], m: [60, 30, 20, 10, 5], c: [90, 60, 30, 15, 10], v: [180, 120, 60, 30, 20] };
["f", "m", "c", "v"].forEach((c, ci) => [0, 1, 2, 3, 4].forEach(i => eq("ang " + c + i, GT_ANG[i][ci + 1], ANG[c][i])));
const ST = { H: [0.02, 0.05, 0.1, 0.2, 0.3, 0.4], K: [0.05, 0.1, 0.2, 0.4, 0.6, 0.8], L: [0.1, 0.2, 0.4, 0.8, 1.2, 1.6] };
const PE = { H: [0.2, 0.3, 0.4, 0.5], K: [0.4, 0.6, 0.8, 1], L: [0.6, 1, 1.5, 2] };
const SY = { H: [0.5, 0.5, 0.5, 0.5], K: [0.6, 0.6, 0.8, 1], L: [0.6, 1, 1.5, 2] };
["H", "K", "L"].forEach((c, ci) => {
  ST[c].forEach((v, i) => eq("straight " + c + i, GT_STRAIGHT[i][ci + 1], v));
  PE[c].forEach((v, i) => eq("perp " + c + i, GT_PERP[i][ci + 1], v));
  SY[c].forEach((v, i) => eq("sym " + c + i, GT_SYM[i][ci + 1], v));
});
eq("runout", GT_RUNOUT, { H: 0.1, K: 0.2, L: 0.5 });
/* boundaries: "over X up to Y" — Y belongs to the lower row */
eq("30 mm m", gtLookup(30, 30, "m", "K", "lin").lin.tol, 0.2);
eq("30.01 mm m", gtLookup(30.01, 30.01, "m", "K", "lin").lin.tol, 0.3);
eq("0.5 mm f", gtLookup(0.5, 0.5, "f", null, "lin").lin.tol, 0.05);
eq("0.4 mm", !!gtLookup(0.4, 0.4, "m", null, "lin").lin.note, true);
eq("4001 mm", !!gtLookup(4001, 10, "m", null, "lin").lin.note, true);
eq("2500 f not specified", gtLookup(2500, 10, "f", null, "lin").lin.tol, null);
eq("2 mm v not specified", gtLookup(2, 2, "v", null, "lin").lin.tol, null);
eq("edge 6 c", gtLookup(6, 6, "c", null, "edge").lin.tol, 1);
eq("edge 6.1 c", gtLookup(6.1, 6.1, "c", null, "edge").lin.tol, 2);
eq("angle 10 m", gtLookup(50, 10, "m", null, "lin").ang.min, 60);
eq("angle 10.1 c", gtLookup(50, 10.1, "c", null, "lin").ang.min, 60);
eq("angle 500 v", gtLookup(500, 500, "v", null, "lin").ang.min, 20);
eq("perp 100 K", gtLookup(500, 100, null, "K", "lin").perp.tol, 0.4);
eq("perp 101 K", gtLookup(500, 101, null, "K", "lin").perp.tol, 0.6);
eq("straight 3001", !!gtLookup(3001, 10, null, "H", "lin").straight.note, true);
eq("ang text", [gtAngTxt(90), gtAngTxt(5), gtAngTxt(180)], ["±1°30′", "±0°05′", "±3°00′"]);
if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " ISO 2768 checks passed");
