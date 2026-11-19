/* The importer must work with other systems' names for things: an NCR log
   (CSV), an ERP quality-notification export (unit cost only) and monthly tabs
   with title rows above the header. Truth: tests/formats-expected.json.
   Run: NODE_PATH=<playwright-core dir> node tests/formats.e2e.js */
"use strict";
const { chromium } = require("playwright-core"), fs = require("fs"), path = require("path");
const EXP = JSON.parse(fs.readFileSync(path.join(__dirname, "formats-expected.json"), "utf8"));
let pass = 0, fail = 0; const ok = (c, l, x) => { if (c) pass++; else { fail++; console.log("FAIL", l, x === undefined ? "" : JSON.stringify(x)); } };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const pg = await b.newPage({ viewport: { width: 400, height: 860 }, locale: "en-US" });
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
  for (const [file, e] of Object.entries(EXP)) {
    await pg.goto("file://" + path.join(__dirname, "..", "index.html"));
    await pg.click("#clbtn-analyse"); await pg.$eval("#tabbtn-ncp", (x) => x.click());
    await pg.setInputFiles("#ncpFile", path.join(__dirname, file));
    await pg.waitForSelector("#ncpSetup:not(.hidden)", { timeout: 10000 }).catch(() => {});
    const msg = await pg.$eval("#ncpMsg", (m) => m.innerText);
    if (!(await pg.$("#ncpSetup:not(.hidden)"))) { ok(false, file + " not read", msg); continue; }
    const used = await pg.$$eval("#ncpSheets input:checked", (x) => x.length);
    if (e.sheets) ok(used === e.sheets, file + " data tabs only (Summary skipped)", used);
    const cols = await pg.$$eval("#ncpCols select", (s) => Object.fromEntries(s.map((x) => [x.dataset.field, x.options[x.selectedIndex].text])));
    await pg.click("#ncpGo"); await pg.waitForSelector("#ncpResults:not(.hidden)");
    const tiles = await pg.$$eval("#ncpTiles .stat", (t) => t.map((x) => x.innerText.split("\n").filter(Boolean)));
    const val = (re) => { const t = tiles.find((x) => re.test(x[0])); return t ? t[t.length - 1] : null; };
    ok(val(/^(ncps|ncrs|notifications|reports)$/i) === String(e.n), file + " count", [tiles, cols]);
    ok(new RegExp("^" + e.term + "s$", "i").test(tiles[0][0]), file + " uses the file's own word (" + e.term + ")", tiles[0][0]);
    ok(val(/^pieces$/i) === String(e.pieces), file + " pieces", [val(/^pieces$/i), e.pieces, cols]);
    const cost = val(/^cost$/i).replace(/[$,]/g, "");
    ok(Math.abs(+cost - (e.cost >= 10000 ? Math.round(e.cost) : e.cost)) < 0.006, file + " cost", [cost, e.cost, cols]);
    const bars = await pg.$$eval("#ncpOut h3", (hs) => { const h = hs.find((x) => /causes by cost/.test(x.textContent)); const svg = h.nextElementSibling.querySelector("svg"); return [...svg.querySelectorAll("text.qc-plab title")].map((t, i) => [t.textContent, svg.querySelectorAll("text.qc-val")[i].textContent]); });
    const want = Object.entries(e.byCause).sort((a, b) => b[1][1] - a[1][1]).map(([k, v]) => [k, "$" + v[1].toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })]);
    ok(JSON.stringify(bars) === JSON.stringify(want), file + " cause Pareto", [bars, want]);
    console.log(file, "→ columns:", JSON.stringify(cols));
  }
  /* changing a column by hand re-reads the data */
  await pg.goto("file://" + path.join(__dirname, "..", "index.html"));
  await pg.click("#clbtn-analyse"); await pg.$eval("#tabbtn-ncp", (x) => x.click());
  await pg.setInputFiles("#ncpFile", path.join(__dirname, "fmt-quality-notifications.xlsx")); await pg.waitForSelector("#ncpSetup:not(.hidden)");
  await pg.selectOption('#ncpCols select[data-field="cause"]', "defect code text"); await pg.click("#ncpGo");
  const one = await pg.$$eval("#ncpOut h3", (hs) => { const h = hs.find((x) => /causes by cost/.test(x.textContent)); return [...h.nextElementSibling.querySelectorAll("text.qc-plab title")].map((t) => t.textContent); });
  ok(one.length === 1 && one[0] === "Dimension out of tolerance", "manual column choice is used", one);
  ok(errs.length === 0, "no page errors", errs);
  console.log((fail ? "FAILED " : "OK ") + pass + " checks passed, " + fail + " failed");
  await b.close(); process.exit(fail ? 1 : 0);
})();
