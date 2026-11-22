/* Fitting torque data + lookups. Expected values typed independently from the sources
   (Parker G-12, SAE J1453 samples, Parker R1/R4/R5/R6/R7, World Wide Fittings, Gates, mfcp.com).
   Run: node tests/torque.test.js */
const fs = require("fs"), path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = s.indexOf("/* BEGIN DATA TQ:"), b = s.indexOf("(function(){", s.indexOf("function tqAdjust"));
eval(s.slice(a, b).replace(/\bvar (TQ_\w+)/g, "global.$1").replace(/, (TQ_NM_PER_INLB)/, "; global.$1").replace(/function (tq\w+)/g, "global.$1 = function"));
let n = 0; const fails = []; const eq = (l, g, e) => { n++; if (JSON.stringify(g) !== JSON.stringify(e)) fails.push(l + ": " + JSON.stringify(g) + " vs " + JSON.stringify(e)); };
const near = (l, g, e, tol) => { n++; if (Math.abs(g - e) > (tol || 1e-6)) fails.push(l + ": " + g + " vs " + e); };

/* JIC — Parker G-12 (dash: N·m, in-lb, flats) */
const jic = { "-4":[[15,17],[130,150],2], "-8":[[59,65],[525,575],1], "-10":[[68,79],[600,700],1], "-12":[[107,119],[950,1050],1],
  "-16":[[158,170],[1400,1500],1], "-20":[[215,237],[1900,2100],1], "-24":[[254,288],[2250,2550],1], "-32":[[339,384],[3000,3400],1] };
eq("JIC sizes", TQ_JIC.map(r => r[0]), Object.keys(jic));
TQ_JIC.forEach(r => { eq("JIC " + r[0], [r[2], r[3], r[4]], jic[r[0]]);
  /* the source's N·m and in-lb columns must describe the same torque within rounding */
  near("JIC " + r[0] + " lo N·m vs in-lb", r[3][0] * TQ_NM_PER_INLB, r[2][0], 0.9); near("JIC " + r[0] + " hi", r[3][1] * TQ_NM_PER_INLB, r[2][1], 0.9); });
eq("JIC no -5/-6", ["-5","-6"].map(k => tqLookup("jic", k)), [null, null]);
eq("JIC threads", TQ_JIC.map(r => r[1]), ["7/16-20","3/4-16","7/8-14","1-1/16-12","1-5/16-12","1-5/8-12","1-7/8-12","2-1/2-12"]);

/* ORFS — SAE J1453 face seal qualification torque */
eq("ORFS", TQ_ORFS.map(r => r[0] + " " + r[1] + " " + r[2]), ["-4 9/16-18 25","-5 5/8-18 30","-6 11/16-16 40","-8 13/16-16 55","-10 1-14 60",
  "-12 1-3/16-12 90","-14 1-5/16-12 115","-16 1-7/16-12 125","-20 1-11/16-12 170","-24 2-12 200"]);
const o8 = tqLookup("orfs", "-8"); near("ORFS -8 lo", o8.nm[0], 55); near("ORFS -8 hi +10%", o8.nm[1], 60.5);

/* ORB — Parker R1 non-adjustable: heavy S, light L */
const orbS = [null,null,"310 in-lb","360 in-lb","420 in-lb","720 in-lb","100 ft-lb","135 ft-lb","175 ft-lb","200 ft-lb","250 ft-lb","305 ft-lb","375 ft-lb"];
const orbL = ["85 in-lb","155 in-lb","260 in-lb","280 in-lb","350 in-lb","620 in-lb","85 ft-lb","135 ft-lb","175 ft-lb","200 ft-lb","250 ft-lb","305 ft-lb","375 ft-lb"];
eq("ORB dashes", TQ_ORB.map(r => r[0]), ["-2","-3","-4","-5","-6","-8","-10","-12","-14","-16","-20","-24","-32"]);
eq("ORB S", TQ_ORB.map(r => r[2] ? r[2].join(" ") : null), orbS);
eq("ORB L", TQ_ORB.map(r => r[3] ? r[3].join(" ") : null), orbL);
near("ORB -8 S 720 in-lb = 81.3 N·m (Parker prints 81)", tqLookup("orb", "-8", { series:"S" }).nm[0], 81.349, 0.01);
near("ORB -10 S 100 ft-lb = 135.6 N·m (Parker prints 136)", tqLookup("orb", "-10", { series:"S" }).nm[0], 135.58, 0.01);
near("ORB -4 S = 35.0 N·m (Parker prints 35)", tqLookup("orb", "-4", { series:"S" }).nm[0], 35.03, 0.01);
eq("ORB -2 S none", tqLookup("orb", "-2", { series:"S" }).none, true);

