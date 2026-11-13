# SPC Tools

Harsh Patel's personal statistical analysis tools — enter values, get results. All calculations run in the browser; entered values never leave the device.

Live: https://Harsh3261.github.io/spc-tools/

## Tools
- SPC & Capability — individuals chart (moving-range limits), Cp/Cpk/Pp/Ppk, signal flags, capability snapshot, CSV export
- Data Check — histogram with spec overlay, descriptive stats, Anderson–Darling normality
- Gage R&R — crossed ANOVA study per AIAG MSA: EV, AV, PV, GRR, % tolerance, % study, ndc, AIAG verdict
- AQL Lookup — ANSI/ASQ Z1.4 single sampling, normal inspection (Tables I and II-A, arrow rules resolved)
- Pareto — sorted defect chart with cumulative % and the vital few

Methods: AIAG SPC & MSA reference manuals · ANSI/ASQ Z1.4. Published 2026-11-09.

## Publish record
- 2026-11-11 — Convert tab added (inch⇄fraction with 16/32/64 precision and rounding error, inch⇄mm, hardness converter HB/HRC/HRB/HV + approx tensile per ASTM E140, reference only).
- 2026-11-11 — Final release: CSV/paste spreadsheet import with column picker; conversions both ways incl. mm→fraction; example (demo) data labelling with banner and start-empty; background one shade darker #d8dfe6; tab panels min-height + scroll hold so tab clicks never move the page.
- 2026-11-11 — Round 2: Threads tab — basic diameters metric/UN internal/external per ISO 68-1/ASME B1.1 with gauge-cert note; Stack-Up worst-case + RSS and True Position with MMC/LMC bonus; Sigma⇄PPM with 1.5σ shift toggle; "What this means" lines; PPM relabelled "from overall variation"; design/animation polish (opacity-only, reduced-motion aware); root-cause fix for selector first-change scroll — focus auto-scroll removed for dropdowns, keyboard-only minimum scroll for inputs.

## Update — 2026-11-12 (v9)

- Import now accepts Excel .xlsx files (on-device reader, nothing uploaded)
- File picker no longer greys out other file types on iPhone
- Friendly message for unreadable file types
## Update — 2026-11-12 (v11)

- Threads tab rebuilt as a catalogue: dropdowns (family, size, internal/external, class) with manufacturing limits (major/pitch/minor min-max) for Metric ISO 6H/6g and UN 2B/2A from published tables; Gauge verification view (ASME B1.2 values for UN; ISO 1502 nominals for metric); BSP G, Acme, Tr, BA included to verified depth; pipe threads show gauge-plane data with standoff note — no diameter limits.
- AI analysis button on SPC, Data Check and Gage R&R tabs: packages computed results into a copyable prompt for Gemini or Muse; nothing is sent by the app.
## Update — 2026-11-13 (v12)
- SPC tab now detects trend-of-6 (six points steadily rising or falling, Western Electric / Nelson Rule 3) alongside the existing run-of-8: amber Trend signal flag, updated no-signals wording, and a trend line in the AI analysis package.

## Update — 2026-11-13 (v13)
- Threads Gauge verification now carries complete ASME B1.2 gauge limits (GO/NOGO plug and ring pitch diameters, plug majors, setting plugs) for all 28 UN size/class combinations; the 3/8-24 NOGO plug pitch diameter remains marked 'not included — under verification'.
- Correction: the 1/4-20 NOGO ring pitch diameter is 0.2127/0.2130 per ASME B1.2 (v11/v12 showed 0.2123/0.2127, which appears in no B1.2 source).
- Convert: fraction entry is now a single box typed as written (7/16, 1-7/16, 1 7/16) with a swap button between the two fraction directions.
## Update — 2026-11-13 (v14)
- Threads manufacturing catalogue expanded with verified tables: BSP G G1/8–G2 (ISO 228-1), Whitworth BSW/BSF (BS 84), Acme 2G and Stub Acme full limits (ASME B1.5/B1.8), Trapezoidal Tr (ISO 2903), BA (BS 93), and UNEF plus 8/12/16-UN constant-pitch series (ASME B1.1) — 357 rows verified against published sources.
- Corrections: Acme 1/4-16 2G external pitch diameter is 0.2148/0.2043 per ASME B1.5 (was 0.2147/0.2042); the 0 BA row now carries the BS 93:2008 values (the previous row traced to a misattributed web table).
- Custom-size calculators rebuilt on the standards' own formula systems (ASME B1.1 incl. Appendix D for UNS specials, ISO 965-1), validated against printed tables including large diameters to 6.5 in; calculated results carry a distinct Calculated badge and never replace table values. Whitworth remains tables-only.
