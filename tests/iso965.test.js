/* ISO 965-1 tolerance engine: reproduces ISO 965-2 6g / 6H exactly and matches independently published
   limits for other classes. Run: node tests/iso965.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("var TH_M = ["), b = s.indexOf("];", a); eval("global.TH_M = " + s.slice(a + 11, b + 1));
const c = s.indexOf("/* BEGIN DATA TH965:"), d = s.indexOf("/* Length-of-engagement basis", c);
eval(s.slice(c, d).replace(/var (TH965_\w+)/g, "global.$1").replace(/function (th965\w*)/g, "global.$1 = function"));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };

/* 1. Every ISO 965-2 value in TH_M (major, pitch, internal minor, internal major) reproduced exactly from the tables */
let cells = 0;
TH_M.forEach(r => {
  const e = th965(r[1], r[2], "6g"), i = th965(r[1], r[2], "6H");
  eq(r[0] + " computable", [!!e.error, !!i.error], [false, false]);
  if (e.error || i.error) return;
  [[e.major[1], 3], [e.major[0], 4], [e.pd[1], 5], [e.pd[0], 6], [i.minor[0], 8], [i.minor[1], 9], [i.pd[0], 10], [i.pd[1], 11], [i.majorMin, 12]]
    .forEach(([g, k]) => { cells++; eq(r[0] + " col " + k, Math.abs(g - r[k]) < 0.0005, true); });
});
eq("cells checked", cells, 486);

/* 2. Independent published limits (Machining Doctor thread data sheets) for other classes */
const pub = [
  [10, 1.5, "6h", [9.764, 10], [8.894, 9.026]], [10, 1.5, "6e", [9.697, 9.933], [8.827, 8.959]],
  [10, 1.5, "4g6g", [9.732, 9.968], [8.909, 8.994]], [10, 1.5, "8g", [9.593, 9.968], [8.782, 8.994]],
  [8, 1.25, "6e", [7.725, 7.937], [7.007, 7.125]], [8, 1.25, "4g6g", [7.76, 7.972], [7.085, 7.16]], [8, 1.25, "8g", [7.637, 7.972], [6.97, 7.16]]
];
pub.forEach(([D, P, cl, maj, pd]) => { const r = th965(D, P, cl); eq("M" + D + "x" + P + " " + cl, [r.major, r.pd], [maj, pd]); });
const g5 = th965(10, 1.5, "5G"); eq("M10 5G", [g5.minor, g5.pd], [[8.408, 8.644], [9.058, 9.198]]);

/* 3. Table structure and spot values (ISO 965-1 Tables 1–5) */
eq("dev 1.5", TH965_DEV["1.5"], [32, 0, -67, -45, -32, 0]);
eq("dev 0.35 (no e)", TH965_DEV["0.35"], [19, 0, null, -34, -19, 0]);
eq("TD1 2", TH965_TD1["2"], [236, 300, 375, 475, 600]);
eq("Td 1.25", TH965_TDM["1.25"], [132, 212, 335]);
eq("TD2 rows", TH965_TD2.length, 42); eq("Td2 rows", TH965_TD2E.length, 42);
eq("no 8 mm / 0.99 rows", TH965_TD2.concat(TH965_TD2E).some(r => r[2] === 8 || r[0] === 0.99), false);
/* each grade follows the ISO 965-1 grade ratios to within the R40 rounding step (~6 %) */
TH965_TD2E.forEach(r => { const g6 = r[6]; [0.5, 0.63, 0.8, 1, 1.25, 1.6, 2].forEach((f, k) => { const v = r[3 + k]; if (v != null) eq("Td2 ratio " + r.slice(0, 3) + " g" + (k + 3), Math.abs(v / (f * g6) - 1) < 0.065, true); }); });
TH965_TD2.forEach(r => { const e6 = TH965_TD2E.find(x => x[0] === r[0] && x[2] === r[2])[6]; [0.85, 1.06, 1.32, 1.7, 2.12].forEach((f, k) => { const v = r[3 + k]; if (v != null) eq("TD2 ratio " + r.slice(0, 3) + " g" + (k + 4), Math.abs(v / (f * e6) - 1) < 0.065, true); }); });

/* 4. Parsing and rules */
eq("parse 4g6g", th965Parse("4g6g"), { pdGrade:4, crestGrade:6, pos:"g", ext:true });
eq("parse 5H6H", th965Parse("5H6H"), { pdGrade:5, crestGrade:6, pos:"H", ext:false });
eq("mixed position rejected", th965Parse("6g6h"), null);
eq("e not defined below 0.5", /not defined/.test(th965(2, 0.4, "6e").error || ""), true);
eq("Td grade 5 does not exist", /grades 4, 6 and 8/.test(th965(10, 1.5, "5g").error || ""), true);
eq("untabulated combination", /not tabulated/.test(th965(10, 3, "6g").error || ""), true);
eq("custom M17x1.5 6g", th965(17, 1.5, "6g").pd, [15.854, 15.994]);  /* 17 − 0.974 − 0.032 = 15.994 max; Td2 (11.2–22.4, 1.5) = 140 → 15.854 */

if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.slice(0, 20).join("\n")); process.exit(1); }
console.log("OK " + n + " ISO 965 checks passed (" + cells + " ISO 965-2 cells reproduced exactly)");
