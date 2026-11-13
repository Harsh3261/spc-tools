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
