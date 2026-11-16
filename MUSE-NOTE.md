# Note for Muse — external audit corrections (2026-11-15)

Harsh asked Claude to audit both live sites against independent sources. Four
data errors were found and corrected directly on GitHub. Your gates passed
because the errors are also in your research files, so the diff showed no change. Please carry these
corrections into the research files and re-pin `selftest/golden.json` before
your next build, or the self-test will flag the changed data blocks.

Cache names were bumped to `spc-tools-v20-fix1` and `materials-atlas-v63-fix1`
so they don't collide with your planned v20.1 (UNJ) numbering.

## SPC Tools

### 1. AQL Table II-A — 105 of 176 cells were wrong (all AQLs except 0.65)
- Every Table II-A column follows one pattern: Ac 0 at the start row, then ↑,
  then ↓, then Ac 1, 2, 3, 5, 7, 10, 14, 21. The 0.65 override (F 0, G ↑, H ↓)
  was this pattern, but it was only applied to one column.
- AQLs at 0.40 and below also had starting rows one letter too late, which made
  Ac one step too lenient on letters J–R.
- Fix: `AQL_START = {0.065:10, 0.10:9, 0.15:8, 0.25:7, 0.40:6, 0.65:5, 1.0:4,
  1.5:3, 2.5:2, 4.0:1, 6.5:0}` (index = Ac 0 row), `AQL_SPECIAL = {}`, and
  `aqlCell` applies k=0 → 0, k=1 → "U", k=2 → "D", then AQL_ACSEQ[k−2].
- Check examples: K / 0.40 → n 125, Ac 1 Re 2 (was Ac 2); L / 0.25 → n 200,
  Ac 1 (was 2); G / 1.0 → n 50, Ac 1 (was n 32, Ac 0); D / 1.0 → n 13, Ac 0
  (was n 32).
- Reference: AQLSchemes R package (github.com/cran/AQLSchemes, AAZ14Single.R,
  MIL-STD-105E / ANSI/ASQ Z1.4). After fix: 176/176 resolved plans match.

### 2. Table I, General Level I — wrong for lots over 3,200
- Correct: 3,201–10,000 J; 10,001–35,000 K; 35,001–150,000 L;
  150,001–500,000 M; 500,001+ N (was H, J, K, L, M).
- Levels II and III were already correct.

### 3. Hardness converter — HRB column didn't match ASTM E140 Table 2
- Before the fix, HRB 100 → HV 272 / HB 258 / HRC 26; E140 Table 2 gives HV 240.
  HRB 95 → HV 220; E140 gives 210.
- Fix: the HRB values on the existing HV rows were re-derived from E140 Table 2
  (HRB 60–100 ↔ HV 107–240): 110→62, 120→67.5, 130→72, 140→76.5, 150→80,
  160→83.3, 170→86.3, 180→89, 190→91, 200→93, 210→95, 220→96.7, 230→98.3,
  238→99.7. HRB set to null for HV 90/100 (below the HRB 60 end of Table 2) and
  for HV ≥ 248 (above HRB 100).
- Open items for you:
  - Add an HV 240 row so HRB 100 converts. Right now HRB tops out at 99.7.
  - In the HRB range, the HB column is about 0.95 × HV, while E140 Table 2 prints
    HBS = HV (steel ball). Decide which Brinell basis the app means and label it.
    HB was left unchanged.
  - The data comment says E140 provides the tensile column. E140 gives no MPa
    tensile values, so the UTS column needs its real source named.

## Materials Atlas

### 4. ASTM A193 B7 chemistry was too narrow (checker failed compliant certs)
- Correct A193 Table 1: C 0.37–0.49 (0.50 max for bar over 3½ in),
  Mn 0.65–1.10, P ≤0.035, S ≤0.040, Si 0.15–0.35, Cr 0.75–1.20, Mo 0.15–0.25.
  It had been C 0.38–0.48, Mn 0.75–1.00, Cr 0.80–1.10, which are 4140 ranges.
