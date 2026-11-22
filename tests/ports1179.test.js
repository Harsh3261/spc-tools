/* ISO 1179-1 BSPP port table. Expected values typed independently from Yuyao Jiayuan's
   ISO 1179-1 table (d2 ref, d3, d4 N, d4 W, L1 max, L2 min, L3 min), which agrees with
   the ISO 1179-1:2013 standard-text preview. Run: node tests/ports1179.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("var PT_1179 = ["), b = s.indexOf("/* END DATA PT_1179 */");
const PT_1179 = eval(s.slice(a + "var PT_1179 = ".length, b).trim().replace(/;$/, ""));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };
const J = {
  "G 1/8":[4.5,9.8,15,17.2,1,8.5,10.5], "G 1/4":[7.5,13.2,20,20.7,1.5,12.5,15.5], "G 3/8":[9,16.7,23,24.5,2,12.5,15.5],
  "G 1/2":[14,21,28,29.6,2.5,15,19], "G 3/4":[18,26.5,33,36.9,2.5,16.5,20.5], "G 1":[23,33.3,41,46.1,2.5,19,24],
  "G 1 1/4":[30,42,51,54,2.5,21.5,26.5], "G 1 1/2":[36,47.9,56,60.5,2.5,22.5,27.5] };
eq("sizes", PT_1179.map(r => r[0]), ["G 1/8","G 1/4","G 3/8","G 1/2","G 3/4","G 1","G 1 1/4","G 1 1/2","G 2"]);
eq("TPI", PT_1179.map(r => r[1]), [28,19,19,14,14,11,11,11,11]);
PT_1179.slice(0, 8).forEach(r => eq(r[0], [r[2], r[3], r[5], r[6], r[7], r[8], r[9]], J[r[0]]));
/* G 2: editions disagree on d4 -> not loaded; the rest agree */
const g2 = PT_1179[8]; eq("G 2 agreed cells", [g2[2], g2[3], g2[7], g2[8], g2[9]], [47, 59.7, 3, 26, 31]); eq("G 2 d4 held", [g2[5], g2[6]], [null, null]);
/* d3 tolerance only where two sources print it (164580: 21.2, 26.7) */
eq("d3 tol", PT_1179.map(r => r[4]), [null,null,null,0.2,0.2,null,null,null,null]);
/* structure: recess just above the ISO 228-1 major diameter; wide >= narrow; L3 > L2 */
const major = { "G 1/8":9.728, "G 1/4":13.157, "G 3/8":16.662, "G 1/2":20.955, "G 3/4":26.441, "G 1":33.249, "G 1 1/4":41.910, "G 1 1/2":47.803, "G 2":59.614 };
PT_1179.forEach(r => { n++; if (!(r[3] > major[r[0]] && r[3] - major[r[0]] < 0.4)) fails.push(r[0] + " d3 vs major");
  if (r[5] != null) { n++; if (!(r[6] >= r[5])) fails.push(r[0] + " W<N"); } n++; if (!(r[9] > r[8])) fails.push(r[0] + " L3<=L2"); });
if (fails.length) { console.log("FAIL\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " ISO 1179-1 port checks passed");
