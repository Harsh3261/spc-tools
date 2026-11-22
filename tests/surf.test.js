/* Surface finish data + lookups. Expected values typed independently from the sources.
   Run: node tests/surf.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("/* BEGIN DATA SF:"), b = s.indexOf("(function(){", s.indexOf("function sfNGrade"));
eval(s.slice(a, b).replace(/\bvar (SF_\w+)/g, "global.$1").replace(/function (sf\w+)/g, "global.$1 = function"));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };
eq("N table", SF_N, [["N1",0.025,1],["N2",0.05,2],["N3",0.1,4],["N4",0.2,8],["N5",0.4,16],["N6",0.8,32],["N7",1.6,63],["N8",3.2,125],["N9",6.3,250],["N10",12.5,500],["N11",25,1000],["N12",50,2000]]);
SF_N.forEach(r => eq(r[0] + " µin≈", Math.abs(r[1] / 0.0254 - r[2]) / r[2] < 0.03, true));
eq("cut lc", SF_CUT.map(c => c.lc), [0.08, 0.25, 0.8, 2.5, 8]);
eq("cut ln", SF_CUT.map(c => c.ln), [0.4, 1.25, 4, 12.5, 40]);
eq("cut ra", SF_CUT.map(c => c.ra), [[0.006,0.02],[0.02,0.1],[0.1,2],[2,10],[10,80]]);
eq("cut rz", SF_CUT.map(c => c.rz), [[0.025,0.1],[0.1,0.5],[0.5,10],[10,50],[50,200]]);
eq("cut rsm", SF_CUT.map(c => c.rsm), [[0.013,0.04],[0.04,0.13],[0.13,0.4],[0.4,1.3],[1.3,4]]);
SF_CUT.forEach(c => eq("ln=5lc", Math.abs(c.ln - 5 * c.lc) < 1e-9, true));
eq("Ra 0.8", sfCutoff("ra", 0.8).lc, 0.8); eq("Ra 2 (upper incl)", sfCutoff("ra", 2).lc, 0.8); eq("Ra 2.01", sfCutoff("ra", 2.01).lc, 2.5);
eq("Ra 0.1", sfCutoff("ra", 0.1).lc, 0.25); eq("Ra 0.004", sfCutoff("ra", 0.004), null); eq("Ra 81", sfCutoff("ra", 81), null);
eq("Rz 6.3", sfCutoff("rz", 6.3).lc, 0.8); eq("Rz 10", sfCutoff("rz", 10).lc, 0.8); eq("Rz 12", sfCutoff("rz", 12).lc, 2.5);
eq("RSm 0.2", sfCutoff("rsm", 0.2).lc, 0.8); eq("RSm 0.13", sfCutoff("rsm", 0.13).lc, 0.25);
/* Mitutoyo Bulletin 2229 (lt, rtip) and Surftest quick guide J-26/27 (λs, rtip) */
eq("cut lt", SF_CUT.map(c => c.lt), [0.48, 1.5, 4.8, 15, 48]);
eq("cut ls", SF_CUT.map(c => c.ls), [2.5, 2.5, 2.5, 8, 25]);
eq("cut rtip", SF_CUT.map(c => c.rtip), [2, 2, 2, 5, 10]);
eq("ratio", SF_CUT.map(c => c.ratio), [30, 100, 300, 300, 300]);
eq("N6 exact", sfNGrade(0.8).exact[0], "N6"); eq("1.0 between", [sfNGrade(1).lo[0], sfNGrade(1).hi[0]], ["N6", "N7"]);
eq("63 µin → N7 range", sfNGrade(63 * 0.0254).exact, undefined);
if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " surface-finish checks passed");
