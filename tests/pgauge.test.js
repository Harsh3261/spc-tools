/* Plain GO / NO-GO gauges: gauge-maker class chart and sizing. Run: node tests/pgauge.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("/* BEGIN DATA PG:"), b = s.indexOf("(function(){", s.indexOf("function pgDesign"));
eval(s.slice(a, b).replace(/var (PG_\w+)/g, "global.$1").replace(/function (pg\w+)/g, "global.$1 = function"));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };
const near = (l, g, e) => { n++; if (Math.abs(g - e) > 1e-9) fails.push(l + ": " + g + " vs " + e); };
/* chart, typed independently from Meyer Gage / Fox Valley */
eq("inch rows", PG_IN.map(r => [r[0], r[1]]), [[0.010,0.825],[0.825,1.510],[1.510,2.510],[2.510,4.510],[4.510,6.510],[6.510,9.010],[9.010,12.010]]);
eq("0.825 row", PG_IN[0][2], [0.00001,0.00002,0.00004,0.00007,0.0001,0.0002]);
eq("9.010 row", PG_IN[6][2], [0.00005,0.0001,0.0002,0.0003,0.0004,0.0008]);
eq("mm first", PG_MM[0][2], [0.00025,0.00051,0.00102,0.00178,0.00254,0.00508]);
eq("mm last", PG_MM[6][2], [0.00127,0.00254,0.00508,0.00762,0.01016,0.02032]);
/* every class is wider than the one before; ranges above-including */
PG_IN.concat(PG_MM).forEach((r, i) => eq("monotonic " + i, r[2].every((v, k) => !k || v > r[2][k - 1]), true));
eq("0.825 is in first range", pgTol(0.825, "in", "ZZ"), 0.0002); eq("0.8251 in second", pgTol(0.8251, "in", "ZZ"), 0.00024);
/* Judge Tool worked example: hole .7500 ±.0002 → GO .7498 +.00002, NO-GO .7502 −.00002 (class XX) */
const j = pgDesign("hole", 0.7498, 0.7502, "in", "XX");
near("GO lo", j.go[0], 0.7498); near("GO hi", j.go[1], 0.74982); near("NG lo", j.ng[0], 0.75018); near("NG hi", j.ng[1], 0.7502);
/* 10 % rule: part tol .0004 → .00004 allowed → class X */
eq("auto class", pgDesign("hole", 0.7498, 0.7502, "in", "auto").cls, "X");
eq("auto wide tol → ZZ", pgDesign("hole", 0.5, 0.505, "in", "auto").cls, "ZZ");
eq("too tight", /too tight/.test(pgDesign("hole", 0.5, 0.50005, "in", "auto").error), true);
/* ring gauges: GO minus at pin max, NO-GO plus at pin min */
const r = pgDesign("shaft", 24.98, 25.0, "mm", "Z");
near("ring GO hi", r.go[1], 25.0); near("ring GO lo", r.go[0], 25.0 - 0.00305); near("ring NG lo", r.ng[0], 24.98); near("ring NG hi", r.ng[1], 24.98 + 0.00305);
eq("bad order", !!pgDesign("hole", 1, 0.9, "in", "X").error, true);
if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " plain-gauge checks passed");
