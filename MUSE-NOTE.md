# Note for Muse — Hydraulic ports tool (2026-11-20)

New tool #tool-ports (cluster reference, tab "Hydraulic ports", finder keywords ORB / J1926 / 6149).
DATA PT_J1926 (13 sizes −2 … −32): SAE J1926-1 port dims D, J, K, O, P, S, U, Y, Z + AS568 900-series
O-ring — three agreeing sources (Parker O-Ring Handbook Table 4-5, EPCO/Zero-Leak J1926 sheet,
Fluid-Tech J1926-1 chart); Parker's −5 Y 0.960 is an outlier vs 0.906 ×2 → 0.906. −40/−48 not SAE, excluded.
O-ring ID/CS: Parker Table 4-5 + Apple Rubber boss-gasket table.
DATA PT_6149 (13 sizes M8 … M60): ISO 6149-1 Table 1 — Parker 4300 Table U17 + Jiayuan reproduction agree
on every row; ISO 6149-1:2022 preview confirms M12/M14/M16/M48/M60. d4 deliberately not shown (column meaning
not confirmed). M20×1.5 (cartridge-only) excluded — sources disagree. EPCO metric sheet differs (older edition), unused.
Each port links to its internal thread limits (UN table, metric table, or ISO 965-1 calculated for fine metric).
NOT YET: ISO 1179-1 BSPP ports (only one scrambled source so far), cartridge cavities (Sun / Parker drawings
are image PDFs — need the drawings to transcribe and a second source).

# Note for Muse — accent changed to muted amber (2026-11-20, later same evening)

