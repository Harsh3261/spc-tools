/* Quality Command (command/index.html) in a real browser, Toronto time zone,
   with the clock fixed at 21:30 local on 2026-11-18 (already the 19th in UTC —
   "today" must still be the 18th). Uses only made-up records.
   Run: NODE_PATH=<playwright-core dir> node tests/command.e2e.js */
"use strict";
const { chromium } = require("playwright-core"), fs = require("fs"), path = require("path");
const URL = "file://" + path.join(__dirname, "..", "command", "index.html");
let pass = 0, fail = 0; const ok = (c, l, x) => { if (c) pass++; else { fail++; console.log("FAIL", l, x === undefined ? "" : JSON.stringify(x)); } };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, timezoneId: "America/Toronto", acceptDownloads: true });
  const pg = await ctx.newPage();
  await pg.clock.install({ time: new Date("2026-11-19T02:30:00Z") });
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e))); pg.on("dialog", (d) => d.accept());
  await pg.goto(URL);
  const Q = (f) => pg.evaluate(f);
  /* --- date logic --- */
  ok(await Q(() => QCMD.today()) === "2026-11-18", "today is local, not UTC", await Q(() => QCMD.today()));
  ok(await Q(() => QCMD.addMonths("2026-01-31", 1)) === "2026-02-28", "Jan 31 + 1 month = Feb 28");
  ok(await Q(() => QCMD.addMonths("2028-01-31", 1)) === "2028-02-29", "leap year");
  ok(await Q(() => QCMD.addMonths("2026-08-31", 6)) === "2027-02-28", "+6 months clamps");
  ok(await Q(() => QCMD.addMonths("2026-11-18", -12)) === "2025-11-18", "minus 12 months");
  ok(await Q(() => QCMD.addDays("2026-03-07", 1)) === "2026-03-08" && await Q(() => QCMD.addDays("2026-03-08", 1)) === "2026-03-09", "days across spring DST");
  ok(await Q(() => QCMD.days("2026-10-31", "2026-11-02")) === 2, "day count across fall DST");
  ok(await Q(() => QCMD.objectiveMet({ actual: "92", target: "95", dir: "min" })) === false && await Q(() => QCMD.objectiveMet({ actual: "1800", target: "2000", dir: "max" })) === true, "objective met logic");
  const score = async () => +(await pg.$eval("#v-today .gauge text", (t) => t.textContent));
  /* --- empty app: only "no management review" counts --- */
  ok(await score() === 85, "empty app score 85 (no management review)", await score());
  /* --- audit programme --- */
  const nav = async (v) => { await pg.click('nav.bottom button[data-view="' + v + '"]'); };
  await nav("audit"); await pg.click('[data-act="progNew"]');
  await pg.fill("#pArea", "Test area A"); await pg.fill("#pClauses", "8.5"); await pg.fill("#pFreq", "12"); await pg.click('[data-act="progSave"]');
  await nav("today"); ok(await score() === 79, "never-audited area costs 6", await score());
  /* record an audit with one checklist NC → corrective action opened, programme date moves */
  await nav("audit"); await pg.click('#v-audit .item[data-go^="audit:"]'); await pg.click('[data-act="recNew"]');
  await pg.fill("#rAud", "Tester");
  await pg.click('#qbList .q:nth-child(1) button[data-v="OK"]');
  await pg.click('#qbList .q:nth-child(2) button[data-v="NC"]');
  ok((await pg.$$("#rFind .find")).length === 1, "NC in checklist adds a finding");
  await pg.fill("#rFind .find .fText", "Example evidence for test");
  await pg.click('[data-act="recSave"]');
  const st1 = await Q(() => { const d = JSON.parse(localStorage.getItem("qc.data")); return { last: d.program[0].last, capas: d.capas.map((c) => [c.no, c.source, c.due]), cap: d.audits[0].findings[0].capaId }; });
  ok(st1.last === "2026-11-18", "programme last-audited updated", st1);
  ok(st1.capas.length === 1 && st1.capas[0][0] === "CA-2026-001" && st1.capas[0][1] === "Internal audit" && st1.capas[0][2] === "2027-01-17" && !!st1.cap, "audit NC opened CA-2026-001, due +60 days, linked", st1);
  /* --- CAPA workflow --- */
  await nav("capa"); await pg.click('#v-capa .item[data-go^="capa:"]');
  await pg.click('[data-act="capaClose"]');
  ok(/root cause/.test(await pg.$eval("#toast", (t) => t.textContent)), "cannot close without root cause");
  await pg.fill("#cCont", "Sorted"); await pg.fill("#cWhy0", "why one"); await pg.fill("#cRoot", "Test root cause");
  await pg.click('[data-act="addAct"]'); await pg.fill("#cActs .aText", "Test action"); await pg.click('[data-act="capaClose"]');
  ok(/Finish/.test(await pg.$eval("#toast", (t) => t.textContent)), "cannot close with unfinished action");
  await pg.check("#cActs .aDone"); await pg.click('[data-act="capaClose"]');
  const c1 = await Q(() => JSON.parse(localStorage.getItem("qc.data")).capas[0]);
  ok(c1.closed === "2026-11-18" && c1.effDue === "2027-01-17" && QCMD_stage_ok(c1), "closed today, effectiveness check +60 days", c1);
  function QCMD_stage_ok(c) { return c.actions.length === 1 && c.actions[0].done; }
  /* --- due items --- */
  await nav("due"); await pg.click('[data-act="dueNew"]');
  await pg.selectOption("#dKind", "Calibration"); await pg.fill("#dName", "Test gauge"); await pg.fill("#dFreq", "6"); await pg.fill("#dLast", "2026-04-10"); await pg.click('[data-act="dueSave"]');
  await nav("today");
  const items1 = await pg.$$eval("#v-today .item .t", (x) => x.map((e) => e.textContent));
  ok(items1.includes("Calibration overdue"), "calibration overdue flagged", items1);
  ok(await score() === 85 - 6, "overdue calibration costs 6 (audit done, CAPA closed)", await score());
  await nav("due"); await pg.click('[data-act="dueDone"]');
  ok(await Q(() => JSON.parse(localStorage.getItem("qc.data")).dues[0].last) === "2026-11-18", "Done sets last = today");
  ok(/2027-05-18/.test(await pg.$eval("#v-due", (v) => v.textContent)), "next due +6 months shown");
  /* bulk paste: one bad line → nothing added */
  await pg.click('[data-act="dueBulk"]'); await pg.fill("#bulkTxt", "Calibration, Gauge A, 12, 2026-01-05, Me\nTraining\tForklift\t36\t2025-02-01\nBogus, X, 0, 2026-13-01");
  await pg.click('[data-act="bulkSave"]');
  ok(/Line 3/.test(await pg.$eval("#bulkMsg", (m) => m.textContent)) && (await Q(() => JSON.parse(localStorage.getItem("qc.data")).dues.length)) === 1, "bad line blocks the paste");
  await pg.fill("#bulkTxt", "Calibration, Gauge A, 12, 2026-01-05, Me\nTraining\tForklift\t36\t2025-02-01"); await pg.click('[data-act="bulkSave"]');
  ok(await Q(() => JSON.parse(localStorage.getItem("qc.data")).dues.length) === 3, "two pasted (comma and tab)");
  /* --- management review: scrap history from SPC Tools is picked up --- */
  await Q(() => localStorage.setItem("ncp.history", JSON.stringify({ saved: "2026-11-18", rows: [
    { id: "T1", date: "2026-10-02", cause: "Cause A", cost: 100 }, { id: "T2", date: "2026-10-09", cause: "Cause B", cost: 40 }, { id: "T3", date: "2024-01-01", cause: "Old", cost: 999 }] })));
  await nav("review"); await pg.click('[data-act="mrPrep"]');
  const proc = await pg.$eval("#mi_process", (t) => t.value), ncca = await pg.$eval("#mi_ncca", (t) => t.value), aud = await pg.$eval("#mi_audit", (t) => t.value);
  ok(/2 records, cost \$140\.00/.test(proc) && /Cause A \(\$100\)/.test(proc) && !/Old/.test(proc), "scrap history (last 12 months only) in the pack", proc);
  ok(/1 corrective actions opened/.test(ncca) && /1 closed: 0 verified effective, 0 not effective, 1 awaiting/.test(ncca), "CAPA summary", ncca);
  ok(/1 internal audits/.test(aud) && /0 major NC, 1 minor NC/.test(aud), "audit summary", aud);
  await pg.fill("#mWho", "Test team"); await pg.click('[data-act="mAddAct"]'); await pg.fill("#mActs .aText", "Test review action"); await pg.fill("#mActs .aDue", "2027-02-01");
  await pg.click('[data-act="mrFinish"]');
  const mr = await Q(() => { const d = JSON.parse(localStorage.getItem("qc.data")); return { last: d.mrLast, hist: d.mrHistory.length, src: d.capas.map((c) => c.source), no: d.capas.map((c) => c.no) }; });
  ok(mr.last === "2026-11-18" && mr.hist === 1 && mr.src.includes("Management review") && mr.no.includes("CA-2026-002"), "review recorded, action tracked as CA-2026-002", mr);
  await nav("today"); ok(await score() === 100, "all clear → 100", [await score(), await pg.$$eval("#v-today .item .t", (x) => x.map((e) => e.textContent))]);
  /* --- backup → delete → restore --- */
  await nav("review");
  const [dl] = await Promise.all([pg.waitForEvent("download"), pg.click('[data-act="backup"]')]);
  const bfile = await dl.path(); const bj = JSON.parse(fs.readFileSync(bfile, "utf8"));
  ok(bj.capas.length === 2 && bj.dues.length === 3 && !!bj.backupAt, "backup file has the records");
  await pg.click('[data-act="wipe"]');
  ok(await Q(() => JSON.parse(localStorage.getItem("qc.data")).capas.length) === 0, "delete everything");
  await nav("review"); await pg.setInputFiles("#restoreFile", bfile); await pg.waitForTimeout(300);
  ok(await Q(() => JSON.parse(localStorage.getItem("qc.data")).capas.length) === 2, "restore brings it back");
  /* --- persistence across reload --- */
  await pg.reload(); ok(await Q(() => JSON.parse(localStorage.getItem("qc.data")).dues.length) === 3, "survives reload");
  /* --- example data and screenshots --- */
  await Q(() => localStorage.removeItem("qc.data")); await pg.reload();
  await pg.click('[data-act="sample"]');
  ok(await score() < 60, "example data shows problems", await score());
  for (const v of ["today", "capa", "audit", "due", "review"]) { await nav(v); await pg.screenshot({ path: (process.env.SHOTS || "/tmp") + "/qc-" + v + ".png", fullPage: true }); }
  ok(errs.length === 0, "no page errors", errs);
  console.log((fail ? "FAILED " : "OK ") + pass + " checks passed, " + fail + " failed");
  await b.close(); process.exit(fail ? 1 : 0);
})();
