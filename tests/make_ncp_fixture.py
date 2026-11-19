"""Builds tests/ncp-fixture.xlsx: a MADE-UP weekly NCP workbook laid out like
real exports (one tab per week, header variations, a hand-typed summary on the
right, total and note rows, a TREND tab, shifted rows, duplicates, typos).
Also writes tests/ncp-fixture-expected.json: the true totals, computed here
from the generated rows — independently of the app's code.
Run: python3 tests/make_ncp_fixture.py   (needs openpyxl)"""
import datetime as dt, json, random, os
from openpyxl import Workbook

random.seed(11)
HERE = os.path.dirname(os.path.abspath(__file__))
CAUSES = ["Set Up - 1st Part Off", "Tooling - Worn", "Tooling - Broken", "Improper Loading",
          "Incorrect Offset - Tool", "Parts Not Deburred", "Handling Damage", "Program Error"]
MACHINES = [("100 - Brand 'MILL-1' Machine", "MILL-1"), ("MILL-1", "MILL-1"), ("MILL1", "MILL-1"),
            ("200 - Brand 'LATHE-7' Machine", "LATHE-7"), ("LATHE-7", "LATHE-7"), ("300 - Brand 'HMC-3' Machine", "HMC-3")]
PARTS = ["PX-100", "PX-200", "QZ-31", "QZ-32", "RT-9001", "AB-7"]
wb = Workbook(); wb.remove(wb.active)
truth = []          # every real NCP (after de-duplication), as the app should see it
ncp_no = 10000
week0 = dt.date(2026, 1, 4)
sheets = []
for w in range(14):
    start = week0 + dt.timedelta(days=7 * w)
    name = start.strftime("%b").upper() + f" {start.day}-{(start + dt.timedelta(days=6)).day}"
    ws = wb.create_sheet(name); sheets.append(name)
    variant = w % 3
    hdr = ["NCP", "Part Number", "Submitted", "Job", "Dept Found", "Dept Originated", "Work Center", "Cost"]
    if variant == 1: hdr = ["NCP", "NCP Step", "Part Number", "Submitted", "Job", "Dept Found", "Dept Originated", "Work Center", "Cost"]
    hdr += (["Reason", "Root Cause"] if variant == 2 else ["Root Cause"]) + ["Saved", "Scrapped" if variant == 1 else "Scrap"]
    ws.append(hdr)
    col = {h: i for i, h in enumerate(hdr)}
    n = 0 if w == 5 else random.randint(3, 11)        # week 6 has no NCPs
    rows = []
    for k in range(n):
        ncp_no += 1
        cause = random.choice(CAUSES)
        shown_cause = cause
        if cause == "Incorrect Offset - Tool" and k % 2: shown_cause = "Incorret Offset - Tool"   # typo variant
        if cause == "Tooling - Worn" and k % 3 == 0: shown_cause = "tooling - worn "              # case/space variant
        mraw, mname = random.choice(MACHINES)
        part = random.choice(PARTS)
        saved = 1 if random.random() < 0.15 else 0
        scrap = 0 if saved else random.choice([1, 1, 1, 2, 2, 3, 5])
        if w == 9 and k == 0: scrap = 60                                                       # one big batch loss
        cost = round(scrap * random.choice([12.5, 57.95, 149.9, 299.8]) + saved * 9.25, 2)
        date = dt.datetime.combine(start + dt.timedelta(days=random.randint(1, 5)), dt.time(random.randint(6, 17), 5))
        r = [None] * len(hdr)
        r[col["NCP"]] = f"I{ncp_no}"
        if "NCP Step" in col: r[col["NCP Step"]] = "Complete"
        r[col["Part Number"]] = part; r[col["Submitted"]] = date; r[col["Job"]] = f"{300000 + ncp_no}-01"
        r[col["Dept Found"]] = 11; r[col["Dept Originated"]] = 11; r[col["Work Center"]] = mraw
        r[col["Cost"]] = cost; r[col["Root Cause"]] = shown_cause
        if "Reason" in col:
            r[col["Reason"]] = "Dimensional"
            if k == 0: r[col["Root Cause"]] = None; r[col["Reason"]] = shown_cause            # cause only in Reason
        r[col["Saved"]] = saved or None
        r[col["Scrapped" if variant == 1 else "Scrap"]] = scrap if scrap else 0
        shifted = (w == 7 and k < 2)
        if shifted:                                                                            # hand-typed row slid one column
            r[col["Part Number"]] = date; r[col["Submitted"]] = f"{300000 + ncp_no}-01"; r[col["Job"]] = part; r[col["Work Center"]] = None
            mname = None
        rows.append(r)
        truth.append(dict(id=f"I{ncp_no}", sheet=name, week=(start).isoformat(), part=part, cause=cause, machine=mname,
                          cost=cost, scrap=scrap, saved=saved, shifted=shifted))
    for r in rows: ws.append(r)
    # duplicate: week 4 repeats an NCP already logged in week 3
    if w == 3:
        dup = [c for c in ws.iter_rows(min_row=2, max_row=2, values_only=True)][0]
        prev = truth[-n - 1]
        d = list(dup); d[col["NCP"]] = prev["id"]; ws.append(d)
    last = ws.max_row
    ws.cell(last + 1, col["Cost"] + 1, 0 if last < 2 else f"=SUM({ws.cell(2, col['Cost'] + 1).column_letter}2:{ws.cell(2, col['Cost'] + 1).column_letter}{last})")
    if w == 5: ws.cell(2, col["Dept Originated"] + 1, "EXCELLENT WEEK!!")
    # hand-typed summary on the right (deliberately with one wrong number on week 2)
    sc = len(hdr) + 3
    ws.cell(1, sc + 1, "COST"); ws.cell(1, sc + 2, "# PIECES")
    agg = {}
    for t in truth:
        if t["sheet"] != name: continue
        a = agg.setdefault(t["cause"], [0, 0]); a[0] += t["cost"]; a[1] += t["scrap"] + t["saved"]
    for i, (c, (cs, pc)) in enumerate(sorted(agg.items())):
        ws.cell(2 + i, sc, c); ws.cell(2 + i, sc + 1, round(cs + (0.5 if w == 2 and i == 0 else 0), 2)); ws.cell(2 + i, sc + 2, pc)
