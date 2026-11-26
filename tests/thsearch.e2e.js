/* Thread search: side / class words, top-search hand-off, External/Internal buttons (2026-11-26).
   Expected limits typed from ISO 965-2 (M10 x 1.5 6H: D1 8.376-8.676, D2 9.026-9.206, D min 10.000;
   6g: d 9.732-9.968). Serve the repo: (python3 -m http.server 8766) then
   NODE_PATH=/opt/npm-tools/node_modules node tests/thsearch.e2e.js */
const { chromium } = require("playwright");
(async () => {
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on("pageerror", e => errs.push(String(e)));
let fail = 0, n = 0; const chk = (c, m) => { n++; if (!c) { fail++; console.log("FAIL", m); } };
const URL = process.env.URL || "http://localhost:8766/";
const state = () => pg.evaluate(() => ({ fam: thFam(), size: document.querySelector("#thSize").selectedOptions[0].text, side: document.querySelector("#thSide").value, cls: document.querySelector("#thClass").value, out: document.querySelector("#thMfg").innerText.replace(/\s+/g, " ") }));
const thSearch = async (q) => { await pg.fill("#thSearch", ""); await pg.fill("#thSearch", q); await pg.waitForTimeout(120); return pg.$$eval("#thSearchRes button", e => e.map(x => x.innerText.replace(/\s+/g, " "))); };

await pg.goto(URL); await pg.waitForTimeout(600);
await pg.evaluate(() => showTool("threads"));

// 1 · thread box understands side and class words
for (const [q, side, cls] of [["M10 internal", "int", "6H"], ["M10 nut", "int", "6H"], ["M10x1.5 6H", "int", "6H"], ["M10-6H", "int", "6H"], ["M10x1.5-6g", "ext", "6g"], ["M10 bolt", "ext", "6g"], ["M10 nut 6h", "int", "6H"], ["M10 tapped hole 5H", "int", "5H"], ["1/2-13 2B", "int", "2B"], ["1/2-13-3A", "ext", "3A"]]) {
  const r = await thSearch(q); chk(r.length > 0, q + " finds nothing");
  if (!r.length) continue;
  await pg.click("#thSearchRes button"); await pg.waitForTimeout(150);
  const s = await state(); chk(s.side === side && s.cls === cls, q + " -> " + JSON.stringify([s.size, s.side, s.cls]));
}
const s1 = await (async () => { await thSearch("M10 internal"); await pg.click("#thSearchRes button"); await pg.waitForTimeout(150); return state(); })();
chk(/M10 × 1.5/.test(s1.size), "M10 internal top hit is coarse: " + s1.size);
chk(/8\.376/.test(s1.out) && /8\.676/.test(s1.out) && /9\.026/.test(s1.out) && /9\.206/.test(s1.out) && /10\.000/.test(s1.out), "M10 6H limits wrong: " + s1.out.slice(0, 300));
chk((await thSearch("internal")).length === 0, "side word alone should prompt for a size, not list");
chk(/Add the size/.test(await pg.$eval("#thSearchRes", e => e.innerText)), "missing size prompt");

// 2 · External / Internal buttons
await pg.evaluate(() => { document.querySelector("#thFam").value = "metric"; thFillSizes(); });
const segs = await pg.$$eval("#thSideSeg button", e => e.map(x => x.innerText + "|" + x.getAttribute("aria-pressed")));
const selSide = await pg.$eval("#thSide", e => e.value);
chk(segs.length === 2 && /^External/.test(segs[0]) && /^Internal/.test(segs[1]) && segs.filter(x => /\|true$/.test(x)).length === 1 && segs[selSide === "ext" ? 0 : 1].endsWith("|true"), "seg " + segs);
await pg.click('#thSideSeg button[data-side="ext"]'); await pg.waitForTimeout(120);
chk((await state()).side === "ext" && (await state()).cls === "6g", "seg click ext");
await pg.click('#thSideSeg button[data-side="int"]'); await pg.waitForTimeout(120);
let s = await state(); chk(s.side === "int" && s.cls === "6H", "seg click -> " + s.side + " " + s.cls);
chk(await pg.$eval('#thSideSeg button[data-side="int"]', e => e.getAttribute("aria-pressed")) === "true", "seg pressed state");
await pg.evaluate(() => { document.querySelector("#thFam").value = "buttress"; thFillSizes(); });
chk(await pg.$$eval("#thSideSeg button", e => e.length === 1 && e[0].disabled), "single-option family shows one disabled button");

// 3 · top search hands the query to Threads
const top = async (q) => { await pg.goto(URL + "#"); await pg.reload(); await pg.waitForTimeout(500); await pg.fill("#toolQ", q); await pg.waitForTimeout(150); const first = await pg.$eval("#toolHits button", e => e.getAttribute("data-tab")); await pg.press("#toolQ", "Enter"); await pg.waitForTimeout(250); return [first, await state()]; };
let [t, st] = await top("M10"); chk(t === "threads" && /M10 × 1.5/.test(st.size) && st.side === "ext", "top M10 -> " + t + " " + st.size + " " + st.side);
chk(/Other matches/.test(await pg.$eval("#thSearchRes", e => e.innerText)), "top M10 lists the other M10 pitches");
[t, st] = await top("M10 internal"); chk(t === "threads" && /M10 × 1.5/.test(st.size) && st.side === "int" && st.cls === "6H", "top M10 internal -> " + JSON.stringify([t, st.size, st.side, st.cls]));
[t, st] = await top("metric internal thread"); chk(t === "threads" && st.fam === "metric" && st.side === "int", "top metric internal thread -> " + JSON.stringify([t, st.fam, st.side]));
[t, st] = await top("thread calculator"); chk(t === "threads", "top 'thread calculator' first hit = " + t);
[t, st] = await top("1/2-13 2B"); chk(t === "threads" && st.fam === "un" && st.side === "int" && st.cls === "2B", "top 1/2-13 2B -> " + JSON.stringify([t, st.fam, st.side, st.cls]));

// 4 · non-catalogue metric size offers the calculated custom size. Expected values worked by hand from
//     ISO 965-1: M9.5 x 1.25 6H  D1 = 8.147 + TD1 0.265 = 8.412; D2 = 8.688 + TD2 0.160 = 8.848; D min 9.500.
await pg.evaluate(() => showTool("threads"));
let rr = await thSearch("M9.5x1.25 6H"); chk(rr.length === 1 && /custom/.test(rr[0]), "custom offer: " + rr);
await pg.click("#thSearchRes button"); await pg.waitForTimeout(150);
s = await state(); chk(s.side === "int" && s.cls === "6H" && /8\.147/.test(s.out) && /8\.412/.test(s.out) && /8\.688/.test(s.out) && /8\.848/.test(s.out) && /9\.500/.test(s.out), "M9.5x1.25 6H -> " + s.out.slice(0, 260));
[t, st] = await top("M9.5x1.25 external"); chk(t === "threads" && st.side === "ext" && /9\.260/.test(st.out) && /9\.472/.test(st.out) && /8\.542/.test(st.out) && /8\.660/.test(st.out), "top M9.5x1.25 external -> " + st.out.slice(0, 260));

chk(errs.length === 0, "page errors: " + errs.join(" | "));
console.log(fail ? fail + " of " + n + " FAILED" : "OK " + n + " thread-search checks passed");
await b.close(); process.exit(fail ? 1 : 0);
})();
