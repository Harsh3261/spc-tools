/* End-to-end check of the Scrap / NCP report in a real browser, against the
   made-up workbook tests/ncp-fixture.xlsx and its independently computed
   totals (tests/ncp-fixture-expected.json, from make_ncp_fixture.py).
   Run: NODE_PATH=<dir with playwright-core> CHROME=/path/to/chrome node tests/ncp.e2e.js */
"use strict";
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), EXP = JSON.parse(fs.readFileSync(path.join(__dirname, "ncp-fixture-expected.json"), "utf8"));
let pass = 0, fail = 0;
const ok = (c, label, extra) => { if (c) pass++; else { fail++; console.log("FAIL", label, extra === undefined ? "" : JSON.stringify(extra)); } };
const money = (x) => "$" + Number(x).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, acceptDownloads: true, locale: "en-US" });
  const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
  const open = async () => {
    await pg.goto("file://" + path.join(ROOT, "index.html"));
    await pg.click("#clbtn-analyse"); await pg.click("#toolPicker"); await pg.waitForTimeout(250); await pg.click("#tabbtn-ncp"); await pg.waitForTimeout(250);
  };
  const tile = async (name) => pg.$$eval("#ncpTiles .stat", (els, n) => { const e = els.find((x) => x.innerText.toLowerCase().includes(n.toLowerCase())); return e ? e.innerText.split("\n").filter(Boolean) : null; }, name);
  const tileVal = async (name) => { const t = await tile(name); return t ? t.find((s) => /[0-9]/.test(s)) : null; };
  const csvRows = async (btn) => { const [dl] = await Promise.all([pg.waitForEvent("download"), pg.click(btn)]); const p = await dl.path(); return fs.readFileSync(p, "utf8").trim().split("\n").map((l) => l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'))); };

  await open();
  await pg.setInputFiles("#ncpFile", path.join(__dirname, "ncp-fixture.xlsx"));
  await pg.waitForSelector("#ncpSetup:not(.hidden)");
  /* sheets: every week tab ticked, TREND skipped */
  const sheets = await pg.$$eval("#ncpSheets input", (els) => els.map((e) => ({ s: e.getAttribute("data-sheet"), on: e.checked, dis: e.disabled })));
  ok(sheets.filter((s) => s.on).map((s) => s.s).join() === EXP.sheets.join(), "all week tabs selected in workbook order", sheets);
  ok(sheets.some((s) => s.s === "TREND" && s.dis), "TREND tab skipped");
  ok(await pg.$eval("#ncpPeriod", (e) => e.value) === "sheet", "multi-tab workbook defaults to one period per sheet");
  /* the typo pair is offered for merging; the case/space variant needed no question */
  const merges = await pg.$$eval("#ncpMerge .ncpmerge", (els) => els.map((e) => e.textContent));
  ok(merges.length === 1 && /Incorret Offset/.test(merges[0]) && /Incorrect Offset/.test(merges[0]), "typo offered as one merge", merges);
  /* choose the correct spelling */
  await pg.$eval("#ncpMerge select", (s) => { const o = [...s.options].find((x) => /call it "Incorrect/.test(x.text)); s.value = o.value; });

  await pg.click("#ncpGo"); await pg.waitForSelector("#ncpResults:not(.hidden)");
  ok(await tileVal("NCPs") === String(EXP.ncps), "NCP total", await tile("NCPs"));
  ok(await tileVal("Pieces") === String(EXP.pieces), "pieces total", await tile("Pieces"));
  ok(await tileVal("Cost") === "$" + Math.round(EXP.cost).toLocaleString("en-US"), "cost total", await tile("Cost"));
  ok(await tileVal("Periods") === String(EXP.sheets.length), "periods incl. the zero week");
  const checks = await pg.$eval("#ncpChecks", (e) => e.innerText);
  ok(/1 duplicate NCP number/.test(checks), "duplicate reported", checks);
  ok(EXP.shifted.every((id) => checks.includes(id)) && /2 rows had shifted columns/.test(checks), "shifted rows fixed and named", checks);
  ok(/TREND/.test(checks), "skipped TREND named");

  /* totals by period and cause = the hand-typed summary, computed */
  const rows = await csvRows("#ncpCsvP");
  let seen = 0;
  rows.slice(1).forEach((r) => {
    if (r[0] === "Total") { ok(+r[2] === EXP.ncps && +r[3] === EXP.pieces && Math.abs(+r[4] - EXP.cost) < 0.005, "CSV grand total", r); return; }
    if (r[1] === "(period total)") { const e = EXP.bySheet[r[0]]; ok(e ? (+r[2] === e.ncps && +r[3] === e.pieces && Math.abs(+r[4] - e.cost) < 0.005) : +r[2] === 0, "period total " + r[0], [r, e]); return; }
    const e = EXP.bySheetCause[r[0] + "|" + r[1]]; seen++;
    ok(!!e && +r[2] === e.ncps && +r[3] === e.pieces && Math.abs(+r[4] - e.cost) < 0.005, "period×cause " + r[0] + " / " + r[1], [r, e]);
  });
  ok(seen === Object.keys(EXP.bySheetCause).length, "every period×cause line present", [seen, Object.keys(EXP.bySheetCause).length]);

  /* Paretos read back from the drawn charts */
  const par = await pg.$$eval("#ncpOut h3", (hs) => hs.map((h) => { const svg = h.nextElementSibling && h.nextElementSibling.querySelector("svg"); return { t: h.textContent, labels: svg ? [...svg.querySelectorAll("text.qc-ax title")].map((x) => x.textContent) : [], vals: svg ? [...svg.querySelectorAll("text.qc-val")].map((x) => x.textContent) : [] }; }));
  const pm = par.find((p) => /machines/.test(p.t));
  const expM = Object.entries(EXP.byMachine).sort((a, b) => b[1].cost - a[1].cost);
  ok(pm && pm.labels.join() === expM.map((x) => x[0]).join() && pm.vals.join() === expM.map((x) => money(x[1].cost)).join(), "machine Pareto (quoted names and spellings merged)", [pm, expM]);
  const pc = par.find((p) => /causes by cost/.test(p.t));
  const expC = Object.entries(EXP.byCause).sort((a, b) => b[1].cost - a[1].cost);
  ok(pc && pc.labels.join() === expC.map((x) => x[0]).join() && pc.vals.join() === expC.map((x) => money(x[1].cost)).join(), "cause Pareto by cost", [pc, expC]);
  const pn = par.find((p) => /number of NCPs/.test(p.t));
  ok(pn && pn.vals.map(Number).reduce((s, v) => s + v, 0) === EXP.ncps, "cause Pareto by count adds to total");
  const pp = par.find((p) => /part numbers/.test(p.t));
  const expP = Object.entries(EXP.byPart).sort((a, b) => b[1].cost - a[1].cost);
  ok(pp && pp.vals.join() === expP.map((x) => money(x[1].cost)).join(), "part Pareto by cost", [pp, expP]);
  ok(par.filter((p) => /per period/.test(p.t)).length === 3, "three period charts drawn");

  /* chart choice: untick all but the table */
  await pg.$$eval("#ncpCharts input", (els) => els.forEach((e) => { e.checked = e.getAttribute("data-chart") === "table"; e.dispatchEvent(new Event("change", { bubbles: true })); }));
  await pg.click("#ncpGo");
  ok((await pg.$$eval("#ncpOut svg", (s) => s.length)) === 0 && (await pg.$$eval("#ncpOut table", (s) => s.length)) === 1, "only the chosen table is shown");
  await pg.$$eval("#ncpCharts input", (els) => els.forEach((e) => { e.checked = true; e.dispatchEvent(new Event("change", { bubbles: true })); }));

  /* options */
  await pg.selectOption("#ncpPieces", "scrap"); await pg.click("#ncpGo");
  ok(await tileVal("Pieces") === String(EXP.scrapOnly), "scrapped-only pieces");
  await pg.selectOption("#ncpPieces", "both"); await pg.selectOption("#ncpPeriod", "week"); await pg.click("#ncpGo");
  ok(await tileVal("Periods") === String(EXP.sheets.length), "weekly periods from dates (zero week filled)", await tile("Periods"));
  /* leave a sheet out */
  const drop = EXP.sheets[2];
  await pg.$eval('#ncpSheets input[data-sheet="' + drop + '"]', (e) => { e.checked = false; e.dispatchEvent(new Event("change", { bubbles: true })); });
  await pg.selectOption("#ncpPeriod", "sheet"); await pg.click("#ncpGo");
  ok(await tileVal("NCPs") === String(EXP.ncps - EXP.bySheet[drop].ncps), "unticked sheet left out");
  await pg.$eval('#ncpSheets input[data-sheet="' + drop + '"]', (e) => { e.checked = true; e.dispatchEvent(new Event("change", { bubbles: true })); });

  /* history on the device survives a reload */
  await pg.click("#ncpSave");
  ok(/Saved to this device: 96 new NCPs/.test(await pg.$eval("#ncpMsg", (e) => e.innerText)), "saved to history");
  await pg.click("#ncpSave");
  ok(/0 new NCPs, 96 already saved/.test(await pg.$eval("#ncpMsg", (e) => e.innerText)), "re-saving does not double count");
  await open();
  ok(/96 NCPs/.test(await pg.$eval("#ncpHistInfo", (e) => e.innerText)), "history shown after reload");
  await pg.click("#ncpHistUse"); await pg.click("#ncpGo");
  ok(await tileVal("NCPs") === String(EXP.ncps) && await tileVal("Cost") === "$" + Math.round(EXP.cost).toLocaleString("en-US"), "history rebuilds the same totals");
  pg.once("dialog", (d) => d.accept()); await pg.click("#ncpHistClear");
  ok(/Nothing saved/.test(await pg.$eval("#ncpHistInfo", (e) => e.innerText)), "history cleared");

  ok(errs.length === 0, "no page errors", errs);
  await pg.screenshot({ path: process.env.SHOT || "/tmp/ncp-e2e.png", fullPage: false });
  console.log((fail ? "FAILED " : "OK ") + pass + " checks passed, " + fail + " failed");
  await b.close(); process.exit(fail ? 1 : 0);
})();