tr = wb.create_sheet("TREND"); tr.append(["DATE", "COST"])
for s in sheets: tr.append([s, None])
wb.save(os.path.join(HERE, "ncp-fixture.xlsx"))

def agg(rows, key):
    out = {}
    for t in rows:
        k = key(t); a = out.setdefault(k, {"ncps": 0, "pieces": 0, "cost": 0.0}); a["ncps"] += 1; a["pieces"] += t["scrap"] + t["saved"]; a["cost"] += t["cost"]
    return {k: {"ncps": v["ncps"], "pieces": v["pieces"], "cost": round(v["cost"], 2)} for k, v in out.items()}
exp = {
    "sheets": sheets, "ncps": len(truth), "pieces": sum(t["scrap"] + t["saved"] for t in truth), "cost": round(sum(t["cost"] for t in truth), 2),
    "scrapOnly": sum(t["scrap"] for t in truth),
    "bySheet": agg(truth, lambda t: t["sheet"]), "byCause": agg(truth, lambda t: t["cause"]),
    "byMachine": agg(truth, lambda t: t["machine"] or "(not recorded)"), "byPart": agg(truth, lambda t: t["part"]),
    "bySheetCause": agg(truth, lambda t: t["sheet"] + "|" + t["cause"]),
    "shifted": sorted(t["id"] for t in truth if t["shifted"]), "duplicates": 1,
}
json.dump(exp, open(os.path.join(HERE, "ncp-fixture-expected.json"), "w"), indent=1)
print("fixture:", len(truth), "NCPs on", len(sheets), "week tabs + TREND")