/* ISO 6149 */
eq("6149 threads", TQ_6149.map(r => r[0]), ["M8x1","M10x1","M12x1.5","M14x1.5","M16x1.5","M18x1.5","M20x1.5","M22x1.5","M27x2","M30x2","M33x2","M42x2","M48x2","M60x2"]);
eq("6149 S", TQ_6149.map(r => r[1]), [10,20,35,45,55,70,80,100,170,[215,235],310,330,420,500]);
eq("6149 L", TQ_6149.map(r => r[2]), [8,15,25,35,40,45,null,60,100,130,160,210,260,315]);
const m30 = tqLookup("6149", "M30x2", { series:"S" }); eq("M30 disputed", m30.disputed, [215,235]); near("M30 overlap top", m30.nm[1], 258.5);
eq("M20 L none", tqLookup("6149", "M20x1.5", { series:"L" }).none, true);

/* Flanges — Parker R6/R7 */
eq("C61", TQ_FLG.c61.map(r => [r[0], r[2], r[3], r[4], r[5], r[6]]), [["-8","5/16-18",17,"M8",24,true],["-12","3/8-16",31,"M10",50,true],["-16","3/8-16",31,"M10",50,true],
  ["-20","7/16-14",52,"M10",50,true],["-24","1/2-13",77,"M12",92,true],["-32","1/2-13",77,"M12",92,false],["-40","1/2-13",77,"M12",92,true],
  ["-48","5/8-11",155,"M16",210,true],["-56","5/8-11",155,"M16",210,true],["-64","5/8-11",155,"M16",210,true],["-80","5/8-11",155,"M16",210,true]]);
eq("C62", TQ_FLG.c62.map(r => [r[0], r[2], r[3], r[4], r[5], r[6]]), [["-8","5/16-18",17,"M8",24,true],["-12","3/8-16",31,"M10",50,true],["-16","7/16-14",52,"M12",92,true],
  ["-20","1/2-13",77,"M14",130,false],["-24","5/8-11",155,"M16",210,true],["-32","3/4-10",265,"M20",400,true]]);
near("C62 -32 inch = 359.3 N·m", tqLookup("flg", "-32", { code:"c62" }).nm[0], 359.29, 0.01);
eq("C61 -24 metric", tqLookup("flg", "-24", { code:"c61", bolt:"metric" }).nominal, [92, "N·m"]);

/* NPTF */
eq("NPTF", TQ_NPTF.map(r => r[1].join("-")), ["2-3","2-3","2-3","2-3","2-3","1.5-2.5","1.5-2.5","1.5-2.5","1.5-2.5"]);

/* Material rules */
const j8 = tqLookup("jic", "-8");
eq("JIC SS = top of range", tqAdjust("jic", j8, "ss").nm, [65, 65]);
near("JIC brass 65 %", tqAdjust("jic", j8, "brass").nm[0], 38.35);
eq("JIC aluminium not covered", tqAdjust("jic", j8, "al").covered, false);
const r8 = tqLookup("orb", "-8", { series:"S" });
near("ORB al −35 %", tqAdjust("orb", r8, "al").nm[0], r8.nm[0] * 0.65);
near("ORB SS upper limit", tqAdjust("orb", r8, "ss").nm[0], r8.nm[0] * 1.1);
near("Flange al 66 %", tqAdjust("flg", tqLookup("flg", "-8", { code:"c61" }), "al").nm[0], 17 * TQ_NM_PER_FTLB * 0.66);
eq("ORFS SS not covered", tqAdjust("orfs", o8, "ss").covered, false);
eq("Steel unchanged", tqAdjust("orfs", o8, "steel").nm, o8.nm);
near("ft-lb factor", TQ_NM_PER_FTLB, 1.3558179483314); near("in-lb factor", TQ_NM_PER_INLB * 12, TQ_NM_PER_FTLB, 1e-9);


