/* ISO 9001 Audit Guide (command/index.html) in a real browser at phone size.
   Checks: no script errors, every tab switches, clause search filters and
   recovers, no network requests, nothing written to storage, the old-tracker
   download notice appears only when old data exists.
   Run: NODE_PATH=<playwright dir> node tests/command.e2e.js */
"use strict";
const { chromium } = require("playwright"), path = require("path");
const URL = "file://" + path.join(__dirname, "..", "command", "index.html");
let pass = 0, fail = 0; const ok = (c, l, x) => { if (c) pass++; else { fail++; console.log("FAIL", l, x === undefined ? "" : JSON.stringify(x)); } };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const pg = await ctx.newPage();
  const errs = [], net = [];
  pg.on("pageerror", (e) => errs.push(String(e)));
  pg.on("request", (r) => { if (!r.url().startsWith("file:") && !r.url().startsWith("blob:") && !r.url().startsWith("data:")) net.push(r.url()); });
  await pg.goto(URL);
  const visible = () => pg.$eval(".view.on", (e) => e.id);
  ok(await visible() === "v-basics", "opens on Basics");
  for (const v of ["prepare", "clauses", "interview", "drill", "findings", "basics"]) {
    await pg.click('nav.bottom button[data-view="' + v + '"]');
    ok(await visible() === "v-" + v, "tab " + v);
    ok(await pg.$eval('nav.bottom button[data-view="' + v + '"]', (e) => e.getAttribute("aria-current")) === "page", "nav highlight " + v);
  }
  /* deep link */
  await pg.goto(URL + "#findings"); await pg.reload(); ok(await visible() === "v-findings", "hash opens Findings");
  /* clause search */
  await pg.click('nav.bottom button[data-view="clauses"]');
  const total = await pg.$$eval("#clauseList details", (d) => d.length);
  ok(total >= 30, "30+ clause cards", total);
  const shown = () => pg.$$eval("#clauseList details", (d) => d.filter((x) => x.style.display !== "none").length);
  await pg.fill("#cSearch", "calibrat");
  const n = await shown(); ok(n >= 1 && n < total, "search narrows", n);
  ok(await pg.$eval("#clauseList details:not([style*='none'])", (d) => d.open), "matches open");
  await pg.fill("#cSearch", "zzqxnotathing");
  ok(await shown() === 0 && await pg.$eval("#cEmpty", (e) => getComputedStyle(e).display) === "block", "no-match message");
  await pg.fill("#cSearch", "");
  ok(await shown() === total && await pg.$eval("#cEmpty", (e) => getComputedStyle(e).display) === "none", "clear restores all");
  ok(await pg.$$eval("#clauseList h3", (h) => h.every((x) => x.style.display !== "none")), "headings restored");
  /* drill */
  await pg.click('nav.bottom button[data-view="drill"]');
  const q1 = await pg.textContent("#dQ"); ok(q1.length > 10, "drill shows a question");
  ok(await pg.$eval("#dAns", (e) => e.hidden), "answer hidden first");
  await pg.click("#dReveal"); ok(!(await pg.$eval("#dAns", (e) => e.hidden)), "reveal shows answer");
  await pg.click('#dWho button[data-who="Shop floor"]');
  ok(await pg.textContent("#dTag") === "Shop floor" && /of 7$/.test(await pg.textContent("#dCount")), "filter shop floor (7)", await pg.textContent("#dCount"));
  for (let i = 0; i < 8; i++) await pg.click("#dNext");
  ok(await pg.textContent("#dTag") === "Shop floor", "deck reshuffles and keeps filter");
  ok(await pg.$$eval("#trail .tr", (t) => t.length) === 7, "order trail 7 steps");
  await pg.click('#tPick button[data-t="2"]'); ok(await pg.$$eval("#trail .tr", (t) => t.length) === 6, "bad-part trail");
  /* root-cause checker */
  await pg.click('nav.bottom button[data-view="findings"]');
  await pg.fill("#rcIn", "Operator error. Operator retrained.");
  await pg.click("#rcGo");
  ok(await pg.$$eval("#rcOut .rc.r", (e) => e.length) >= 1 && await pg.$$eval("#rcOut .rc.a", (e) => e.length) >= 2, "weak root cause flagged");
  await pg.fill("#rcIn", "The recall list had no automatic reminder, so the monthly recall depended on one person. The calibration system now sends a weekly due report to QA and a backup; effectiveness verified by 12 weekly reports with zero overdue.");
  await pg.click("#rcGo");
  ok(await pg.$$eval("#rcOut .rc.r, #rcOut .rc.a", (e) => e.length) === 0, "strong root cause passes", await pg.textContent("#rcOut"));
  /* storage untouched, old-data notice hidden when no old data */
  ok(await pg.evaluate(() => localStorage.length) === 0, "nothing stored");
  ok(await pg.$eval("#oldData", (e) => getComputedStyle(e).display) === "none", "no old-data notice by default");
  /* old tracker data present → notice shows, data not removed */
  await pg.evaluate(() => localStorage.setItem("qc.data", JSON.stringify({ v: 1, capas: [{ id: "x", title: "made-up record for test ".repeat(10) }] })));
  await pg.reload(); await pg.click('nav.bottom button[data-view="basics"]');
  ok(await pg.$eval("#oldData", (e) => getComputedStyle(e).display) === "block", "old-data notice shows");
  const [dl] = await Promise.all([pg.waitForEvent("download"), pg.click("#dlOld")]);
  ok(dl.suggestedFilename() === "quality-command-backup.json", "download name");
  ok(await pg.evaluate(() => !!localStorage.getItem("qc.data")), "old data kept");
  /* layout: nothing wider than the phone */
  ok(await pg.evaluate(() => document.documentElement.scrollWidth <= 390), "no horizontal overflow");
  ok(errs.length === 0, "no page errors", errs);
  ok(net.length === 0, "no network requests", net);
  await b.close();
  console.log(pass + " passed, " + fail + " failed"); process.exit(fail ? 1 : 0);
})();
