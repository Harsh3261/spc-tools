/* Opens every tool through the phone picker, presses its example button(s)
   and fails on any page error. Run: NODE_PATH=<playwright-core dir> node tests/smoke.e2e.js */
"use strict";
const { chromium } = require("playwright-core"), path = require("path");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const pg = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
  pg.on("dialog", (d) => d.dismiss());
  await pg.goto("file://" + path.join(__dirname, "..", "index.html")); await pg.waitForTimeout(400);
  const tabs = await pg.$$eval("nav.tabs button[data-tab]", (bs) => bs.map((b) => ({ id: b.id, tab: b.dataset.tab, cl: b.dataset.cluster })));
  const report = [];
  for (const t of tabs) {
    const before = errs.length;
    await pg.click("#clbtn-" + t.cl); await pg.$eval("#" + t.id, (b) => b.click()); await pg.waitForTimeout(200);
    const shown = await pg.$eval("#tool-" + t.tab, (s) => !s.classList.contains("hidden") && s.offsetParent !== null).catch(() => false);
    const demos = await pg.$$("#tool-" + t.tab + " button:visible");
    let pressed = 0;
    for (const d of demos) {
      const txt = (await d.innerText()).toLowerCase();
      if (/example|demo|sample/.test(txt)) { await d.click().catch(() => {}); pressed++; await pg.waitForTimeout(150); }
    }
    const results = await pg.$$eval("#tool-" + t.tab + " svg, #tool-" + t.tab + " .stat, #tool-" + t.tab + " table", (x) => x.length);
    report.push(t.tab + (shown ? "" : " NOT SHOWN") + " examples:" + pressed + " outputs:" + results + (errs.length > before ? " ERRORS: " + errs.slice(before).join(" | ") : ""));
  }
  console.log(report.join("\n"));
  console.log(errs.length ? "FAILED with " + errs.length + " page errors" : "OK — " + tabs.length + " tools, no page errors");
  await b.close(); process.exit(errs.length ? 1 : 0);
})();