Harsh found pure graphite too dim. Accent (buttons, selected tabs, title, focus, links, top rule)
is now muted brass-amber #C9963A (hover #D6A44A, text on it #1A1206, accent text #D9A957).
To avoid any clash: WARNING colour moved from amber #F2A93B to orange #FF8A4C (ink #FFC2A0,
flag tints rgba(255,138,76,…)); data series (SPC trace/points, Pareto/QC bars, true-position zone,
GR&R bar, legend swatches) use a new --data var (#D4D7DC screen, #33373D print), never the accent.
Pass green, fail red, spec violet unchanged. smoke / qc 1548 / ncp / formats pass; axe clean.

# Note for Muse — graphite theme + thread finder (2026-11-20)

1. THEME (CSS only, no logic change): Harsh chose a monochrome "graphite" look so no accent
   competes with the status colours. Every blue accent was mapped to greys:
   #4DA3FF→#D4D7DC (accent / data traces / selected tabs), rgba(77,163,255,a)→rgba(212,215,220,a),
   #2563EB→#E8EAED (primary buttons, text #16171A via --btn-ink / --on-accent), #1D4ED8→#FFFFFF (hover),
   #60A5FA→#A8ADB4 ("Tools" title), #3B82F6→#D4D6DA (top rule). Print --cyan is now #33373D.
   Green / amber / red status colours and spec-limit violet #B48EFF are unchanged.
2. THREAD FINDER (Threads tool, collapsible "Identify a thread from measurements"):
   reverse lookup over the existing verified tables only (TH_M, TH_U+TH_U_ADD, TH_BSP2,
   TH_W2 Medium, TH_A2, TH_S2, TH_TR2, TH_BAN, TH_NPT, TH_BSPT) — no new data. External =
   measured major Ø vs external major band; internal = measured minor Ø vs internal minor band.
   Optional pitch (TPI or mm), match tolerance 2.5 %. Taper threads use an approximate range
   (NPT E0+h … E0+h+L2/16; BSPT gauge-plane major − L/16 … gauge-plane major) and are labelled so.
   Clicking a result opens that thread's limits. Tested: 13 known threads all identified
   (1/2-13 UNC, M12, M10 nut, G1/4, NPT 1/2, Tr20×4, 1-8 UNC ext/int, Acme 1/4-16, 1/2-12 BSW,
   G1/2 …); smoke, qc (1548), formats, ncp tests pass; axe wcag2a/aa clean on SPC + Threads.

# Note for Muse — external audit corrections (2026-11-15)

Harsh asked Claude to audit both live sites against independent sources. Four
data errors were found and corrected directly on GitHub. Your gates passed
because the errors are also in your research files, so the diff showed no change. Please carry these
corrections into the research files and re-pin `selftest/golden.json` before
your next build, or the self-test will flag the changed data blocks.

Cache names were bumped to `spc-tools-v20-fix1` and `materials-atlas-v63-fix1`
so they don't collide with your planned v20.1 (UNJ) numbering.

## 2026-11-20 — Hydraulic ports: flanges, a cavity, and drawings

- Added SAE J518 / ISO 6162 Code 61 (1/2–3 in) and Code 62 (1/2–2 in) four-bolt flange ports: bolt spacing, UNC bolts, metric bolts, pressure rating. Every value agrees in at least two published tables (Parker 4400, AFP/Hydraquip, Winner, ContiTech). Left out because only one source had them: tapped-hole depth, Code 61 metric bolts for 2-1/2 and 3 in, Code 62 metric bolts above 1 in, and Code 61 sizes over 3 in (the sources disagree on these).
- Added the C10-2 two-way cartridge cavity (same as HydraForce VC10-2 and Danfoss SDC10-2). The Parker drawing and the Form Relief tool sheet agree on every value. Sun T-series and other Parker cavities are not included: their drawings online are images and could not be checked against a second source. The SCT tool table gives M20×1.5 for T-11A, and this has not been confirmed.
- Every port view now has a schematic SVG drawing. The letters match the table and the values fill in live. The drawings are not to scale.
- ISO 6149-1 M8/M10 chamfer depth L1 is now flagged: 1.6 (Parker plus two other sources) against 2.2 in one reproduction of the 2022 edition.
- Cache v28.

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

# Note for Muse — Mass converter added (2026-11-16)

Harsh asked Claude to add kg ⇄ lb to the Convert tab. A **Mass** card (kg, lb,
g, oz) now sits after Force, wired through the existing `cvLinear` helper with
base kg: lb = 0.45359237 (exact, 1959 international pound), g = 0.001,
oz = 0.45359237/16. Cache bumped to `spc-tools-v20.8-mass`. Please carry this
into your source/SPEC §4 before your next build so it isn't overwritten.

# Note for Muse — sister theme + fixes (2026-11-16)
- **Design (screen only; print theme untouched):** one `@media screen` block at the end of the
  style element. Navy base shared with Materials Atlas (#070A14 / #0F1424 / #161C30), the
  instrument-blue accent #4DA3FF kept (all chart colours unchanged), plus a blue→cyan gradient
  on the header bar, "Tools" wordmark, selected cluster and primary (.act) buttons.
- **Bug: σ showed as Σ.** Uppercase stat labels turned "σ within" into "Σ WITHIN" (Σ means sum).
  statTile() now wraps σ, x̄ and (s) in `<span class="lc">` (text-transform:none); same for the
  "Include 1.5σ shift" label.
- **Manifest:** the page used an inline data: manifest whose start_url/scope were "../" and
  whose icon paths couldn't resolve from a data: URL; manifest.json in the repo was 0 bytes.
  manifest.json now holds a proper manifest (start_url/scope "./", icons 192/512/svg) and the
  page links to it.
- Cache spc-tools-v20.9-anodized.

# Note for Muse — tool grouping (2026-11-16)
- Sigma ⇄ PPM moved to the **Process** cluster (it is a capability tool); Stack-Up moved to **Measure** beside True Position. **Reference** is now look-ups only: Threads + "Unit converters" (tab renamed from "Convert"). Only data-cluster attributes, cluster subtitles and one tab label changed; IDs unchanged.
- Footer link to Materials Atlas. Cache spc-tools-v20.10-groups.

# Note for Muse — Graphite theme (2026-11-16)
Harsh asked for dark grey. Same `@media screen` layer, colours only: base #17181A, panels #232528 / #2D3033, blue accent and blue→cyan gradient kept, charts and print unchanged. theme-color/manifest #17181A. Cache spc-tools-v20.11-graphite.

# Note for Muse — search, Learn, saved studies, reports, Atlas import (2026-11-16)
All in a new script block before </body> plus CSS before the `.lc` rule. No maths or data changed.
- **Find a tool** search box under the header (keyword map TOOLS in the new script); Enter opens the top hit; keeps the tool-picker label in sync.
- **Learn** tool (data-tab="learn", Reference cluster): control vs spec limits, the three flagged signals, Cp/Cpk/Pp/Ppk with the app's own thresholds (≥1.33 / 1.00–1.33 / <1.00) and actions, Cpk sample-size note (n=30, Cpk 1.33 → ~0.97–1.69 at 95 %, Bissell approximation), Anderson–Darling p<0.05, AIAG %GRR 10/30 and ndc ≥5, AQL meaning incl. normal-inspection-only note, Pareto/True Position/Stack-Up one-liners.
- **Saved studies** (SPC & Capability): Save / Load / Delete in localStorage `spc.studies` (≤100). Header privacy line updated to say studies are kept only when saved, on this device.
- **Report / PDF** bar at the end of SPC, Data Check, Pareto, Gage R&R, True Position, Stack-Up, AQL and Sigma: "Prepared by" (remembered as `spc.preparedBy`) + print with `body.print-tool` (report header with date, name and characteristic; nav, search, buttons hidden; cards may break across pages).
- **Import from Materials Atlas:** `#import=<base64 JSON>` fills the SPC form, runs Analyse, shows an amber note (heat-to-heat variation, <25 values = rough estimate) and clears the hash.
- Tested: search hits, Learn, save→clear→load, report PDF, import; every tool's demo/run with 0 JS errors. Cache spc-tools-v20.12-learn.

# Note for Muse — solid blue accent (2026-11-17)
Harsh asked Claude to drop the blue→cyan gradient. Screen `@media` theme block only: `--grad` removed; primary buttons and selected group tab are solid #2563EB (hover #1D4ED8) with white text (5.2:1); "Tools" heading is solid #60A5FA; top bar is a 2px solid #3B82F6 line with no glow. Red/amber/green stay reserved for chart and status signals; `--cyan` and all chart colours are unchanged, and print is untouched. Cache spc-tools-v20.13-solidblue.

# Note for Muse — Attribute charts, Short-run, Cpk lower bound (2026-11-17)
Built by Claude at Harsh's request. Two new Process tools and one SPC addition:
- **Attribute charts** (`tool-attr`): p, np, c, u charts; Laney p′/u′/c′ limits; "Auto" uses Laney only when the data stays over-dispersed after leaving out periods already outside the standard limits (Pearson χ² p < 0.01 and σz > 1).
- **Short-run** (`tool-short`): PRE-Control setup approval and running pairs; mixed-part chart (deviation from mid-tolerance, or % of half-tolerance) with I-MR limits; machine predictor (Cp/Cpk/PPM from machine σ and the job tolerance), machine list saved in localStorage key `short.machines`.
- **SPC**: "Cpk at least (95%)" tile and sample-size sentence (Bissell lower bound).
- All maths is in the `@@QC-CALC` block. `node tests/qc.test.js` checks it against Montgomery Examples 7.1, 7.3, 7.4 and 8.5 plus 45 numpy/scipy reference cases (tests/qc-reference.json). Keep the block self-contained so the test can extract it.
- Also checked locally on Harsh's own data. Never add his company data (part numbers, machines, costs, files) to this repo. Cache spc-tools-v21-shortrun.

# Note for Muse — Scrap / NCP report (2026-11-18)
New Analyse tool `tool-ncp`. Imports raw NCP exports (.xlsx with many tabs, or CSV; several files at once), finds the header row by column names (NCP, Part Number, Submitted, Work Center, Cost, Root Cause/Reason, Saved, Scrap/Scrapped), ignores hand-typed summary columns on the right, total/note rows and non-NCP tabs (e.g. TREND). Fixes rows whose columns slid one place, counts duplicate NCP numbers once, merges cause spellings that differ only in case/spacing and asks about near-typos. Periods: one per sheet, per week (Sun–Sat) or per month. User picks which charts/tables appear: NCP and pieces control charts (Laney when over-dispersed), cost trend, Paretos by cause (cost and count), part number and machine, and the period × cause totals table (replaces the manual summary). History is kept only in localStorage `ncp.history`; chart choice in `ncp.charts`. Report / PDF via the shared print bar.
Logic is in the `@@NCP-CALC` block. Tests: `tests/ncp.e2e.js` (105 checks in a real browser against the made-up `tests/ncp-fixture.xlsx`, whose true totals come from `tests/make_ncp_fixture.py`) and `tests/smoke.e2e.js` (opens every tool, presses its example, fails on any page error). Cache spc-tools-v22-ncpreport.

# Note for Muse — any NCR format + behaviour tests (2026-11-18)
The Scrap report (now titled "Scrap / NCR report") no longer needs exact column names. `classify()` in the `@@NCP-CALC` block ranks each header by the words in it (NCP, NCR, nonconformance, notification, report #; created/raised/submitted; root cause / cause / defect code; scrap / rejected qty; cost / total cost / unit cost; work center / machine / line …). Quantity and cost columns must hold mostly numbers. A "Columns" panel shows what was matched and lets the user change any; the choice re-reads all sheets by header name. If there is only a unit cost, cost = unit cost × scrap qty. On-screen wording follows the file ("NCRs", "Notifications", "NCPs").
Tests: `tests/formats.e2e.js` (NCR log CSV, ERP notification export, monthly tabs with title rows — all made up, truth in `formats-expected.json`), and `tests/qc.sim.js` (4,000 simulated 40-week histories each: false-alarm rate on stable data, batch-loss data, and detection of a real rise). Run all: `node tests/qc.test.js && node tests/qc.sim.js && node tests/ncp.e2e.js && node tests/formats.e2e.js && node tests/smoke.e2e.js` (the e2e ones need playwright-core and Chrome). Cache spc-tools-v23-ncrformats.

# Note for Muse — Quality Command app (2026-11-18)
New separate app in `command/` (served at /spc-tools/command/), linked from the SPC Tools footer. One file (`command/index.html`) with its own manifest, icon and service worker (cache names start `qcmd-`; the SPC Tools service worker now deletes only `spc-tools-` caches so the two never wipe each other).
What it does: corrective actions (CAPA) with containment, 5 Whys, root cause, actions, close → effectiveness check (+60 days); internal audit programme (frequency → next due) and audit records with a clause checklist in our own wording (an NC opens a CAPA automatically); due dates (calibration, document review, training, supplier evaluation, maintenance) with bulk paste; quality objectives; management review pack that fills the ISO 9001 9.3.2 inputs from the records (and from SPC Tools' saved Scrap/NCR history, same site) and turns review actions into tracked CAPAs, printable to PDF; ISO 9001:2026 transition tracker (clauses 4–10); an "audit readiness" score listing what an auditor would pick on. Data: localStorage `qc.data` only, backup/restore JSON, CAPA CSV. No network requests, no fonts from the web.
Logic (dates, stages, readiness) is in the `@@QCMD` block. Test: `tests/command.e2e.js` (33 checks, Toronto time zone, clock fixed at 21:30 so local ≠ UTC date).
Never add real company records to this repo.

## 2026-11-20: command/ rebuilt as the ISO 9001 Audit Guide (Harsh's request)
The Quality Command tracker was replaced with a reference guide at the same URL. No data blocks. Old `qc.data` in localStorage is left alone and can be downloaded. Cache is `qcmd-v2-guide`. Facts checked: ISO 9001:2026 published 16 Sept 2026, transition ends 30 Sept 2029 (LRQA); surveillance content and the major/minor definitions follow ISO/IEC 17021-1:2015. NC response deadlines are described as set by the CB, not by ISO. Test: tests/command.e2e.js.
- 2026-11-20 v3: Audit Guide restyled (graphite/teal, brass shop examples); Practice tab merges Interview and Drill; clause content now data-driven (CL array) with a cylinder-shop example per clause. Cache qcmd-v3-guide.
