"""Three MADE-UP nonconformance exports with different names for everything,
plus their true totals (tests/formats-expected.json). Proves the importer is
not tied to one company's column names. Run: python3 tests/make_formats_fixture.py"""
import csv, datetime as dt, json, os, random
from openpyxl import Workbook
random.seed(5)
HERE = os.path.dirname(os.path.abspath(__file__))
CAUSES = ["Operator error", "Worn tool", "Wrong program", "Material defect", "Setup error", "Fixture issue"]
exp = {}
def tot(rows):
    by = {}
    for r in rows:
        a = by.setdefault(r["cause"], [0, 0.0]); a[0] += 1; a[1] += r["cost"]
    return {"n": len(rows), "pieces": sum(r["pcs"] for r in rows), "cost": round(sum(r["cost"] for r in rows), 2),
            "byCause": {k: [v[0], round(v[1], 2)] for k, v in by.items()}}
# A. generic NCR log, CSV
rows, truth = [], []
for i in range(40):
    d = dt.date(2026, 3, 2) + dt.timedelta(days=random.randint(0, 69)); c = random.choice(CAUSES); q = random.randint(1, 6); cost = round(q * random.choice([18.4, 42.0, 96.5]), 2)
    rows.append([f"NCR-{2400+i}", d.strftime("%m/%d/%Y"), f"P{random.randint(100,105)}", "Bracket", f"WO{5000+i}", random.choice(["Line 1", "Line 2", "Cell 4"]), c, "see photos", q, random.choice(["Scrap", "Rework"]), f"${cost:,.2f}", "Closed", ""])
    truth.append(dict(cause=c, pcs=q, cost=cost))
with open(os.path.join(HERE, "fmt-ncr-log.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["NCR No.", "Date Raised", "Item", "Item Description", "Work Order", "Line", "Defect Category", "Description", "Qty Rejected", "Disposition", "Cost of Nonconformance", "Status", "Closed Date"]); w.writerows(rows)
exp["fmt-ncr-log.csv"] = dict(tot(truth), term="NCR")
# B. ERP quality-notification export, one sheet, unit cost only
wb = Workbook(); ws = wb.active; ws.title = "Export"
ws.append(["Notification", "Notification Type", "Created On", "Material", "Material Description", "Work Center", "Defect Code Text", "Cause Text", "Rejected Qty", "Scrap Qty", "Unit Cost", "Plant"])
truth = []
for i in range(55):
    d = dt.datetime(2026, 5, 4) + dt.timedelta(days=random.randint(0, 80), hours=random.randint(6, 18)); c = random.choice(CAUSES); rej = random.randint(1, 8); sc = random.randint(0, rej); uc = random.choice([4.25, 12.9, 37.5])
    ws.append([300100 + i, "Q3", d, f"M-{random.randint(7000,7004)}", "Shaft", random.choice(["WC-LATHE1", "WC-MILL2"]), "Dimension out of tolerance", c, rej, sc, uc, "1000"])
    truth.append(dict(cause=c, pcs=sc, cost=round(uc * sc, 2)))
wb.save(os.path.join(HERE, "fmt-quality-notifications.xlsx"))
exp["fmt-quality-notifications.xlsx"] = dict(tot(truth), term="notification")
# C. monthly tabs with title rows above the header, plus a Summary tab
wb = Workbook(); wb.remove(wb.active); truth = []
for m, name in [(1, "Jan"), (2, "Feb"), (3, "Mar")]:
    ws = wb.create_sheet(name); ws.append(["Nonconforming Product Report"]); ws.append([f"Month: {name} 2026"])
    ws.append(["Report #", "Date", "Part No.", "Rev", "Lot", "Supplier", "Nonconformance Type", "Root Cause", "Qty Nonconforming", "Qty Reworked", "Total Cost ($)", "Comments"])
    for i in range(random.randint(6, 12)):
        c = random.choice(CAUSES); q = random.randint(1, 5); rw = random.randint(0, 2); cost = round((q + rw) * 23.75, 2)
        ws.append([f"{m:02d}-{i+1:03d}", dt.date(2026, m, random.randint(1, 28)), f"X-{random.randint(1,4)}", "B", f"L{random.randint(10,99)}", "Acme Castings", "Dimensional", c, q, rw, cost, ""])
        truth.append(dict(cause=c, pcs=q + rw, cost=cost))
s = wb.create_sheet("Summary"); s.append(["Month", "Total Cost"]); s.append(["Jan", 0])
wb.save(os.path.join(HERE, "fmt-monthly-tabs.xlsx"))
exp["fmt-monthly-tabs.xlsx"] = dict(tot(truth), term="report", sheets=3)
json.dump(exp, open(os.path.join(HERE, "formats-expected.json"), "w"), indent=1)
print({k: (v["n"], v["pieces"], v["cost"]) for k, v in exp.items()})