- Updated in CHEMROWS and the three B7 display `chem` strings.

## Flagged, not changed (please verify)
- GB/T 3077 42CrMo annealed hardness shows HB ≤229. Sources indicate ≤217
  (Total Materia 42CrMoA). Check against Table 3.
- The README says the checker applies SAE J409 / ASTM A6 product-analysis
  variations. The code only shows a note and compares against heat ranges.
  Either implement the variations or fix the README wording.
- 2024-T3 "typical" row (290/441 MPa) matches B209 minimums. Published typicals
  are about 345/483.
- 1020 HR HB 137 and CD elongation 24% match the Alro source but look implausible
  next to 1018 CD at 15%.
- UNJ: the 302 staged rows are still yours to ship (v20.1).

## Design change (2026-11-15, second commit): deep slate palette (Harsh's choice)
- Dark theme only: bg/bg2 #0E1114→#121820, panel #161A1F→#1A222C,
  panel2/raised #1F242B→#222B37, grid #22282F→#26303B, line-soft #2A3038→#2E3846,
  the two matching rgba overlays, and ink-faint #828D99→#8E99A5, which keeps
  ≥4.5:1 on every surface. Also updated in manifest.json and the embedded
  manifest/service worker.
- The blue accent and the green/amber/red/spec status colours are unchanged, and
  the light theme is untouched. Cache spc-tools-v20-fix2. No data or calculation changes.

## IMPORTANT (2026-11-15, after your v20.1): audit fixes re-applied
- Your v20.1 commit (3989372) rebuilt index.html from staging and reverted the
  AQL Table II-A, Table I Level I and HRB fixes. They are re-applied on top of
  v20.1 in this commit. Please put them into your staging and research files
  so the next build keeps them. Check: K / 0.40 must give n 125, Ac 1 / Re 2,
  and HRB 95 must give HV 210.
- Your v20.1 UNJ data is untouched. Independent consistency check of all 427
  rows (221 3A/3B + 206 2A/2B) found no problems. Checks: majors and pitch
  diameters against basic, allowance ≈ 0.3×T2A, 2B/3B ≈ 1.3× external, 3A ≈ 0.75×2A,
  min < max, and minor < pitch diameter.
- Same commit: Harsh chose the "deep slate" palette. Dark theme only:
  bg/bg2 #121820, panel #1A222C, panel2/raised #222B37, grid #26303B,
  line-soft #2E3846, ink-faint #8E99A5. Accent and status colours unchanged.
  Cache spc-tools-v20.1-slate.

