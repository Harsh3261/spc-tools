/* Welding: D1.1 Table 8.1 / Table 7.9 Schedule C limits and the accept / reject logic.
   Expected values typed independently from the sources. Run: node tests/weld.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("/* BEGIN DATA WD:"), b = s.indexOf("(function(){", s.indexOf("function wdRead"));
eval(s.slice(a, b).replace(/\bvar (WD_\w+)/g, "global.$1").replace(/function (wd\w+)/g, "global.$1 = function"));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };
const res = (rows, name) => { const r = rows.find(x => x.check === name); return r ? r.pass : "absent"; };

/* Limits as the code prints them: [inch, mm] */
eq("undercut <1in", WD_LIM.uc_thin, [1/32, 1]); eq("undercut exception", [WD_LIM.uc_exc, WD_LIM.uc_exc_len, WD_LIM.uc_win], [[1/16, 2], [2, 50], [12, 300]]);
eq("undercut ≥1in", WD_LIM.uc_thick, [1/16, 2]); eq("cyclic transverse", WD_LIM.uc_cyc_trans, [0.01, 0.25]); eq("cyclic other", WD_LIM.uc_cyc, [1/32, 1]);
eq("porosity", [WD_LIM.por_min, WD_LIM.por_1, WD_LIM.por_12], [[1/32, 1], [3/8, 10], [3/4, 20]]);
eq("cyclic porosity", [WD_LIM.por_cyc_dia, WD_LIM.por_cyc_len], [[3/32, 2.5], [4, 100]]);
eq("reinforcement", WD_LIM.reinf, [1/8, 3]); eq("undersize length", WD_LIM.fil_len_pct, 10);

/* Undersized fillet: L ≤ 3/16 → 1/16; 1/4 → 3/32; ≥ 5/16 → 1/8 */
eq("U 1/8", wdUndersize(1/8, "in").u, 1/16); eq("U 3/16", wdUndersize(3/16, "in").u, 1/16); eq("U 1/4", wdUndersize(1/4, "in").u, 3/32);
eq("U 5/16", wdUndersize(5/16, "in").u, 1/8); eq("U 1/2", wdUndersize(1/2, "in").u, 1/8); eq("U 7/32 between → stricter 1/16", [wdUndersize(7/32, "in").u, wdUndersize(7/32, "in").between], [1/16, true]);
eq("U 9/32 between → 3/32", [wdUndersize(9/32, "in").u, wdUndersize(9/32, "in").between], [3/32, true]);
eq("U below table", wdUndersize(3/32, "in"), null);
eq("U mm 5", wdUndersize(5, "mm").u, 2); eq("U mm 6", wdUndersize(6, "mm").u, 2.5); eq("U mm 8", wdUndersize(8, "mm").u, 3); eq("U mm 10", wdUndersize(10, "mm").u, 3);

/* Convexity Schedule C */
eq("C W=1/4", wdConvexMax(1/4, "in"), 1/16); eq("C W=5/16 incl", wdConvexMax(5/16, "in"), 1/16); eq("C W=3/8", wdConvexMax(3/8, "in"), 1/8);
eq("C W=0.999", wdConvexMax(0.999, "in"), 1/8); eq("C W=1", wdConvexMax(1, "in"), 3/16); eq("C W=2", wdConvexMax(2, "in"), 3/16);
eq("C mm 8", wdConvexMax(8, "mm"), 2); eq("C mm 20", wdConvexMax(20, "mm"), 3); eq("C mm 25", wdConvexMax(25, "mm"), 5);

/* Parsing */
eq("parse", ["1/16", "1-1/4", "1 1/4", "0.25", ".5", "", "abc", '3/8"'].map(wdParse).map(v => v === null ? null : (isNaN(v) ? "NaN" : v)), [0.0625, 1.25, 1.25, 0.25, 0.5, null, "NaN", 0.375]);

