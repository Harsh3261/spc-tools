/* UN thread data — internal-consistency relations from ASME B1.1 / B1.2.
   These hold no matter how the PD tolerance itself was derived, so a
   transcription slip in any one field shows up as a broken relation.
     B1.1: 2B PD tol = 1.30 × 2A PD tol; allowance = 0.300 × 2A PD tol;
           ext major max = D − allowance; ext PD max = basic PD − allowance;
           int PD min = basic PD; int major min = D; 2A major tol = 0.060·∛P²;
           int minor min = D − 1.082532 P (printed to 3 decimals).
     B1.2: GO plug PD = int PD min (+X); NOT GO plug PD = int PD max (−X);
           GO ring PD = ext PD max (−X); NOT GO ring = ext PD min (+X);
           setting plug nominals = ext PD max / min; GO plug major min = D.
   Known, documented exception: 3/8-24 UNF NOT GO plug sits on the B1.2
   gage-chart basis (decision D16), not B1.1's int PD max.
   Run: node tests/threads.test.js */
const fs = require("fs");
const path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function grab(name) {
  const i = s.indexOf("var " + name + " = ");
  if (i < 0) throw new Error("missing " + name);
  const st = i + ("var " + name + " = ").length;
  const end = s[st] === "{" ? s.indexOf("};", st) + 1 : s.indexOf("];", st) + 1;
  return eval("(" + s.slice(st, end) + ")");
}

const rows = grab("TH_U").concat(grab("TH_U_ADD"));
const G = grab("TH_G");
const near = (a, b, t) => Math.abs(a - b) <= t;
const fails = [];
let checks = 0;
function check(label, ok, detail) { checks++; if (!ok) fails.push(label + ": " + detail); }

const U = {};
rows.forEach(r => {
  const [lab, D, tpi, , al, eMaj, eMajMin, ePd, ePdMin, eMinMax, iMajMin, iPd, iPdMax, iMinMin, iMinMax] = r;
  U[lab] = r;
  const P = 1 / tpi, E = D - 0.649519 * P, t2a = ePd - ePdMin, t2b = iPdMax - iPd;
  check(lab + " 2B = 1.3 × 2A", near(t2b, 1.3 * t2a, 0.00021), t2a.toFixed(4) + " / " + t2b.toFixed(4));
  check(lab + " allowance = 0.3 × 2A", near(al, 0.3 * t2a, 0.00011), al + " vs " + (0.3 * t2a).toFixed(5));
  check(lab + " ext major max = D − allowance", near(eMaj, D - al, 0.00006), eMaj + " vs " + (D - al).toFixed(4));
  check(lab + " ext PD max = E − allowance", near(ePd, E - al, 0.00011), ePd + " vs " + (E - al).toFixed(4));
  check(lab + " int PD min = E", near(iPd, E, 0.00006), iPd + " vs " + E.toFixed(4));
  check(lab + " int major min = D", iMajMin === D, iMajMin + " vs " + D);
  check(lab + " major tol = 0.060·∛P²", near(eMaj - eMajMin, 0.06 * Math.cbrt(P * P), 0.00011), (eMaj - eMajMin).toFixed(4));
  check(lab + " int minor min = D − 1.082532P", near(iMinMin, D - 1.082532 * P, 0.0006), iMinMin + " vs " + (D - 1.082532 * P).toFixed(4));
  check(lab + " limits in order", eMajMin < eMaj && ePdMin < ePd && iPd < iPdMax && iMinMin < iMinMax && ePd <= iPd && eMinMax < ePdMin, "order");
});

Object.keys(G).forEach(k => {
  const g = G[k], u = U[k];
  check(k + " has product row", !!u, "missing");
  if (!u) return;
  const D = u[1], ePd = u[7], ePdMin = u[8], iPd = u[11], iPdMax = u[12], x = g.x, t = 0.00006;
  check(k + " GO plug PD", near(g.goP[0], iPd, t) && near(g.goP[1], iPd + x, t), JSON.stringify(g.goP));
  if (k !== "3/8-24 UNF") check(k + " NOT GO plug PD", near(g.ngP[1], iPdMax, t) && near(g.ngP[0], iPdMax - x, t), JSON.stringify(g.ngP));
  check(k + " GO ring PD", near(g.goR[1], ePd, t) && near(g.goR[0], ePd - x, t), JSON.stringify(g.goR));
  check(k + " NOT GO ring PD", near(g.ngR[0], ePdMin, t) && near(g.ngR[1], ePdMin + x, t), JSON.stringify(g.ngR));
  check(k + " setting plugs", near(g.setGo, ePd, t) && near(g.setLo, ePdMin, t), g.setGo + "/" + g.setLo);
  check(k + " GO plug major min = D", near(g.goM[0], D, t), JSON.stringify(g.goM));
});

if (fails.length) { console.log("FAIL " + fails.length + " of " + checks + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + checks + " thread-relation checks passed (" + rows.length + " UN rows, " + Object.keys(G).length + " gauge entries)");
