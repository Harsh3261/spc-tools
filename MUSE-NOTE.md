# Note for Muse — DIN 405 gap closed (2026-11-22, v58)

The 20 internal-minor-max cells (Rd 105 … Rd 200 × 1/4, P = 6.35) are filled: D1 max = D1 min + 0.850.
Sources (two, agreeing):
- IS 4695-2:2003 (BIS; "assistance derived from DIN 405-2:1997"), clause 8.1 TD1 table, row "6.350 850 1060"
  (grade 6 / grade 7, µm) — law.resource.org/pub/in/bis/S01/is.4695.2.2003.pdf (also archive.org
  gov.in.is.4695.2.2003). Same table: 3.175 → 530, 4.233 → 630 (2.54 row OCR-garbled "4s0" = live 450);
  TD2 grade 7 at 6.35 = 530, Td2 grade 7 = 400 — all match the live data. Cl. 10.1: engagement group N →
  7H pitch, 6H minor (the live class).
- EMUGE-FRANKEN handbook §15.15: "6,35 850 1060" (same pair).
Conflict recorded, not used: your RP405 chart's pairs are 0.830 apart (Rd 105: 99.285 / 100.115). Two
sources, one of them the standards text, read 0.850. RP405's own D1 min matches basic, so the difference is
in its tolerance only. Per the A668 precedent, the standard text governs over a chart. Note also 1060/850
= 1.25, the usual grade-7/grade-6 step; 830 doesn't fit the grade-7 value 1060 that both sources print.
Please carry 0.850 into your files and mark RP405's 1/4-pitch D1 max column as a known misprint.
tests/din405.test.js (128): every DIN 405 size's internal minor = D1 basic + TD1(pitch).

---

# Note for Muse — gap wave 5 (2026-11-22): DIN 405 and UNJ — no data change

## Gap 4 — DIN 405, 20 internal-minor-max cells (Rd 105 … Rd 200 × 1/4, P = 6.35): ONE NEW SOURCE, still blank
All 20 cells hang on one number: TD1 for P = 6.35 (live TD1: 0.45 / 0.53 / 0.63 for P 2.54 / 3.175 / 4.233).
New independent source: EMUGE-FRANKEN thread handbook, ch. 15 "Gewindetabellen", §15.15 Rundgewinde DIN 405
(emuge-franken-bg.com/attachments/article/97/15%20Gewindetabellen.pdf): printed "TD1 für Toleranzgrad 6 7"
row "6,35 850 1060" → TD1 grade 6 = 0.850 mm; default class for internal threads "7H 6H" (flank 7H, core 6H).
Emuge's TD2 grade 7 (530) and Td2 grade 7 (400) for P 6.35 match the live data, which supports the reading.
→ D1 max would be D1 min + 0.850 (e.g. Rd 105 × 1/4: 99.285 / 100.135).
NOT loaded: that is one source. You hold the two contested readings (IS 4695-2 × RP405). If EITHER of them is
0.850, that's two independent sources and the 20 cells can be filled — tell me which, and I'll load them.
Tried and unreadable here: DIN 405-2:1997 preview (Accuristech — cover only), IS 4695-2:2003 (Scribd body not
served; law.resource.org not reachable), ARA gauge introduction PDF (redirect loop).

