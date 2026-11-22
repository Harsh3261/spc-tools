/* DIN 405 internal minor diameter (6H) = D1 basic + TD1 grade 6, per IS 4695-2:2003 cl. 8.1
   (= EMUGE §15.15): 2.540 → 0.450, 3.175 → 0.530, 4.233 → 0.630, 6.350 → 0.850. Run: node tests/din405.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("var TH_RD405 = "), b = s.indexOf("/* END DATA TH_RD405");
const T = JSON.parse(s.slice(a + 15, b).trim().replace(/;$/, ""));
const TD1 = { "2.540":0.45, "3.175":0.53, "4.233":0.63, "6.350":0.85 };
let n = 0; const fails = [];
T.forEach(r => { const d1 = r.int[2]; n++;
  if (d1[1] == null || Math.abs(d1[1] - d1[0] - TD1[r.nom[0]]) > 1e-6) fails.push(r.label + " TD1 " + (d1[1] - d1[0]));
  n++; if (Math.abs(d1[0] - parseFloat(r.nom[4])) > 1e-6) fails.push(r.label + " D1 min vs basic"); });
if (fails.length) { console.log("FAIL\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " DIN 405 internal minor checks passed (64 sizes)");
