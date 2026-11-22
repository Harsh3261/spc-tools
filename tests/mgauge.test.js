/* ISO 1502 thread gauges and check plugs. Run: node tests/mgauge.test.js
   Expected values are typed from published certificates and ISO 6698, not from the code. */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const g = (a, b) => s.slice(s.indexOf(a), s.indexOf(b, s.indexOf(a)));
const src = g("/* BEGIN DATA TH965:", "/* Length-of-engagement basis") + g("/* BEGIN DATA MG:", "(function(){\n        var el = function(id){ return document.getElementById(id); };\n        if(!el(\"mgD\"))");
eval(src.replace(/var (TH965_\w+|MG_\w+)/g, "global.$1").replace(/function (th965\w*|mg\w+)\(/g, "global.$1 = function("));
let n = 0; const fails = [];
const near = (l, got, exp, tol = 1e-9) => { n++; if (!(Math.abs(got - exp) <= tol)) fails.push(l + ": " + got + " vs " + exp); };
const eq = (l, got, exp) => { n++; if (JSON.stringify(got) !== JSON.stringify(exp)) fails.push(l + ": " + JSON.stringify(got) + " vs " + JSON.stringify(exp)); };
/* Table 4 rows (GB/T 3934 = IS 2334) */
eq("bands", MG_BANDS.map(b => b.slice(0, 8)), [[24,50,8,6,6,10,-4,0],[50,80,10,7,7,12,-2,2],[80,125,14,9,8,15,2,6],[125,200,18,11,9,18,8,12],[200,315,23,14,12,22,12,16],[315,500,30,18,15,27,20,24],[500,670,38,22,18,33,28,32]]);
eq("band 125 → 80–125", mgBand(125).lo, 80); eq("band 132 → 125–200", mgBand(132).lo, 125); eq("band 23 none", mgBand(23), null);
/* RP-Kalibrierlabor certificate, M10×1.5-6G plug: GO 9.0645–9.0755 worn 9.0525; NOGO 9.2380–9.2490 worn 9.2320 */
let r = mgCalc(10, 1.5, "6G");
near("RP GO lo", r.plug.go.lo, 9.0645); near("RP GO hi", r.plug.go.hi, 9.0755); near("RP GO wear", r.plug.go.wear, 9.0525);
near("RP NG lo", r.plug.ng.lo, 9.238); near("RP NG hi", r.plug.ng.hi, 9.249); near("RP NG wear", r.plug.ng.wear, 9.232);
/* Stille certificate, M45×2-6G plug: GO 43.748–43.762 worn 43.734; NOGO 43.963–43.977 worn 43.955 */
r = mgCalc(45, 2, "6G");
near("St GO lo", r.plug.go.lo, 43.748); near("St GO hi", r.plug.go.hi, 43.762); near("St GO wear", r.plug.go.wear, 43.734);
near("St NG lo", r.plug.ng.lo, 43.963); near("St NG hi", r.plug.ng.hi, 43.977); near("St NG wear", r.plug.ng.wear, 43.955);
/* Haas M10×1.5-6g GO ring: ±0.009 (TR 18) */
r = mgCalc(10, 1.5, "6g"); near("Haas TR", r.ring.go.hi - r.ring.go.lo, 0.018, 1e-9);
/* ISO 6698:1981 Table 4, hub 1.375-24 6g: d2 max 34.212, Td2 125 µm (band 80–125) */
const h = mgRing(34.212, 125, mgBand(125));
near("hub GO ring hi", h.go.hi, 34.217); near("hub GO ring lo", h.go.lo, 34.203);
near("hub TT hi", h.TT.hi, 34.199); near("hub TT lo", h.TT.lo, 34.191);
near("hub TZ lo", h.TZ.lo, 34.213); near("hub TZ hi", h.TZ.hi, 34.221);
near("hub TS lo", h.TS.lo, 34.222); near("hub TS hi", h.TS.hi, 34.230);
near("hub setting GO mid", h.setGo.mid, 34.210);
near("hub ZT lo", h.ZT.lo, 34.061); near("hub ZZ lo", h.ZZ.lo, 34.083); near("hub ZS lo", h.ZS.lo, 34.088);
/* M10×1.5-6g full set, hand-calculated */
r = mgCalc(10, 1.5, "6g").ring;
near("GO ring", r.go.lo, 8.977); near("GO ring hi", r.go.hi, 8.995); near("GO ring wear", r.go.wear, 9.007);
near("NG ring", r.ng.lo, 8.844); near("NG ring hi", r.ng.hi, 8.862); near("NG ring wear", r.ng.wear, 8.868);
near("TT", r.TT.mid, 8.968); near("TZ", r.TZ.mid, 8.995); near("TS", r.TS.mid, 9.007);
near("ZT", r.ZT.mid, 8.835); near("ZZ", r.ZZ.mid, 8.862); near("ZS", r.ZS.mid, 8.868);
/* coarser grade uses the grade 6 row but its own limits; finer grade refused */
r = mgCalc(10, 1.5, "8g"); eq("8g uses grade-6 band", r.band.lo, 125); near("8g NOGO ring upper = d2 min", r.ring.ng.hi, r.t.pd[0]);
eq("4h refused", /finer than grade 6/.test(mgCalc(10, 1.5, "4h").error), true);
/* three-wire */
near("best wire 1.5", mgWire(1.5).best, 0.866); near("E", mgWire(1.5, 0.866, 10.0).E, 10 - 2.598 + 1.2990);
if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " ISO 1502 gauge checks passed");
