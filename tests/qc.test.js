/* Verification for the Attribute-chart, Short-run and Cpk-bound maths.
   Run:  node tests/qc.test.js            (checks the block shipped in index.html)
         node tests/qc.test.js ref.json   (also checks an extra reference file)
   The QC block is extracted verbatim from index.html, so the tested code is
   the shipped code. Textbook values: D. C. Montgomery, Introduction to
   Statistical Quality Control (examples cited per test). Reference values in
   tests/qc-reference.json were generated independently with numpy/scipy. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const m = html.match(/\/\* @@QC-CALC BEGIN[\s\S]*?\/\* @@QC-CALC END \*\//);
if (!m) { console.error("QC block not found in index.html"); process.exit(1); }
const ctx = {}; vm.createContext(ctx); vm.runInContext(m[0] + "\nthis.QC = QC;", ctx);
const QC = ctx.QC;

let pass = 0, fail = 0;
function near(a, b, tol, label) {
  const ok = Math.abs(a - b) <= tol;
  if (ok) pass++; else { fail++; console.log("FAIL", label, "got", a, "expected", b, "tol", tol); }
}
function same(a, b, label) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  if (ok) pass++; else { fail++; console.log("FAIL", label, "got", JSON.stringify(a), "expected", JSON.stringify(b)); }
}

/* --- Montgomery Example 7.1: orange-juice cans, p chart, 30 samples of n = 50.
       p̄ = 347/1500 = 0.2313, UCL 0.4102, LCL 0.0524; samples 15 and 23 out. --- */
{
  const x = [12,15,8,10,4,7,16,9,14,10,5,6,17,12,22,8,10,5,13,11,20,18,24,15,9,12,7,13,9,6];
  const r = QC.attr("p", x, x.map(() => 50), "standard");
  near(r.centre, 0.2313, 0.00005, "Ex7.1 pbar");
  near(r.points[0].ucl, 0.4102, 0.00005, "Ex7.1 UCL");
  near(r.points[0].lcl, 0.0524, 0.00005, "Ex7.1 LCL");
  same(r.signals, [15, 23], "Ex7.1 signals");
  const np = QC.attr("np", x, x.map(() => 50), "standard");
  near(np.centre, 11.567, 0.001, "Ex7.1 np centre");
  same(np.signals, [15, 23], "Ex7.1 np signals");
}
/* --- Montgomery Example 7.3: circuit boards, c chart, 26 samples.
       c̄ = 516/26 = 19.85, UCL 33.22, LCL 6.48; samples 6 and 20 out. --- */
{
  const x = [21,24,16,12,15,5,28,20,31,25,20,24,16,19,10,17,13,22,18,39,30,24,16,19,17,15];
  const r = QC.attr("c", x, null, "standard");
  near(r.centre, 19.846, 0.001, "Ex7.3 cbar");
  /* the book rounds c̄ to 19.85 first (19.85 + 3√19.85 = 33.22); unrounded 33.211 */
  near(r.points[0].ucl, 33.22, 0.01, "Ex7.3 UCL");
  near(r.points[0].lcl, 6.48, 0.005, "Ex7.3 LCL");
  same(r.signals, [6, 20], "Ex7.3 signals");
}
/* --- Montgomery Example 7.4: personal computers, u chart, 20 samples of
       5 units. ū = 193/100 = 1.93, UCL 3.79, LCL 0.07. --- */
{
  const x = [10,12,8,14,10,16,11,7,10,15,9,5,7,11,12,6,8,10,7,5];
  const r = QC.attr("u", x, x.map(() => 5), "standard");
  near(r.centre, 1.93, 1e-9, "Ex7.4 ubar");
  near(r.points[0].ucl, 3.79, 0.005, "Ex7.4 UCL");
  near(r.points[0].lcl, 0.07, 0.005, "Ex7.4 LCL");
  same(r.signals, [], "Ex7.4 signals");
}
/* --- Bissell interval, Montgomery Example 8.5: n = 20, Cpk = 1.33,
       95% two-sided interval 0.88 to 1.78. --- */
{
  const b = QC.cpkBound(1.33, 20, 0.95, "two");
  near(b[0], 0.88, 0.005, "Ex8.5 lower"); near(b[1], 1.78, 0.005, "Ex8.5 upper");
}
/* --- Laney with σz = 1 reproduces the standard chart --- */
{
  const x = [21,24,16,12,15,5,28,20,31,25,20,24,16,19,10,17,13,22,18,39,30,24,16,19,17,15];
  const s = QC.attr("c", x, null, "standard"), l = QC.attr("c", x, null, "laney");
  near(l.points[0].ucl - l.centre, (s.points[0].ucl - s.centre) * l.sigmaZ, 1e-9, "Laney scales by sigmaZ");
  /* for a c chart, Laney limits equal XmR limits on the counts */
  const st = QC.imr(x);
  near(l.points[0].ucl, st.ucl, 1e-9, "Laney c' = XmR UCL");
}
/* --- Auto limits: the textbook c-chart data (two known special causes)
       must stay on standard limits; a batch-loss pattern must switch. --- */
{
  const tb = [21,24,16,12,15,5,28,20,31,25,20,24,16,19,10,17,13,22,18,39,30,24,16,19,17,15];
  const o = QC.overdispersion("c", tb, null);
  same([o.flag, o.excluded], [false, [6, 20]], "Ex7.3 not over-dispersed once special causes are set aside");
  const batch = [8,15,3,22,6,11,2,18,9,4,25,7,13,5,19,10,3,16,8,12]; // clumped counts (each event scraps a batch)
  same(QC.overdispersion("c", batch, null).flag, true, "batch losses are over-dispersed");
}
/* --- PRE-Control rule sequences (spec 10.00–10.40: green 10.10–10.30) --- */
{
  const z = (v) => QC.pcZone(v, 10, 10.4);
  same([z(9.99), z(10.05), z(10.2), z(10.35), z(10.41)], ["red-lo","yellow-lo","green","yellow-hi","red-hi"], "zones");
  same([z(10.1), z(10.3)], ["green","green"], "zone edges are green");
  let r = QC.preControlSetup(10, 10.4, [10.2,10.2,10.2,10.2,10.2,10.39]);
  same([r.approvedAt, r.ignored], [5, 1], "5 greens approve");
  r = QC.preControlSetup(10, 10.4, [10.2,10.2,10.35,10.2,10.2,10.2,10.2,10.2]);
  same(r.approvedAt, 8, "yellow restarts count");
  r = QC.preControlSetup(10, 10.4, [10.35,10.36]);
  same(r.steps[1].cls, "warn", "two yellows same side = adjust");
  r = QC.preControlSetup(10, 10.4, [10.05,10.36]);
  same(r.steps[1].cls, "bad", "two yellows opposite = reduce variation");
  r = QC.preControlSetup(10, 10.4, [10.2,10.5]);
  same([r.steps[1].cls, r.approvedAt], ["bad", null], "red stops");
  const run = QC.preControlRun(10, 10.4, [[10.2,10.35],[10.35,10.36],[10.05,10.36],[10.2,10.45]]);
  same(run.map((s) => s.cls), ["good","warn","bad","bad"], "running pairs");
}
/* --- Predictor sanity: σ = tol/8 gives Cp = Cpk = 1.333 and 63 ppm --- */
{
  const p = QC.predict(0.01, 0, 0.08, 0);
  near(p.cp, 4/3, 1e-12, "pred cp"); near(p.cpk, 4/3, 1e-12, "pred cpk"); near(p.ppm, 63.342, 0.01, "pred ppm");
  near(QC.nForCpk(1.33, 1.33, 0.95) === null ? 1 : 0, 1, 0, "nForCpk needs cpk above target");
}