/* BSPP — ISO 1179-2 / DIN 3852-2 male studs. Expected values typed from Conexa's table (Parker R2 agrees). */
const cx = { L:[[6,"G 1/8",9,18,18,18],[8,"G 1/4",35,35,35,45],[10,"G 1/4",35,35,35,45],[12,"G 3/8",45,70,70,70],[15,"G 1/2",65,140,90,120],[18,"G 1/2",65,100,90,120],
  [22,"G 3/4",90,180,180,230],[28,"G 1",150,330,310,320],[35,"G 1 1/4",240,540,450,540],[42,"G 1 1/2",290,630,540,700]],
  S:[[6,"G 1/4",35,55,40,45],[8,"G 1/4",35,55,40,45],[10,"G 3/8",45,90,80,70],[12,"G 3/8",45,90,80,70],[14,"G 1/2",65,150,115,120],[16,"G 1/2",65,130,115,120],
  [20,"G 3/4",90,270,180,230],[25,"G 1",150,340,310,320],[30,"G 1 1/4",240,540,450,540],[38,"G 1 1/2",290,700,540,700]] };
["L","S"].forEach(se => cx[se].forEach(r => { const k = se + r[0];
  ["A","B","E","banjo"].forEach((f, j) => { const b = tqLookup("bspp", k, { series:f }); eq("BSPP " + k + " " + f, [b.thread, b.nm[0]], [r[1], r[2 + j]]); near("BSPP " + k + " " + f + " +10%", b.nm[1], r[2 + j] * 1.1, 1e-9); }); }));
eq("BSPP rows", TQ_BSPP.length, 20);
/* BSPT — turns from finger tight (Parker R5 = JLG Table 5-2) */
eq("BSPT", TQ_BSPT.map(r => r[0] + " " + r[1].join("-")), ["1/8-28 2-3","1/4-19 2-3","3/8-19 2-3","1/2-14 2-3","3/4-14 2-3","1-11 1.5-2.5","1-1/4-11 1.5-2.5","1-1/2-11 1.5-2.5","2-11 1.5-2.5"]);
eq("BSPT lookup", tqLookup("bspt", "1-11").turns, [1.5, 2.5]);

/* ORB adjustable — Parker R1 = TFD Table S1 (adjustable S, adjustable L) */
const orbAS = [null,null,"180 in-lb","360 in-lb","420 in-lb","720 in-lb","100 ft-lb","135 ft-lb","175 ft-lb","200 ft-lb","250 ft-lb","305 ft-lb","375 ft-lb"];
const orbAL = [null,null,"180 in-lb","250 in-lb","350 in-lb","620 in-lb","85 ft-lb","135 ft-lb","175 ft-lb","200 ft-lb","250 ft-lb","305 ft-lb","375 ft-lb"];
eq("ORB adj S", TQ_ORB.map(r => r[4] ? r[4].join(" ") : null), orbAS);
eq("ORB adj L", TQ_ORB.map(r => r[5] ? r[5].join(" ") : null), orbAL);
near("ORB -5 adj L 250 in-lb", tqLookup("orb", "-5", { series:"AL" }).nm[0], 250 * 0.1129848290276, 1e-9);
eq("ORB -2 adj none", tqLookup("orb", "-2", { series:"AS" }).none, true);
eq("ORB straight unchanged", tqLookup("orb", "-5", { series:"S" }).nominal, [360, "in-lb"]);
if (fails.length) { console.log("FAIL " + fails.length + " of " + n + "\n" + fails.join("\n")); process.exit(1); }
console.log("OK " + n + " fitting-torque checks passed");