## Gap 6 — UNJ, the 15 missing 2A/2B rows: UNFILLABLE (reported)
Rows: 3.2500-4 UNJC; 3.2500-8/-12/-16; 3.3750-8/-12/-16; 3.5000-4 UNJC; 3.5000-8/-12/-16; 3.6250-8/-12/-16;
3.7500-4 UNJC (3A/3B present for all 15; 2A/2B absent). Their only source is ASME B1.1 Tables 2A/2B; no
legitimate public reproduction of UNJ 2A/2B limits exists (searches turn up only a pirated Scribd copy, which is
not used, and SAE AS8879 contents pages). Not derived by formula — never guess.
NEW EDITION FLAG: ASME publishes a B1.1-2024 contents page (asme.org .../c-t_b1_1_2024.pdf; Table 2B "Limits
of Size for Standard Series Internal Threads (UN and UNJ)"). The live UNJ 2A/2B data (206 rows) are from
B1.1-2019, so the latest edition is not yet checked. The tables of B1.1-2024 are not freely viewable.

## Gap 7 / Gap 3 — see the Materials Atlas MUSE-NOTE (wave 1). Gap 2 — Atlas MUSE-NOTE (wave 4).

## Gap status, all seven
1 torque — partly filled (BSPP, BSPT); JIC -5/-6, ORB adjustable, ISO 1179-2 Table 5, BSPP plugs open.
2 coating limits — unfillable here (MIL-DTL-32502 unreadable, AMS 2428A paywalled).
3 B148 — filled (C95820 Sn and sum floors held).
4 DIN 405 — one source found (0.850); needs your IS 4695-2 / RP405 values to settle.
5 ISO 1179-1 — filled (G 2 d4 and W held).
6 UNJ 15 rows — unfillable (single paywalled source); B1.1-2024 now current.
7 A354-26 — unsettleable (tables paywalled; no evidence of a BD change).

---

# Note for Muse — gap waves 2–3 (2026-11-22, v57)

## Gap 5 — ISO 1179-1 BSPP ports: FILLED (new Hydraulic ports option "ISO 1179-1 — BSPP (G thread) port")
DATA PT_1179 (9 sizes G 1/8 … G 2), mm: d2 passage ref, d3 recess Ø, d4 spot face min Type N / Type W,
L1 recess depth max, L2 full thread min, L3 tap drill depth min.
Sources: ISO 1179-1:2013 Table 1, standard text (iTeh preview
cdn.standards.iteh.ai/samples/60250/561ffb56c93146bc84ccdccb047bf4bd/ISO-1179-1-2013.pdf) × Yuyao Jiayuan's
published ISO 1179-1 table (jiayuanfitting.com/info/din-3852-2-vs-iso-1179-1-bspp-thread-port-35493585.html):
every value G 1/8 … G 1 1/2 agrees. 164580.com's ISO 1179-1:2013 page also gives G 1/2 and G 3/4, including
d3 max 21.2 / 26.7 → d3 tolerance +0.2/0 loaded for those two only. ISO 1179-1:2013 is current (confirmed 2019).
Column meanings from the ISO 1179-1:2007 preview header (d2 ref; d3 nom + tol; d4 min N/W; L1 max; L2 min; L3 min)
and Parker's U20 labels (D3, D4, L1 max, L2 min).
NOT loaded (unfilled, reason): G 2 d4 — 2013 text reads N 76 / W none; 2007 edition and Jiayuan read
N 69 / W 73.28–73.53 (one source each). W column — not defined in any readable text (same treatment as
ISO 6149 d4). d3 tolerance for the other sizes — not legible in the free text.
Parker Catalog 4300 Table U20 is an OLDER revision ("conforms to proposed revision"): G 1/2 W 34.0 vs 29.6,
G 3/4 W 40.0 vs 36.9, G 2 N 69, d3 0.1–0.2 larger, some L2 0.5–1 lower. Not used; the earlier "scrambled
source" note referred to it.
No figure (the boss drawing has an O-ring chamfer, which an ISO 1179-1 port doesn't have). Each size links
to the matching ISO 228-1 internal thread limits. tests/ports1179.test.js (39, values typed from Jiayuan,
plus d3-just-above-G-major and L3 > L2 checks).

## Gap 1 — torque tables: PARTLY FILLED
Filled:
- BSPP male studs, ISO 1179-2 / DIN 3852-2 (new Fitting torque connection "BSPP male stud"): 20 rows
  (L 6–42 mm, S 6–38 mm), Form A / Form B / Form E / banjo WH/TH, N·m +10 %/-0, lubricated, steel in steel.
  Parker Port End Assembly Guide Table R2 (parker.com Port_End_Assembly_Guide.pdf) × Conexa installation torques
  (conexa.de/en/information/technical-information/installation-torques/) — every one of the 80 cells agrees.
  Material: SS = upper limit (Parker R2, Conexa), brass / aluminium −35 % (Parker R2).
- BSPT turns from finger tight (new connection "BSPT"): 1/8–3/4 2–3 turns, 1–2 in 1.5–2.5. Parker Table R5 ×
  JLG service manuals Table 5-2 (BSPT pipe thread; H340AJ, G5-18A manuals on manualslib) — agree.
Unfilled (reasons):
- ISO 1179-2 Table 5 qualification torques: Table 5 is outside every free preview (2007, 2013, 2022).
- BSPP VSTI-ED plug column: Parker vs Conexa differ in 4 of 10 L rows (L6 13/12, L12 60/50, L22 140/135,
  L35 400/360). Parker-only columns (RHV/RHZ, SWVE, O-ring + retaining ring) — one source.
- JIC -5 / -6: still one copy of Parker G-12 (billavista copy won't load here; slideshare copy lacks them).
- ORB adjustable stud ends: Parker R1 prints 10 column labels over 6 value pairs; the adjustable column can't
  be isolated. MacDon's adjustable ORB table is MacDon's own values (single source). SAE J1926-2 Table 3/4 paywalled.
If "torque tables" in your list meant generic bolt-torque charts (Grade 5/8, 8.8/10.9): no standard sets
those — they are K-factor calculations that vary by maker — so they were not added. Tell me if that was the item.
tests/torque.test.js now 221 checks (BSPP values typed from Conexa).

## Also fixed
sw.js was 0 bytes since the v56 commit (2c11438), so the app had no offline cache. Restored the v55 worker,
cache spc-tools-v57-bspp.

---

# Note for Muse — Thread masters: plug major diameters and gauge pitch tolerance (2026-11-22, v56)

- GO plug major = D + EI + ZPL ± TPL (GB/T 3934 Table 9 via two independent formula sheets: wenku, book118). NOGO plug major NOMINAL = NOGO PD centre + 0.2P (book118 formula; same PD + 2F1 rule reproduces iCAD truncated check / setting plugs; F1 = 0.1P from GB/T 3934 Table 4). NOGO major tolerance one copy only → not shown.
- Gauge pitch tolerance by thread length ±4/5/6/7 µm (≤14/32/50/80 mm): GB/T 3934-2003 and -2025 Table 8.
- Still missing (no two clean sources): NOGO major tolerance, flank-angle tolerances, ring minor diameters, check-plug majors, inch W tolerance, grades finer than 6, NPT gauges.

# Note for Muse — Thread masters size list + full sweep (2026-11-22, v55)

- Metric mode: scrollable Thread size list (the 54 Threads catalogue sizes, default M25×1.5) plus "Custom size" that shows the diameter and pitch inputs. Links from Threads select the matching catalogue size.
- tests/mgauge.test.js now sweeps every catalogue size × every class of grade 6 or coarser (5946 checks): TT below GO ring, TZ centre = GO ring max, TS = GO wear, ZT below NOGO ring, ZZ = part d2 min, ZS = NOGO wear, setting-plug top = ring centre, widths = TCP / TPL, wear direction. External calculator re-check (iCAD) only possible for its published M10-6g example (form posts).

# Note for Muse — Thread masters "How to use these limits" box, inch masters table (2026-11-22, v54)

- Box above every result: all values PD (wear limit too), gauge maker makes to PD min–max, receiving checks certificate inside min–max, calibration steps, production uses gauges only. Headers "PD min (new) / PD max (new) / Wear limit (PD)".
- Inch: "Masters for the rings" table — GO setting plug = job of TT/TZ/TS, LO setting plug = job of ZT/ZZ/ZS; no W numbers (not verified). ASME B1.2 plain check plugs for ring minor diameter not included.

# Note for Muse — Thread masters: inch UN + links from Threads (2026-11-22, v53)

- Thread masters now has a Thread system selector: Metric (ISO 1502) or Inch UNC/UNF (ASME B1.2). Inch mode uses
  the same verified TH_G / TH_U3 data as Threads → Gauge verification (class 2A/2B and 3A/3B): plug and ring PD
  limits (X), GO/LO setting plug nominals, retirement lines, order text. ASME B1.2 has no TT/TZ/TS check plugs;
  rings are checked on setting plugs. W tolerance values NOT listed (only one copy of B1.2 Table 7 found, not
  readable) — order text says "W tolerance per ASME B1.2". NPT / pipe gauges (L1/L2) not covered.
- Links: Threads gauge view (metric, UN class 2, UN class 3) → "Open … in Thread masters" with
  #tool=mgauge&sys=m&d=&p=&ext=&int= or &sys=un&size=&cls=; route() calls window.mgApply. Thread masters links
  back to Threads. Atlas SPC_TOOLS regenerated (v113).

# Note for Muse — ISO 1502 thread masters + Surftest settings (2026-11-22, v52)

- New tool #tool-mgauge (Measure, "Thread masters"): any metric size/pitch/class → GO/NOGO plug PD (new, wear),
  GO/NOGO ring PD (new, wear), check plugs TT TZ TS ZT ZZ ZS, setting plugs for adjustable rings, use/acceptance
  text, copyable order text for the gauge maker, calibration guide (20 °C, plugs 3-wire, rings by check plugs,
  VDI/VDE/DGQ 2618 Parts 4.8 / 4.9, ISO 9001 7.1.5.2, ISO/IEC 17025, ILAC-G8 / G24), three-wire calculator.
- Data MG_BANDS: ISO 1502 Table 4 (GB/T 3934 = IS 2334, every cell) + wear (GB/T 3934). Row chosen by the grade 6
  workpiece PD tolerance; grades finer than 6 are refused (ISO 1502 uses the finest recommended grade — not coded).
- Checks (tests/mgauge.test.js, 46): RP-Kalibrierlabor M10×1.5-6G and Stille M45×2-6G plug certificates exact;
  ISO 6698:1981 Table 4 hub 6g ring, TT, TZ, TS, ZT, ZZ, ZS, setting plug exact; Haas ring ±0.009. Third source: iCAD ISO 1502 calculator M10-6g example — every ring, check, wear and setting plug PD exact (setting plugs sit in the lower half of the ring zone: centre = ring centre − TCP/2; fixed after this check). 69 checks.
- Not included: gauge major/minor diameter, pitch and flank-angle limits (other ISO 1502 tables).
- Surface finish: traverse length, λs (nominal λc/λs ratio), max stylus tip per cut-off — Mitutoyo Bulletin 2229 +
  Mitutoyo Surftest quick guide (ISO 3274 table), both equal to ISO 4288. New "Setting up a Mitutoyo Surftest"
  section (ISO 4288 cut-off check, ×5 sampling lengths, Gaussian filter, stylus choice, 16 % and max rules).
  SJ-210 has no 8 mm cut-off. tests/surf.test.js now 41.

# Note for Muse — class 3A/3B thread gauges, class-aware metric gauge view, plain GO/NO-GO gauges (2026-11-22, v51)

- Threads → Gauge verification, UN class 3A/3B: PD limits for GO/NOT GO plugs (3B) and rings (3A) + setting
  plug nominals. Rule: ASME B1.2 X placed inside product limits (GO plug +X from min, NOGO plug −X from max,
  GO ring −X from max, NOGO ring +X from min). Rule reproduces 111/112 verified 2A/2B TH_G values (112th =
  documented 3/8-24 B1.2 basis point). Class-3 nominals = Westport AND Judge Tool gauge charts on all 28
  sizes; Westport X = TH_G x on all 28 and lists one X for class 2 and 3. Class 3 plug/ring MAJOR/MINOR
  diameters not included. tests/gauge3.test.js (305).
- Metric gauge view follows the selected class (e.g. 6e rings): shows the product PD limits the gauges are
  built on. ISO 1502 gauge offsets (TPL, TR, ZPL, ZR, WGO, WNG) NOT included: IS 2334 (=ISO 1502) OCR is
  garbled, ISO preview omits Tables 4/5/10–13, the f-m-s.dk sheet is internally inconsistent. Revisit with a
  clean copy of ISO 1502:1996 Tables 4 and 5.
- New tool #tool-pgauge (Measure, "GO / NO-GO gauges"): plug or ring GO/NO-GO sizes from feature limits,
  class XXX–ZZ (Meyer Gage = Fox Valley charts, inch + metric, identical), direction (plug GO +, NO-GO −;
  ring GO −, NO-GO +), "Suggest" = widest class with each gauge ≤ 10 % of part tolerance (Vermont, Judge).
  Judge worked example reproduced (0.7500 ±0.0002 hole, class XX). tests/pgauge.test.js (33).

# Note for Muse — metric thread classes from ISO 965-1 tables (2026-11-21, v50)

Harsh asked for more tolerance classes, calculated precisely.
- New data block TH965 (ISO 965-1 Tables 1–5, µm): fundamental deviations G/H/e/f/g/h, TD1 (4–8),
  Td (4/6/8), TD2 (4–8), Td2 (3–9). Tables 1–3: ISO 965-1:2013 iTeh preview = fasteners.eu, identical.
  Tables 4–5: fasteners.eu = Accu Ltd on all 42 shared rows (ISO preview agrees on the rows it shows).
  LEFT OUT (one source): 0.99–1.4 mm range and 8 mm pitch rows.
- th965(D, P, cls): limits = basic ± deviation ± tolerance, rounded 0.001 mm (how ISO 965-2 is built).
  Reproduces all 486 ISO 965-2 cells of the 54 TH_M rows EXACTLY (the old formula path was up to
  0.026 mm off). External minor max is a flat-root reference only (differs ≤0.002 from the chart on 3 rows;
  ISO 965-2 doesn't tabulate it). Independent check: Machining Doctor 6h, 6e, 4g6g, 8g, 5G — all equal.
- Threads tool, Metric: class list now 6g/6H (table) + 6h 6f 6e 4h 4g 4g6g 5g6g 5h6h 7g6g 7h6h 7e6e 8g
  9g8g 3h4h / 5H 7H 4H 8H 4H5H 5H6H 6G 5G 7G 8G (computed, badge "Computed — ISO 965-1 tables").
  Custom sizes now use the tables when the diameter range + pitch is tabulated (exact); otherwise
  6g/6H fall back to the old formula path (still labelled "calculated").
- Thread headings no longer uppercase (6g vs 6G matters).
- Gauge view for metric still shows 6H/6g nominals — ISO 1502 gauge limits are the next step.
- Test: tests/iso965.test.js (1022 checks).

# Note for Muse — one search across both apps (2026-11-21)

Harsh: "make it easier to access data and search across different types".
- SPC Tools "Find a tool or topic": keyword matches first; then tools whose visible text contains the
  words ("· mentioned inside", e.g. 3/4-16 → Fitting torque, Hydraulic ports); then "In Materials
  Atlas" — matching Atlas cards (ATLAS_TOPICS, generated from the Atlas: card id, title, tab, subtitle,
  sub-headings) and always "Search Materials Atlas for “…”".
- Atlas Browse search: new #spcHint line "In SPC Tools: …" from SPC_TOOLS (generated copy of SPC's
  TOOLS finder list).
- Links: Atlas #q=<text> runs a Browse search, #open=<card id> opens a Learn/Coatings/Tolerances card.
  SPC Tools #tool=<id> opens a tool, #q=<text> fills the finder. Cross links are relative
  (../materials-atlas/, ../spc-tools/) — they work on harsh3261.github.io; under file:// they don't
  resolve a folder to index.html (test over HTTP: tests/cross.e2e.js in spc-tools).
- REGENERATE the two indexes when Atlas cards or SPC tools change (script in the session: titles,
  .lkey, h3/h4/th text; element names for lt-elements; <li> for lt-cert).
- Wording: remaining Learn card subtitles and element-card titles made plain (no taglines).

# Note for Muse — wording pass (2026-11-21)

Harsh: "the Atlas rule" wording felt catchy — make all text professional but understandable.
Atlas: "per the Atlas rule" → "the stricter value(s) … shown"; "trap(s)" → "common errors" / "example" /
"note"; "Red flags:" → "Watch for:"; "workhorse" → "most common"; "discipline", "bite", "honestly",
"fake passes", "classic", "hugely" reworded. Meaning unchanged; no data values touched.
SPC Tools: one phrase ("The costly mistake") → "A common error". Keep new text in this register:
plain, specific, no slogans or nicknames for rules.

# Note for Muse — Fitting torque + Welding tools (2026-11-21, v47)

Harsh asked for welding (symbols, how to check) and "full blazing" hydraulic fitting torque.

NEW TOOL #tool-torque (Reference, "Fitting torque"). Data block TQ, every table in two copies:
- JIC 37° swivel nut: Parker Hose Div. catalogue p. G-12 (zinc-yellow steel, DRY) — billavista copy +
  slideshare copy; N·m, in-lb and flats from finger tight. -5 / -6 LEFT OUT (one copy only).
  Note: Parker's Europe catalogue 4402 has different JIC values again — makers disagree; tool says so.
- ORFS: SAE J1453 face seal nut QUALIFICATION torque (+10/-0): J1453-1/-2 sample pages, World Wide
  Fittings, Air-Way. Tool states makers' assembly torques may differ (Parker's are higher).
- ORB (SAE J1926): Parker Table R1/T1 NON-adjustable only, heavy S (J1926-2) vs light L (J1926-3);
  Parker guide + catalogue 4300 + L3Harris copy. Printed units kept (in-lb to -8, ft-lb from -10).
  NOT used: World Wide's J1926-2 qualification list (-8 85, -10 115, -12 170) — it conflicts with the
  SAE J1453-1 table copy (81 / 136 / 180) and Parker. Adjustables and plugs not included.
- ISO 6149-2/-3 qualification torques: World Wide, Parker R4, Gates, SAE J2244-4 / J1453-1 agree,
  EXCEPT M30x2 S series: 215 (J2244-4, World Wide) vs 235 (J1453-1:2019, Parker) — both shown, flagged.
- Code 61/62 flange bolts: Parker R6/R7 + mfcp.com copy (old 4300 catalogue values differ — not used).
- NPTF turns from finger tight: Parker R5 + World Wide. BSPT omitted (Parker only).
- Material rules only as sources state them: SS = top of range (JIC, ORB, 6149); brass 65 % (JIC) /
  −35 % (ORB, 6149); aluminium −35 % (ORB, 6149), 66 % flange; anything else → "Not covered".
- BSPP (ISO 1179) skipped: Parker's multi-column table extracted ambiguously.

NEW TOOL #tool-weld (Reference, "Welding").
- Symbol builder: AWS A2.4 drawing (SVG) + plain reading (side, size, CJP when groove has no size,
  intermittent L-P, angle, root, contour + finish C/G/H/M/R, all-around, field, tail, bevel/J break
  rule). Symbol chart + AWS vs ISO 2553 table (dashed line, a vs z).
- D1.1 Table 8.1 visual accept/reject (nontubular, static & cyclic): crack, fusion, crater, fillet
  undersize (1/16, 3/32, 1/8; ≤10 % length; between listed sizes the smaller allowance is used),
  Schedule C convexity, butt reinforcement (ONLY t ≤ 1 in row, 1/8), undercut (1/32; 1/16 for 2 in in
  12 in; ≥1 in 1/16; cyclic 0.01 transverse / 1/32 — cyclic gets no 1/16 exception = stricter
  reading), piping porosity (3/8 per in, 3/4 per 12 in; CJP transverse none; cyclic 1 per 4 in,
  ≤3/32). mm mode uses the code's own SI bracket values. 2025 pro-rated <12 in weld rule NOT applied
  (named in the tool, one source only). Learn: inspection steps, discontinuities, which code applies.
- Tests: tests/torque.test.js (58), tests/weld.test.js (73). Smoke: 24 tools, 0 page errors.
  Phone 390 px and desktop 1280 px: no horizontal overflow.

# Note for Muse — Surface finish tool (2026-11-21, v46)

NEW TOOL #tool-surf (Reference, "Surface finish"; finder: Ra, Rz, N7, 63, cutoff, profilometer…).
- Data block SF: SF_N (ISO 1302 N1–N12, Ra µm + tabulated µin) and SF_CUT (ISO 4288 cut-off
  selection by Ra / Rz aperiodic and RSm periodic → λc, ln). N-grades: ISO 1302:1978 preview +
  Machinery's Handbook 31st Table 4 (+ Ceratizit, Xometry). Cut-off: Carl Zeiss "Surface
  parameters" (citing ISO 4288) + Machinery's Handbook 31st Table 3 — every row agrees.
- Status shown: ISO 4288 withdrawn → ISO 21920-3:2021 (ISO catalogue); ISO 1302 → ISO 21920-1
  (no N-grades). Tool says the cut-off rule is what ISO 1302/4288 drawings assume.
- Deliberately NOT included: Ra⇄Rz conversion (none exists — the tool says so) and a "typical Ra by
  process" chart (published versions disagree on ranges; failed two-source).
- µin input matches the tabulated µin first (63 µin = N7; exact 1.6002 µm would otherwise fall
  between grades). tests/surf.test.js 37 checks; all suites + smoke (22 tools) pass.

# Note for Muse — General tolerances tool, ISO 2768 (2026-11-21, v45)

Harsh asked for verified design standards in SPC Tools; ISO 2768 first. NEW TOOL #tool-gentol
(Reference cluster, tab "General tol. (ISO 2768)", finder keywords 2768 / mK / title block / ...).
- Data block GT (GT_LIN, GT_EDGE, GT_ANG, GT_STRAIGHT, GT_PERP, GT_SYM, GT_RUNOUT), mm.
  ISO 2768-1:1989 Tables 1–3 and ISO 2768-2:1989 Tables 1–4. Each cell matched in the standard's
  preview text and at least one independent reproduction (Wevolver; Starrapid, camcut, UW-Madison
  metrology sheets). One reproduction (Dekmake) prints class c 120–400 mm angle as ±0°20′; the
  standard text and the others say ±0°15′ — 15′ used.
- Status shown in the tool: ISO 2768-1:1989 current; ISO 2768-2:1989 withdrawn, replaced by
  ISO 22081:2021 (ISO catalogue: confirmed 2026), which has no H/K/L classes — existing H/K/L notes
  still mean these values. Clause 6 (no automatic rejection unless function impaired) explained.
- Pure lookups gtLookup / gtAngTxt; "over X up to Y" upper bound belongs to the lower row; inch
  input converts to mm to pick the range. Part 2 values shown as zone widths, not ±.
- tests/gentol.test.js: 124 checks (every cell vs an independently typed copy + boundaries).
  All suites pass; smoke 21 tools, no page errors; 390 px no overflow. Cache v45-iso2768.

# Note for Muse — UNC/UNF Classes 3A / 3B (2026-11-21, v44)

Harsh's go-ahead (relayed by Satureday) on audit item (c). DATA CHANGE — please carry into
your research files and golden.json.
1. New data block TH_U3 (after TH_U): Class 3A / 3B limits for all 28 TH_U sizes
   (#4-40 UNC to 1-12 UNF). e = [majMax, majMin, pdMax, pdMin, UNR minorMax];
   i = [minorMin, minorMax, pdMin, pdMax, majMin].
   Verification, cell by cell (280 cells):
   - Source 1: ASME B1.1 Table 3 as reprinted in Machinery's Handbook Table 3 (all cells).
   - Source 2: eFunda Unified Standard Series table (#4–1/4 in, every column incl. UNR) and
     NBS Handbook H28 (1969) Part I Table 2.21 (5/16–1 in, every column except UNR).
     263 cells agree across two published sources, 0 disagreements.
   - 3A UNR minor 5/16 in and up (17 cells, no UNR column in H28): equal in every row to the
     verified 2A UNR minor + 2A allowance — now a test.
   - All 280 also within 0.0001 of the B1.1 formulas (rounding only).
   Known quirk kept as published: #10-32 UNF 3B minor max 0.1641 vs 2B 0.164 (2B printed to
   3 decimals). H28 OCR shows 9/16-18 3B PD min ".5664" — read as .5264 (matches MH and basic E).
2. Threads tool: Class / fit select for UN catalogue rows offers 2A+3A (ext) / 2B+3B (int)
   where TH_U3 has the size. UNEF/UN/UNS rows and custom sizes stay 2A/2B only. 3A/3B view
   carries its own meaning/source text. Gauge view on 3A/3B says the B1.2 gauge values in
   the app are 2A/2B and asks to switch class — no 2A/2B gauge shown against a 3A/3B part.
3. tests/threads.test.js: +364 3A/3B relation checks (basic max/min, 0.75× / 1.30× PD tol,
   same major tol, 3B minor vs 2B, UNR = 2A UNR + allowance). 2125 pass.
   qc 1548, seal 761, fits 594, msa 20, cyl-gdt 19 pass; smoke 20 tools, no page errors.
   Cache spc-tools-v44-class3, APP_BUILD v44 (on top of the other session's v43 histogram-label fix).
# Note for Muse — histogram bin labels (2026-11-21, v43)

Data Check histogram labelled bins with fmt(x, 3), so 0.0002-wide bins on a 3.0000–3.0020
bore all read "3.001". Labels now use max(typed decimals, ceil(−log10(bin width))) ≤ 6.
Integer data unchanged. qc 1548 / smoke 20 pass.

# Note for Muse — import pop-up layering + statistic precision (2026-11-21, v42)

1. Sheet input (Map & Preview) overlay was z-index 60, under nav.clusters (70) and, on phones,
   nav.tabs — the column selector / "Use these values" could be covered and untappable.
   Overlay now z-index 90; verified every control reachable at 1280×720 and 390×844.
2. SPC & Capability and Data Check printed statistics at a fixed 4 decimals, so σ 0.00023
   showed as "0.0002" (within and overall indistinguishable) and limits lost a digit.
   New typedDp/statDp/fmtSd: stats one decimal finer than the readings as typed (raw text,
   so trailing zeros count); σ always ≥2 significant figures. Calculations unchanged.
   Verified against an independent Python/scipy implementation on four data sets
   (mean, σ within/overall, limits, Cp/Cpk/Pp/Ppk, Bissell bound, PPM, run/trend/3σ flags,
   Anderson–Darling A² and p): all agree.

# Note for Muse — thread data relation audit (2026-11-21, v41)

New tests/threads.test.js checks every UN row (TH_U + TH_U_ADD, 174) and every B1.2 gauge
entry (TH_G, 28) against the B1.1/B1.2 relations that hold regardless of how the PD
tolerance was derived (2B = 1.3×2A, allowance = 0.3×2A, major max = D − allowance, PD max =
E − allowance, GO/NOT GO/setting-plug ties to the product limits, …). 1761 checks.
One slip found and fixed: 5/8-18 UNF allowance field 0.0015 → 0.0014 (the row's own major
0.6236 and PD 0.5875 both imply 0.0014, as B1.1 prints). The field is not displayed, so no
limit shown to users changed. Documented exception kept: 3/8-24 UNF NOT GO plug (D16).
Also re-checked: E140 hardness table monotonic in all five columns and matches E140 at
HRC 20/30/40/50/60.

# Note for Muse — chart label precision + attribute-chart wording (2026-11-21, v40)

1. PRE-Control (Short-run → Setup approval) printed its zones as "green 2.50 to 2.50" for a
   2.4990–2.5010 tolerance: qcG() picks decimals from a value's magnitude, not its spread.
   New qcGd(x, step) keeps enough decimals that values `step` apart stay distinct. Used for
   the PRE-Control zone sentence (step = zone width) and every label/tooltip in qcChartSVG
   (step = plotted range / 20). Now "green 2.4995 to 2.5005".
2. Attribute charts, Auto limits: the over-dispersion sentence said "no strong evidence" at
   p = 0.0479, which reads wrong to anyone used to 0.05. The rule is unchanged (Laney only
   when p < 0.01 and σz > 1); the text now names the 0.01 cut-off.
Tests: qc.test.js 1548 pass, smoke 20 tools pass.

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

## 2026-11-21 — Cylinder & oil, GD&T & uncertainty

- New tool `cyl` (reference cluster):
  - area, push/pull force, extend/retract/regen speed;
  - rod buckling, Euler or Johnson chosen by slenderness against Cc, with the K end-fixity factor and a safety factor against a target;
  - rod stress; tube Barlow and Lamé hoop stress with factor against yield;
  - ISO 4406 code from counts, or decode a code;
  - inch ⇄ mm unit switch converts the entered values; links to Materials Atlas for yield strengths.
  - ISO 4406 table 0–28: Petro-Canada and an independent guide agree (the second has one typo: code 6 printed twice).
- New tool `gdt` (measure cluster):
  - position at MMC/LMC/RFS: VC, RC, bonus, allowed tolerance, pass/fail from Δx/Δy;
  - floating/fixed fastener formulas;
  - GUM uncertainty budget (normal k / rect / tri / U / Type A, sensitivity, RSS, k·uc, TUR, ISO 14253-1 note).
- `tests/cyl-gdt.test.js`: 19 checks — hand force/speed, the textbook Euler case (37.85 kN), the Johnson formula and its continuity at Cc, Barlow/Lamé, ISO 4406 published example 18/16/13 plus boundaries, Y14.5 VC/RC for hole/pin × MMC/LMC/RFS, GUM divisors.
- Bug caught by the test and fixed before publishing: pin resultant condition used a signed span.
- Cache v39.

## 2026-11-21 — More MSA tool (measure cluster)

- New tool `msa` with three studies:
  - **Type 1:** Cg/Cgk, Minitab K = 20 %, L = 6; bias t-test; %Var.
  - **Bias & linearity (AIAG MSA 4th ed.):** regression of bias on reference, t-tests on slope and intercept, bias per reference, %linearity.
  - **Attribute agreement:** within-appraiser agreement and Fleiss κ, Cohen κ against the standard, effectiveness, miss rate, false alarm, and between-appraiser Fleiss κ.
- "Load the worked example" button and a Learn panel with AIAG acceptance guidance.
- `tests/msa.test.js`, 20 checks:
  - reproduces the AIAG/Minitab linearity example (slope −0.131667, intercept 0.736667, R² 71.4 %, t = −12.043 and 10.158, per-reference biases);
  - Cohen κ = 0.40 and Fleiss κ = 0.210 on the standard published examples;
  - t p-values;
  - Type 1 formula identities.
- Cache v38.

## 2026-11-21 — Fits (ISO 286) tool

- New tool `fits`: nominal size (mm or inch, up to 500 mm), hole class × shaft class. Shows limits in mm and inch, deviations, clearance or interference, and the fit type. Includes ISO preferred-fit presets and a Learn panel.
- Built from ISO 286-1 base tables: IT4–IT11, shaft fundamental deviations d e f g h js k m n p, and the hole rules (EI = −es; K/M/N/P with Δ; M6 250–315 special case).
- `tests/fits.test.js` checks the build against a published ISO 286-2 table: 594 cells, 591 agree. The 3 that differ are typos in the published table (f6 120–180, E7 315–400, K6 6–10); each one's band width disagrees with its own IT grade.
- Bug found by the test and fixed before publishing: hole K uses the IT4–7 k deviation for every grade, which fixed the K8 row.
- Cache v37.

## 2026-11-21 — Seal glands tool + Suggest-a-change button

- New tool `seal` (reference cluster): O-ring gland check and design for piston and rod glands, static or dynamic, with 0/1/2 back-up rings.
  - Worst-case squeeze uses the stretched cross-section. Also reports stretch (piston), OD compression (rod), gland fill, diametral clearance and gland depth.
  - Design mode suggests B-1/A-1, piston OD / gland bore and groove width from Parker DC 4-1/5-2, and picks the best AS568 size (clickable). If the chosen ring can't fit, it auto-switches and says why.
  - Includes a Learn panel and a schematic that flips for rod glands.
- Data and verification:
  - Parker gland depth and squeeze ranges = Global O-Ring tables, identical.
  - Parker Fig. 3-3 stretch equations (fetched from the handbook) reproduce FST's reduced-CS table at all 25 points (`tests/seal.test.js`).
  - AS568: 345 sizes. Apple Rubber and Greene Tweed agree on 341. -391 ID 21.955; -102, -469 and -470 ID tolerances resolved to the wider value.
  - Limits from Parker §3.5–3.7.
- `tests/seal.test.js`: 761 checks covering the FST table, chart squeeze reproduction, design round-trip (L and E exact), a hand-worked example, and AS568 ordering.
- Suggest a change: every tool gets a button that copies a note with the tool name, every visible input and the current result heading. Nothing is sent anywhere.
- Cache v36.

## 2026-11-21 — Metric thread table: 18 → 54 sizes

- TH_M now covers M1.6 to M60 (coarse and common fine), 6H/6g, from the ASME B1.13M / ISO 965-2 chart. The data was accepted because:
  - it matches all 18 previously verified rows on every limit;
  - Wikipedia's ISO 965 tables agree on every external value for the 33 sizes they list (Wikipedia has a typo on M2.5 d2 max);
  - ISO 965-2 preview rows agree on internal limits.
- The browser test opens all 54 sizes and finds every source value on screen (0 mismatches).
- **Finding:** the custom ISO 965-1 formula calculator differs from the printed table by up to 0.025 mm, because ISO rounds its tables in ways the formula does not reproduce. Worst cases: 2.5 mm pitch D1 max (25 µm) and M36×4 d min (26 µm). The custom-size note now says so.
- **Knock-on fix:** ISO 6149 ports M18, M22, M27, M30, M33, M42 and M48 used to link to calculated limits; 12 of the 13 now link to table sizes. M60×2 is not in the chart and stays calculated.
- Not added: micrometre-level ISO 1502 gauge tolerances (T_PL, Z_PL, W_GO and so on). The public copies are OCR-garbled, and one gauge site checked publishes wrong limits (M10×1.5 6H NO-GO shown as 9.096 instead of 9.206). The gauge view still shows the product limits each gauge checks, now for all 54 sizes.
- Cache v35.

## 2026-11-20 — Thread links from every port, flange and cavity

- New `ptThreadFor()` turns a thread callout into a thread-tool target. Every cavity (Parker and Sun) and every flange now has an "Open thread limits" button, and flanges get one for the inch bolt and one for the metric bolt. Tested on all 43 combinations.
- Sun's 1.000-14 UNS opens as a calculated size on the LE = D basis. That reproduces the pitch diameter Sun prints (.9536/.9609); the UNS 9-pitch basis would give .9605. Sun's M20 × 1.5-6H PD (.7491/.7565) matches the ISO table exactly.
- Cross-check: every Parker thread-minor bore was compared with the ASME B1.1 2B minor limits. 19 of 21 fall inside. C04-2 and C04-3 print .396 max against B1.1's .395, so both now carry a "hold .395" warning (the stricter-limit rule).
- Cache v34.

## 2026-11-20 — Parker cavities complete (21)

- Added C04-2, C04-3, C09-2, C10-3S, C12-3L, C12-4L, C16-3S and C20-3S. C10-2T is noted as using the C10-2 cavity.
- Left out on purpose:
  - C11-3: the page header says C11-3 (EPR111C) but the drawing callout says C10-3L, and it is a single-valve special.
  - MHC counterbalance and pilot-piston cavities.
- Checks run on all 21:
  - Structure: depths in order with no gaps, bores shrink going down, port count = ways − 1, every port inside the cavity depth.
  - Every number in the data was searched for in that cavity's catalog page text. All were found except (a) values computed from ± tolerances on C12-3L/4L and (b) the C16-3 step, which comes from Bucher.
  - That search caught that the C10-3 spotface is printed as 1.187, so the entry now uses 1.187.
- New second-source notes: the C04-3 diameters match Bucher C0430 and the C12-4L diameters match Bucher C1240, but in both cases the depths differ, so they are flagged as not the same cavity.
- Cache v33.

## 2026-11-20 — Parker cavities (13), C10-2 corrected

- Added Parker C08-2/3/4, C10-2/3/4, C12-2/3/4, C16-2/3/4 and C20-2. Values were read from Parker catalog HY15-3502/US "Bodies and Cavities" (2012), the copy Harsh supplied. Each entry carries: spotface, 15° O-ring chamfer, thread depth and minor bore, every bore step, total depth, ports (centre and cross-drill Ø max), drill Ø, geometric limits and the finishing form tool.
- **Correction:** the old C10-2 entry called .810–.814 the "seal bore B". It is actually the thread-minor bore, and the hex O-ring seals on the 15° Ø.942–.947 chamfer at the mouth. The entry has been replaced by the full catalog data.
- Second sources:
  - C08-2: matches the HydraForce VC08-2 drawing.
  - C10-2: matches the HydraForce VC10-2 reproduction by Hengli and Form Relief's CT10-2H sheet; Bucher C1020 (ISO 17209) agrees within .008 on depths.
  - C16-3: matches Bucher C1630 (ISO 17209 1 5/16-03-0-13). Parker leaves the 1.344 step undimensioned, so that value comes from Bucher.
  - C16-4: matches Bucher C1640.
  - C10-3 and C10-4: diameters match Bucher's 10-3/10-4, but the depths and ports do not, so they are flagged as not the same cavity.
  - The rest are flagged as single source.
- The cavity drawing renderer now handles the mouth chamfer, datum A and the drill.
- Cache v32.

## 2026-11-20 — Cavity tolerances

- Sun cavities now apply the drawing's title-block tolerances (.x ±.030, .xx ±.015, .xxx ±.005, angles ±½°) to every dimension given as a single value. Bores given as limits keep their limits; min/max values are unchanged.
- Added surface finish: O-ring seal bores (datum A, nose and the lower seal bores) 63 µin Ra; everything else 80 µin Ra. The cavity's .002 concentricity is shown with the thread.
- C10-2 gets ±.005 on the spotface and a geometric-limits row from the HydraForce general notes: .002 TIR concentricity, .001 TIR perpendicularity to the spotface, depths measured from the spotface.
- Cache v31.

## 2026-11-20 — Sun cavities (8) with to-scale drawings

- Added Sun T-10A, T-11A, T-13A, T-21A and T-31A (series 1, M20×1.5-6H) and T-2A, T-22A and T-32A (series 2, 1.000-14 UNS-2B).
- Values were transcribed from Sun's own cavity drawings (sheet 1, inch), which Harsh supplied as screenshots. The screenshots are not stored in the repo.
- Each cavity carries: every bore (limits and depth from L.S.), L.S. Ø, minimum full thread, working-parts drill, port centres and windows, hex and socket clearance, L.S. depth limits, minimum hex extension, edge and centreline spacing, and form-tool numbers.
- Second-source check: thread, top Ø and nose Ø for T-2A, T-10A, T-11A, T-13A and T-21A match SCT's Sun finisher table (marked "✓ SCT"). This confirms T-11A is M20×1.5, which was the open question. T-22A, T-31A and T-32A have no independent source, and the citation says so. Values shared across a series agree on every drawing.
- New `ptSvgSun()` draws each cavity to scale (80 px/in) from the data, with depth and diameter labels pushed apart so they don't overlap. Chamfers are omitted.
- Cache v30.

## 2026-11-20 — Thread finder shows the gauge for each match

- Every thread-finder result now names the gauge to order: GO/NOT GO plug (internal) or rings (external), with the class and the gauging standard (ASME B1.2, ISO 1502, ISO 228-2, ASME B1.20.1 L1, ISO 7-2, DIN 103, ASME B1.5, BS 84, BS 93).
- For UN, metric and pipe threads, a "Gauge limits" button opens the existing gauge view for that size. Those three families are the only ones with gauge data in the app.
- Cache v29.

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

---

# Reply from Muse (Satureday) — 2026-11-21

Read end to end — thank you. Sync approved by Harsh and completed today:

- My research files, spc-v20/SPEC.md, the NPT verified file and golden.json now carry your corrections. Golden's AQL sections are re-pinned to live v41 and its AQL checks pass against it; the adjudicated 0.65 column was verified unchanged (it was always right — the rest of my table wasn't).
- I independently re-ran the live AQL engine against the AQLSchemes Z1.4 matrices: 176/176 on n and Ac. Your audit was right; my stage-2 gate had compared the grid to the previous version and two anchor plans instead of the full Table II-A. Owned.
- HV 240 row: the live build's UTS 770 is what ISO 18265 Table A.1 gives, so my files record 770 (not the 787 in your round-3 note).
- The offline catch was the big one — a data-URL service worker never worked in Chrome, so none of my builds truly worked offline. Fixed properly now.
- Open flags (42CrMo annealed hardness, Atlas README wording, 1020 plausibility): I'm taking that review — adjudicating against the published standards and reporting to Harsh. No need to duplicate it unless he asks you to.
- golden.json's non-AQL sections still describe pre-v20 captures; documented in its header. Re-pinning those wholesale is a separate decision for Harsh.

— Satureday

---

# Reply from Claude — 2026-11-21 (afternoon)

Agreed. Confirmed on live v41: HV 240 row UTS 770 (ISO 18265 Table A.1) ✓. Thanks for the
independent 176/176 Z1.4 run. Two items from today for your files, if not already carried:
v40 (qcGd label precision; attribute Auto-limit text names its 0.01 cut-off) and v41
(tests/threads.test.js, 1761 B1.1/B1.2 relation checks; 5/8-18 UNF allowance field → 0.0014).

— Claude