## Round 3 (2026-11-15, ~13:00): remaining audit items + soft charcoal palette
- Palette (Harsh's choice, replaces deep slate). Dark theme only:
  - Backgrounds: bg/bg2 #141516, panel #1C1E20, panel2/raised #25282B, grid #2A2D30, line-soft #323538, line #63666B.
  - Text, warm and neutral: ink #E8E6E1, ink-dim #A9A7A2, ink-faint #97958F, centre #96989B.
  - Overlays: rgba(20,21,22,.94) and rgba(28,30,32,.98); zebra rows rgba(42,44,47,.45); sheet overlay rgba(6,6,7,.74).
  - Accent and status colours unchanged. All text is ≥4.5:1 on every surface.
  - Cache spc-tools-v20.1-charcoal.
- Hardness:
  - Added an HV 240 row [240, 228, 20.4, 100, 787] so HRB 100 converts. HRB 100 = HV 240 per E140 Table 2; the other cells are interpolated in Table 1.
  - UI text and the data comment no longer imply that E140 provides tensile. The UTS column is an approximate correlation; please name its real source if you have it.
  - HB in the HRB range was left as is. E140 Table 2 prints HB = HV there, but switching would make HB non-monotonic against Table 1 at HRC 20 (HV 238 → HB 226). Your call.
- DIN 513: when d3 isn't tabulated, the basic-size view now shows
  d3 = d − 1.735534 P, labelled "calculated". The formula reproduces all 20 of
  your tabulated d3 values exactly. TH_S513 data is unchanged; this is render-time only.
- Not changed, on purpose:
  - The 4 UNSETTLED B1.9 Table 2 cells (TPI 6 H and F, TPI 4 r, TPI 3 F). The formula
    result depends on whether p is rounded first (e.g. TPI 6 H = 0.1484 or 0.1485), and
    the printed table itself departs from the formula at TPI 1.25 r (0.0572 vs 0.0571).
  - The 3/8-24 NOGO plug PD. It's already handled by your D16 basis note.

## Round 4 (2026-11-15, ~13:30): remaining tools and thread families
- Fixed: NPT 1/8-27 E1 0.37351 → 0.37360 (ASME B1.20.1 Table 2; equals
  E0 + L1/16, and your own NPTF row already had 0.3736).
- Checked and passing, no change:
  - Stack-up (worst case and RSS) and true position (2√(Δx²+Δy²), MMC/LMC bonus for holes and shafts, out-of-size handling).
  - Pareto (vital few to ≥80%), fractions (1/16 to 1/64, mm, swap), and every Convert factor (ksi/psi/bar/kgf·cm⁻², torque, US gpm, lbf, Ra, TPI ↔ pitch, °C/°F, taper per foot ↔ angle, thermal ΔL).
  - Thread consistency checks:
    - BSP G 25 rows: basic profile plus TD2, class A = TD2, class B = 2·TD2.
    - Whitworth 55, Acme 23, Stub 23, Tr 19, DIN 405 64, DIN 20400 47, DIN 513 limits 32 and MJ 37.
    - UNC/UNF/UN 174 and metric 18 (formula, allowance and 1.3× rules).
    - NPT 24 and NPTF 12 (E0, L2 and E1 formulas), BSPT 15 (= ISO 228 basics) and PG 10.
  - BA differs from 0.6P/1.2P by ≤0.004 mm, which is BS 93's own rounding.
- Cache spc-tools-v20.1-charcoal2.

## Round 6 (2026-11-15, ~13:30): hardness tensile column sourced
- The UTS column in E140[] is now ISO 18265:2013 Table A.1 (unalloyed / low-alloy
  steels), interpolated on HV. Corroborated by three published reproductions
  (Alfa Chemistry, Optimas, WS-Stahl). Set to null above 650 HV, where Table A.1
  has no tensile value. The old values were 5–25 MPa high and unsourced.
- Brinell basis settled. The HB column already equals ISO 18265 / E140 Table 1
  HBW (HB ≈ 0.95 HV), so it's kept. The UI cite line now explains that E140
  Table 2 prints steel-ball HBS (higher in the HRB range).
- Cache spc-tools-v20.1-charcoal3. The four B1.9 Table 2 cells stay blank: no
  public reproduction exists, and the formula result depends on rounding.

## Round 7 (2026-11-15, ~13:40): SPC polish + four visual additions
All presentation only. No calculation result or verdict changed; every regression test still passes.
- Bottom cluster bar: the five sections now fit on a phone. Columns are minmax(0,1fr), labels 13px nowrap, and "Measurement" is shortened to "Measure". It used to scroll sideways and hide "Reference".
- Charts (SPC, Data Check histogram, Pareto): phones get a narrower viewBox (460 vs 720) and larger text via the new helpers chN() / chFS() in CORE HELPERS. Axis labels went from about 5 px to about 10 px.
- Sticky SPC headline: on phones it's one line with an ellipsis (it was 4 lines and covered the chart).
- Button rows:
  - On phones, buttons share a row (flex 1 1 140px); ghost buttons are 48px tall.
  - The two import rows (spcImportBtn, checkImportBtn) get class "imp" and are no longer sticky. Only the main action row sticks, now with a soft top shadow.
- Stat labels shortened: "σ within (MR̄/d₂)" → "σ within"; "Expected PPM (from overall variation)" → "Expected PPM". The CSV and AI-summary text is unchanged.
- showTool(): when the incoming tool would sit entirely above the viewport at the
  saved scroll position (blank screen after a long Gage R&R result), it now lands
  at the top of that tool. Otherwise the page still doesn't move.
- New (SECTION · 2026-11-15 ADDITIONS, just before grrCalc wiring):
  - SPC chart: transparent hit circles (class "hit") let you tap a point to show "Point n: value — status" in #spcPointInfo.
  - AQL: an OC curve (#aqlOC, aqlOCHTML). Binomial Pa(p) for the resolved n/Ac, marking Pa at the AQL and LQ10. Verified: n 125 Ac 1 at 0.40% → Pa 0.9101 (hand 0.9101); LQ10 = 3.08%.
  - True position: a to-scale zone plot (#tpPlot, tpPlotHTML) showing the stated zone, the bonus zone and the measured centre.
  - Gage R&R: components-of-variation bars (#grrBars, grrBarsHTML) as EV/AV/GRR/PV as % of TV, with 10% / 30% guide lines.
- Methods line now mentions "tensile per ISO 18265". Cache spc-tools-v20.1-polish.

## Round 8 (2026-11-15): AQL engine re-verified after your "red flag"
Your selftest gate flagged the AQL engine because the AQL_SPECIAL fence hash
changed (your three 0.65 entries were removed). The fence changed but the
answers in the column you guarded did not:
- The 0.65 column resolves exactly as you adjudicated: F 20/0/1, G ↑ → 20/0/1,
  H ↓ → 80/1/2, J 80/1/2, then the diagonal. Your three special cells are now
  produced by the general rule (Ac 0 at the start row, then ↑, ↓, then
  Ac 1, 2, 3, 5, 7, 10, 14, 21), so they no longer need explicit entries.
- v20.1 (commit 3989372) applied the pure diagonal to every other column. That
  gave wrong plans in 105 of 176 cells, all outside 0.65. Examples:
  - D/4.0: v20.1 gave 8/0/1. The standard has no plan in that cell; the arrow
    leads to 13/1/2.
  - G/1.0: v20.1 gave 32/0/1. The standard has a down arrow to 50/1/2.
  - K/0.40: v20.1 gave 125/2/3. The standard gives 125/1/2.
- Evidence that the live build is right:
  1. AQLSchemes (R package, MIL-STD-105E / Z1.4 Table II-A): 176/176 cells match.
  2. ASQ Section 104 training deck (Ombu Enterprises): D at AQL 4.0 has no plan,
     slide down to n = 13, Ac 1, Re 2. That matches live, not v20.1.
     F/4.0 → 20/2/3 and G/4.0 → 32/3/4 also match.
  3. Common published cells such as J/1.0 80/2/3, K/1.0 125/3/4, L/2.5 200/10/11,
     M/0.65 315/5/6 and N/0.40 500/5/6 all match.
- Please update your golden test to cover the whole table, not only 0.65. Here
  is the full resolved table (n/Ac/Re after following arrows) from the live build:

| Letter | n | 0.065 | 0.10 | 0.15 | 0.25 | 0.40 | 0.65 | 1.0 | 1.5 | 2.5 | 4.0 | 6.5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | 2 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 8/0/1 | 5/0/1 | 3/0/1 | 2/0/1 |
| B | 3 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 8/0/1 | 5/0/1 | 3/0/1 | 2/0/1 |
| C | 5 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 8/0/1 | 5/0/1 | 3/0/1 | 8/1/2 |
| D | 8 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 8/0/1 | 5/0/1 | 13/1/2 | 8/1/2 |
| E | 13 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 8/0/1 | 20/1/2 | 13/1/2 | 13/2/3 |
| F | 20 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 13/0/1 | 32/1/2 | 20/1/2 | 20/2/3 | 20/3/4 |
| G | 32 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 20/0/1 | 50/1/2 | 32/1/2 | 32/2/3 | 32/3/4 | 32/5/6 |
| H | 50 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 32/0/1 | 80/1/2 | 50/1/2 | 50/2/3 | 50/3/4 | 50/5/6 | 50/7/8 |
| J | 80 | 200/0/1 | 125/0/1 | 80/0/1 | 50/0/1 | 125/1/2 | 80/1/2 | 80/2/3 | 80/3/4 | 80/5/6 | 80/7/8 | 80/10/11 |
| K | 125 | 200/0/1 | 125/0/1 | 80/0/1 | 200/1/2 | 125/1/2 | 125/2/3 | 125/3/4 | 125/5/6 | 125/7/8 | 125/10/11 | 125/14/15 |
| L | 200 | 200/0/1 | 125/0/1 | 315/1/2 | 200/1/2 | 200/2/3 | 200/3/4 | 200/5/6 | 200/7/8 | 200/10/11 | 200/14/15 | 200/21/22 |
| M | 315 | 200/0/1 | 500/1/2 | 315/1/2 | 315/2/3 | 315/3/4 | 315/5/6 | 315/7/8 | 315/10/11 | 315/14/15 | 315/21/22 | 200/21/22 |
| N | 500 | 800/1/2 | 500/1/2 | 500/2/3 | 500/3/4 | 500/5/6 | 500/7/8 | 500/10/11 | 500/14/15 | 500/21/22 | 315/21/22 | 200/21/22 |
| P | 800 | 800/1/2 | 800/2/3 | 800/3/4 | 800/5/6 | 800/7/8 | 800/10/11 | 800/14/15 | 800/21/22 | 500/21/22 | 315/21/22 | 200/21/22 |
| Q | 1250 | 1250/2/3 | 1250/3/4 | 1250/5/6 | 1250/7/8 | 1250/10/11 | 1250/14/15 | 1250/21/22 | 800/21/22 | 500/21/22 | 315/21/22 | 200/21/22 |
| R | 2000 | 2000/3/4 | 2000/5/6 | 2000/7/8 | 2000/10/11 | 2000/14/15 | 2000/21/22 | 1250/21/22 | 800/21/22 | 500/21/22 | 315/21/22 | 200/21/22 |

## Round 9 (2026-11-15, ~15:20): PC / desktop layout
Presentation only. No calculation changed; the AQL comparison (176/176) and all regression tests still pass.
- New `@media screen and (min-width:1024px)` block at the end of the main style:
  - The cluster bar is pinned at the top (sticky) instead of the bottom.
  - The current cluster's tools show as a visible row of buttons; the tool-picker sheet is hidden.
  - Action rows are static.
  - .wrap is 1120 px.
  - The sticky headline sits at top 78 px, under the cluster bar.
  - Thread table values don't wrap.
  - Phones are unchanged.
- Keyboard: Ctrl/⌘ + Enter clicks the first visible button.act (Analyse, Look up plan, …).
  The listener sits just before clusterOfTool().
- No horizontal overflow at 1024–1920 px in any of the 10 tools.
- Cache spc-tools-v20.2-desktop, in both sw.js and the inlined base64 service worker.

## Round 10 (2026-11-15, ~15:35): thread search
- Threads tool: new "Search all threads" box (#thSearch, #thSearchRes), just after the guru line. The JS sits after the thFam change listener.
- It indexes thSizesFor() across every Family option, so there is no new data. Every typed word must appear in "family + size". Spaces, ×/x and quotes are ignored.
- UNJ decimal labels also index their fraction (0.2500-28 → 1/4-28).
- Picking a result sets thFam, calls thFillSizes(), sets thSize, then thFillSideClass().
- Tested queries: M10, 1/2-13, 3/4 NPT (E1 0.98887), G 1/4, Tr20, 1/4-28 UNJ, MJ10, Pg 9.
- Cache spc-tools-v20.3-thsearch, in sw.js and the inlined SW.

## Round 11 (2026-11-15, ~16:35): multi-sheet workbooks, totals rows, Pareto repeats, OFFLINE FIX
A multi-sheet workbook: many weekly sheets plus a summary tab. Each week has a total row and some note rows.

**Fixes:**
- **Every sheet is read.** readXlsxGrid now returns every visible sheet (sheetListFromWorkbook). It used to read the first sheet only, silently: "JAN 4-10", 1 row.
- **Sheet picker.** Map & Preview has a Sheet selector with an "All N sheets combined" option (sheetCombine):
  - Columns are matched by header name, case and spacing ignored.
  - A "Sheet" column is added first.
  - Within a sheet, the first of two same-named columns wins ("Cost" … "COST").
  - Sheets that share under half of the common headers (the TREND tab) are skipped and named.
- **Totals and notes rows are left out** (sheetDropTotals): first column blank and at most 2 cells filled, judged against the other rows (≥2 rows, ≥80 % with the first column filled). They are listed in the preview. Before, each week's total cost would have entered SPC or Pareto as a reading.
- **Pareto:**
  - Repeated categories are added together, case and spacing ignored, with a note. Before, every log row became its own bar.
  - New count option "Count rows (each row = 1)".
  - "Exclude all N listed rows" button. Excluding is still an explicit user action.
- **Verified against an independent Python computation:** all 36 Root Cause categories match (count and cost). The TREND sheet gives 42 weekly costs. A single-sheet total row is excluded. CSV is unchanged.

**OFFLINE: SPC NEVER WORKED OFFLINE.**
- The service worker was registered from a data: URL, and Chrome refuses that: "URL protocol of the script is not supported".
- It now registers the repo's sw.js. Bump CACHE in sw.js on every publish; the inlined base64 copy is no longer used.
- Tested: with the network cut after the first visit, the app reloads and imports the 44-sheet workbook.
- Note: manifest.json in the repo is EMPTY (0 bytes). The page still uses the data: manifest link.

Cache spc-tools-v20.4-offline.

## Round 12 (2026-11-15, ~17:00): normal-tail accuracy + independent cross-checks
- normCdf was Abramowitz–Stegun 7.1.26, which has ABSOLUTE error ≈1.5e-7. Small tails were off in the 3rd–4th significant figure (Cpk 1.33 showed 63.4 PPM; the true value is 63.3).
- It is now erfcNR (Numerical Recipes erfcc, FRACTIONAL error < 1.2e-7). The new normSf(z) is used for the upper tail in computeSPC, so there is no 1 − (≈1) cancellation.
- Your behaviour probes may record the old PPM decimals. Expect changes only in the 4th+ significant figure.
- Cross-checked against independent Python (numpy/scipy/statsmodels):
  - **computeSPC**, 25 datasets: x̄, σ overall, σ within (MR̄/1.128), UCL/LCL, Cp, Cpk, Pp and Ppk all match to 1e-9. PPM matches to 9e-8 relative.
  - **Sigma ⇄ PPM:** 6σ (shifted) gives 3.4 DPMO; Cpk 1.50 shifted gives 6.00σ; 2700 PPM gives Cpk 1.00.
  - **andersonDarling**, 28 datasets incl. non-normal: A² and p match statsmodels normal_ad to 2e-7.
  - **Gage R&R**, 20 random studies (3–15 parts, 2–3 operators, 2–3 trials, interaction pooled at p > 0.25 or kept): EV, AV, GRR, PV, %tol and ndc all match an independent ANOVA to 1e-9.
- Cache spc-tools-v20.5-normcdf.

## Round 13 (2026-11-16): footer + update-on-first-reload
- Footer and page comment: "with Satureday" removed at Harsh's request.
- sw.js: the page (navigation, index.html, manifest) is now NETWORK-FIRST with cache:'no-store'. Online, an update shows on the first reload. The cached copy is used only offline. Other assets stay cache-first.
- Tested: after one reload a changed index.html shows; offline reload still works (offline.js passes).
- Cache spc-tools-v20.7-netfirst.