/* --- independent numpy/scipy reference cases --- */
const refFiles = [path.join(__dirname, "qc-reference.json")].concat(process.argv.slice(2));
for (const f of refFiles) {
  if (!fs.existsSync(f)) continue;
  const cases = JSON.parse(fs.readFileSync(f, "utf8"));
  cases.forEach((c, ci) => {
    const tag = path.basename(f) + "#" + ci + " " + c.kind;
    if (c.kind === "attr") {
      const r = QC.attr(c.type, c.x, c.n, c.limits);
      if (r.error) { fail++; console.log("FAIL", tag, r.error); return; }
      near(r.centre, c.exp.centre, 1e-9, tag + " centre");
      r.points.forEach((p, i) => { near(p.ucl, c.exp.ucl[i], 1e-9, tag + " ucl" + i); near(p.lcl, c.exp.lcl[i], 1e-9, tag + " lcl" + i); });
      near(r.sigmaZ, c.exp.sigmaZ, 1e-9, tag + " sigmaZ");
      near(r.pearson, c.exp.pearson, 1e-7, tag + " pearson");
      near(r.pOver, c.exp.pOver, 1e-6, tag + " pOver");
      same(r.signals, c.exp.signals, tag + " signals");
    } else if (c.kind === "short") {
      const r = QC.shortRun(c.rows, c.mode);
      ["mean","sdW","ucl","lcl"].forEach((k) => near(r.st[k], c.exp[k], 1e-9, tag + " " + k));
      if (c.exp.cpk !== undefined) near(r.cap.cpk, c.exp.cpk, 1e-9, tag + " cpk");
    } else if (c.kind === "pred") {
      const r = QC.predict(c.sigma, c.lsl, c.usl, c.offset);
      near(r.cp, c.exp.cp, 1e-9, tag + " cp"); near(r.cpk, c.exp.cpk, 1e-9, tag + " cpk");
      near(r.ppm, c.exp.ppm, Math.max(0.01, c.exp.ppm * 2e-6), tag + " ppm");
    } else if (c.kind === "cpk") {
      near(QC.cpkBound(c.cpk, c.n, 0.95, "lower"), c.exp.lower95, 1e-6, tag + " lower95");
      const t = QC.cpkBound(c.cpk, c.n, 0.95, "two");
      near(t[0], c.exp.two95[0], 1e-4, tag + " two lo"); near(t[1], c.exp.two95[1], 1e-4, tag + " two hi");
    } else if (c.kind === "chi2") {
      near(QC._chi2Upper(c.x, c.df), c.exp, 1e-8, tag);
    }
  });
}
console.log((fail ? "FAILED " : "OK ") + pass + " checks passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
