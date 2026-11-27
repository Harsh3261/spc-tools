/* Any-size UN gauges (ASME B1.2) — 2026-11-26.
   1. TH_X cells typed from NBS H28 Table 6.8 = Thread Check catalogue p.52 (spot rows).
   2. The general calculator (mgUNCalc) must reproduce the verified per-size data: TH_G (2A/2B plugs, rings, plug majors,
      setting-plug nominals, X) and TH_U3 (3A/3B PD limits) for all 28 catalogue sizes — except the documented
      3/8-24 UNF NOT GO plug (D16, B1.2 gage-chart basis).
   3. 9-1/2-12 UN worked by hand from the B1.1 formulas and B1.2 rules (see MUSE-NOTE 2026-11-26).
   Serve the repo (python3 -m http.server 8766), then NODE_PATH=/opt/npm-tools/node_modules node tests/ungauge.e2e.js */
const { chromium } = require("playwright");
(async () => {
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on("pageerror", e => errs.push(String(e)));
let fail = 0, n = 0; const chk = (c, m) => { n++; if (!c) { fail++; console.log("FAIL", m); } };
const URL = process.env.URL || "http://localhost:8766/";
await pg.goto(URL); await pg.waitForTimeout(600);

// 1 · X table spot cells (TPI, D) -> [pd, maj, lead, half]
const X = [[12, 9.5, .0008, .0009, .0003, 10], [12, 0.5, .0003, .0006, .0003, 10], [12, 3, .0004, .0006, .0003, 10], [12, 6, .0006, .0009, .0003, 10],
  [20, 10, .0006, .0007, .0003, 15], [18, 2, .0004, .0005, .0003, 10], [8, 5, .0006, .0011, .0004, 5], [6, 10, .0008, .0013, .0004, 5],
  [40, 0.25, .0002, .0004, .0002, 20], [80, 0.06, .0002, .0003, .0002, 30], [9, 1, .0003, .0007, .0003, 10], [32, 9, .0006, .0007, .0003, 15]];
for (const [t, d, pd, mj, ld, hf] of X) { const x = await pg.evaluate(([d, t]) => mgX(d, t), [d, t]); chk(x && x.pd === pd && x.maj === mj && x.lead === ld && x.half === hf, `X ${t} TPI @ ${d}: ${JSON.stringify(x)}`); }
chk((await pg.evaluate(() => mgX(24, 12))).pd === 0.0016, "above 12 in scales by D/12");
chk((await pg.evaluate(() => mgX(5, 5))).pd === null, "5 TPI PD band is a named gap");

// 2a · B1.2 placement rule on the printed B1.1 product limits (TH_U, TH_U3) must reproduce TH_G exactly
const r = await pg.evaluate(() => {
  const out = []; const eq = (a, b) => a != null && b != null && Math.abs(a - b) < 5e-6;
  const rows = {}; thUAll().forEach(q => rows[q[0]] = q);
  Object.keys(TH_G).forEach(k => {
    const g = TH_G[k], q = rows[k];
    const c = mgUNPlace(q[1], q[2], { maj:[q[6], q[5]], pd:[q[8], q[7]] }, { pd:[q[11], q[12]], majMin:q[10] }, mgX(q[1], q[2]));
    [["x", [c.x], [g.x]], ["goP", c.goP, g.goP], ["ngP", c.ngP, g.ngP], ["goR", c.goR, g.goR], ["ngR", c.ngR, g.ngR], ["goM", c.goM, g.goM], ["ngM", c.ngM, g.ngM], ["setGo", [c.setGo], [g.setGo]], ["setLo", [c.setLo], [g.setLo]]]
      .forEach(([f, a, e]) => { if (!e) return; out.push([k, f, e.every((v, i) => eq(a[i], v)), JSON.stringify(a), JSON.stringify(e)]); });
  });
  return out;
});
let reproduced = 0;
for (const [k, f, ok, a, e] of r) { chk(ok, `${k} ${f}: rule ${a} vs data ${e}`); if (ok) reproduced++; }
console.log("placement rule reproduced", reproduced, "of", r.length, "TH_G cells");

// 2b · formula path (thCustomUN, used for specials) against the printed B1.1 rows, by length-of-engagement regime:
//      LE = D series ≤ 0.0001 in; 9-pitch regime ≤ 0.0002 in; the known weak group (12-UN ≤ 1-1/2, 16-UN < 1) is flagged in the UI.
const dev = await pg.evaluate(() => { const m = { D:0, p9:0, weak:0 }, r4 = v => Math.round(v * 1e4) / 1e4;
  thUAll().forEach(q => { const D = q[1], T = q[2], c = thCustomUN(D, T, q[3]); const g = (q[3] === "12-UN" && D <= 1.5) || (q[3] === "16-UN" && D < 1) ? "weak" : c.leBasis === "9p" ? "p9" : "D";
    [[c.extMajor[1], q[5]], [c.extMajor[0], q[6]], [c.extPd[1], q[7]], [c.extPd[0], q[8]], [c.intPd[0], q[11]], [c.intPd[1], q[12]]].forEach(([a, b]) => m[g] = Math.max(m[g], Math.abs(r4(a) - b))); }); return m; });
chk(dev.D <= 0.00011 && dev.p9 <= 0.00021, "formula deviation " + JSON.stringify(dev));
console.log("formula vs B1.1 tables, max deviation:", JSON.stringify(dev));
// catalogue sizes use the table limits: 1/2-13 via the calculator = TH_G exactly
const cat = await pg.evaluate(() => { const c = mgUNCalc(0.5, 13, "auto", "2"), g = TH_G["1/2-13 UNC"]; return { t:c.table, ok:JSON.stringify([c.goR, c.ngR, c.goP, c.ngP]) === JSON.stringify([g.goR, g.ngR, g.goP, g.ngP]), c:c.goR }; });
chk(cat.t && cat.ok, "catalogue path " + JSON.stringify(cat));
chk((await pg.evaluate(() => mgUNCalc(1.2, 12, "auto", "2"))).weak === true, "1.2-12 flagged weak");

// 3 · 9-1/2-12 UN, 2A/2B — hand values
const u = await pg.evaluate(() => mgUNCalc(9.5, 12, "auto", "2"));
const want = { goR: [9.4429, 9.4437], ngR: [9.4363, 9.4371], goP: [9.4459, 9.4467], ngP: [9.4546, 9.4554], goM: [9.5, 9.5009], ngM: [9.4906, 9.4915] };
for (const k in want) chk(JSON.stringify(u[k]) === JSON.stringify(want[k]), `9-1/2-12 ${k}: ${JSON.stringify(u[k])}`);
chk(u.size === "9-1/2-12 UN" && u.series === "12-UN", "label " + u.size + " " + u.series);
chk(JSON.stringify(u.sp.go.pd) === "[9.4433,9.4437]" && JSON.stringify(u.sp.lo.pd) === "[9.4363,9.4367]", "setting plug PD " + JSON.stringify([u.sp.go.pd, u.sp.lo.pd]));
chk(JSON.stringify(u.sp.go.full) === "[9.4978,9.4987]" && JSON.stringify(u.sp.go.trunc) === "[9.484,9.4849]" && JSON.stringify(u.sp.lo.trunc) === "[9.4715,9.4724]", "setting plug majors " + JSON.stringify(u.sp));

// 4 · UI: search "9-1/2-12" -> custom UN -> Gauge link -> Thread masters shows the rings
await pg.evaluate(() => showTool("threads"));
for (const q of ["9-1/2-12", "9 1/2-12", "9.5-12", "9-1/2-12 internal"]) { await pg.fill("#thSearch", ""); await pg.fill("#thSearch", q); await pg.waitForTimeout(120);
  const t = await pg.$eval("#thSearchRes", e => e.innerText); chk(/9-1\/2-12 UN/.test(t) && /calculated/.test(t), q + " -> " + t.slice(0, 120)); }
await pg.click("#thSearchRes button"); await pg.waitForTimeout(150);
const st = await pg.evaluate(() => ({ fam: thFam(), side: document.querySelector("#thSide").value, out: document.querySelector("#thMfg").innerText }));
chk(st.fam === "un" && st.side === "int" && /9\.4459/.test(st.out) && /9\.4554/.test(st.out), "9-1/2-12 internal -> " + JSON.stringify(st).slice(0, 200));
await pg.click("#thSegGauge"); await pg.waitForTimeout(120);
await pg.click("#thGauge a.ghostlink"); await pg.waitForTimeout(400);
const mg = await pg.$eval("#mgOut", e => e.innerText);
chk(/Calculated — not a catalogue size/.test(mg) && /9\.4429/.test(mg) && /9\.4437/.test(mg) && /9\.4363/.test(mg) && /9\.4371/.test(mg) && /9\.4546/.test(mg), "Thread masters custom view: " + mg.slice(0, 300));
await pg.selectOption("#mgUCls", "3"); await pg.waitForTimeout(150);
chk(/3A/.test(await pg.$eval("#mgOut", e => e.innerText)), "class 3 renders");
await pg.fill("#mgUD", ""); await pg.fill("#mgUD", "5"); await pg.fill("#mgUT", "5"); await pg.waitForTimeout(150);
chk(/named gap/i.test(await pg.$eval("#mgOut", e => e.innerText)), "5-5 shows the named gap");

chk(errs.length === 0, "page errors: " + errs.join(" | "));
console.log(fail ? fail + " of " + n + " FAILED" : "OK " + n + " UN gauge checks passed");
await b.close(); process.exit(fail ? 1 : 0);
})();