/* Accept / reject */
const base = { unit:"in", load:"static", t:0.5 };
eq("crack rejects", res(wdCheck({ ...base, crack:"yes" }), "Cracks"), false);
eq("no crack ok", res(wdCheck({ ...base, crack:"no" }), "Cracks"), true);
eq("lack of fusion rejects", res(wdCheck({ ...base, fusion:"lack" }), "Fusion"), false);
eq("crater intermittent end static ok", res(wdCheck({ ...base, crater:"iend" }), "Craters"), true);
eq("crater intermittent end cyclic rejects", res(wdCheck({ ...base, load:"cyclic", crater:"iend" }), "Craters"), false);
eq("1/4 fillet at 5/32 ok", res(wdCheck({ ...base, L:1/4, Lm:5/32, Lp:8 }), "Fillet size"), true);       /* 1/4 − 3/32 = 5/32 */
eq("1/4 fillet at 1/8 rejects", res(wdCheck({ ...base, L:1/4, Lm:1/8, Lp:5 }), "Fillet size"), false);
eq("undersize over 10 % rejects", res(wdCheck({ ...base, L:1/4, Lm:3/16, Lp:12 }), "Fillet size"), false);
eq("undersize % missing → incomplete", res(wdCheck({ ...base, L:1/4, Lm:3/16 }), "Fillet size"), null);
eq("full size, no % needed", res(wdCheck({ ...base, L:1/4, Lm:1/4 }), "Fillet size"), true);
eq("convex 1/16 on W 1/4 ok", res(wdCheck({ ...base, W:1/4, C:1/16 }), "Fillet convexity"), true);
eq("convex 3/32 on W 1/4 rejects", res(wdCheck({ ...base, W:1/4, C:3/32 }), "Fillet convexity"), false);
eq("reinf 1/8 on 1/2 plate ok", res(wdCheck({ ...base, R:1/8 }), "Butt-groove reinforcement"), true);
eq("reinf 5/32 rejects", res(wdCheck({ ...base, R:5/32 }), "Butt-groove reinforcement"), false);
eq("reinf on 1.5 in plate → not covered", res(wdCheck({ ...base, t:1.5, R:1/8 }), "Butt-groove reinforcement"), null);
eq("undercut 1/32 thin ok", res(wdCheck({ ...base, U:1/32 }), "Undercut"), true);
eq("undercut 1/16 thin, 2 in ok", res(wdCheck({ ...base, U:1/16, Ulen:2 }), "Undercut"), true);
eq("undercut 1/16 thin, 3 in rejects", res(wdCheck({ ...base, U:1/16, Ulen:3 }), "Undercut"), false);
eq("undercut 3/32 thin rejects", res(wdCheck({ ...base, U:3/32, Ulen:1 }), "Undercut"), false);
eq("undercut 1/16 thick ok", res(wdCheck({ ...base, t:1, U:1/16 }), "Undercut"), true);
eq("undercut no thickness → incomplete", res(wdCheck({ unit:"in", load:"static", U:1/32 }), "Undercut"), null);
eq("cyclic transverse 0.01 ok", res(wdCheck({ ...base, load:"cyclic", U:0.01, trans:"yes" }), "Undercut (cyclic)"), true);
eq("cyclic transverse 1/32 rejects", res(wdCheck({ ...base, load:"cyclic", U:1/32, trans:"yes" }), "Undercut (cyclic)"), false);
eq("cyclic other 1/32 ok", res(wdCheck({ ...base, load:"cyclic", U:1/32, trans:"no" }), "Undercut (cyclic)"), true);
eq("cyclic no 1/16 exception", res(wdCheck({ ...base, load:"cyclic", U:1/16, trans:"no" }), "Undercut (cyclic)"), false);
eq("porosity 3/8 per in ok", res(wdCheck({ ...base, pj:"other", p1:3/8, p12:3/4 }), "Piping porosity"), true);
eq("porosity 1/2 per in rejects", res(wdCheck({ ...base, pj:"other", p1:1/2 }), "Piping porosity"), false);
eq("porosity 1 in per 12 rejects", res(wdCheck({ ...base, pj:"other", p1:1/4, p12:1 }), "Piping porosity"), false);
eq("CJP transverse any porosity rejects", res(wdCheck({ ...base, pj:"cjp", pvis:"yes" }), "Piping porosity (CJP butt, transverse to tension)"), false);
eq("cyclic 1 pore 1/16 ok", res(wdCheck({ ...base, load:"cyclic", pj:"other", pn:1, pd:1/16 }), "Piping porosity (cyclic)"), true);
eq("cyclic 2 pores rejects", res(wdCheck({ ...base, load:"cyclic", pj:"other", pn:2, pd:1/16 }), "Piping porosity (cyclic)"), false);
eq("cyclic 1/8 pore rejects", res(wdCheck({ ...base, load:"cyclic", pj:"other", pn:1, pd:1/8 }), "Piping porosity (cyclic)"), false);
eq("mm undercut 1 on 12 mm ok", res(wdCheck({ unit:"mm", load:"static", t:12, U:1 }), "Undercut"), true);
eq("mm undercut 1.5, 60 mm rejects", res(wdCheck({ unit:"mm", load:"static", t:12, U:1.5, Ulen:60 }), "Undercut"), false);
eq("mm porosity 10/25 ok", res(wdCheck({ unit:"mm", load:"static", pj:"other", p1:10, p12:20 }), "Piping porosity"), true);
eq("empty → no rows", wdCheck({ unit:"in", load:"static" }).length, 0);

eq("fmt", [wdFmt(5/32,"in"), wdFmt(1.5,"in"), wdFmt(0.01,"in"), wdFmt(2,"in"), wdFmt(2.5,"mm")], ["5/32 in","1-1/2 in","0.01 in","2 in","2.5 mm"]);
eq("fillet limit text", wdCheck({ unit:"in", load:"static", t:0.5, L:1/4, Lm:3/16, Lp:5 })[0].limit.indexOf("5/32 in") === 2, true);

/* Symbol reading */
const r1 = wdRead({ type:"fillet", side:"arrow", size:"1/4", len:"2", pitch:"6", all:false, field:true, tail:"GMAW" }).join(" ");
eq("read fillet", [/arrow side/.test(r1), /Leg size <strong>1\/4/.test(r1), /Intermittent/.test(r1), /Field weld/.test(r1)], [true, true, true, true]);
const r2 = wdRead({ type:"v", side:"both" }).join(" ");
eq("read double V CJP", [/Double V-groove/.test(r2), /complete joint penetration/.test(r2)], [true, true]);
eq("svg has text", /<text[^>]*>1\/4<\/text>/.test(wdSymbolSVG({ type:"fillet", side:"arrow", size:"1/4" })), true);
eq("svg escapes", /&lt;b&gt;/.test(wdSymbolSVG({ type:"fillet", side:"arrow", tail:"<b>" })), true);

if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " welding checks passed");
