// Cylinder, ISO 4406, GD&T and GUM checks against hand / textbook values.
const fs=require('fs'),path=require('path');const s=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function grab(name){const i=s.indexOf('function '+name+'(');let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]=='{')d++;else if(s[k]=='}'){d--;if(d==0)return s.slice(i,k+1);}}}
const a=s.indexOf('var CY_ISO = '),b=s.indexOf(';',a);global.CY_ISO=JSON.parse(s.slice(a+13,b));
['cyCalc','cyIsoCode','gdMmc','gdUnc'].forEach(n=>{eval('global.'+n+'='+grab(n).replace(/^function \w+/,'function'))});
let n=0,f=0;const ok=(c,m)=>{n++;if(!c){f++;console.log('FAIL',m)}},near=(x,y,t)=>Math.abs(x-y)<=t;
// cylinder: 3 in bore, 1.5 in rod, 3000 psi (SI in, lbf out)
const IN=0.0254,PSI=6894.757,LBF=4.448222;let r=cyCalc(3*IN,1.5*IN,3000*PSI,0,0,1,0,0,0,0);
ok(near(r.Fpush/LBF,3000*Math.PI*9/4,0.5),'push '+r.Fpush/LBF);ok(near(r.Fpull/LBF,3000*Math.PI*(9-2.25)/4,0.5),'pull');
// speed: 10 gpm into 3 in bore -> 231*10/60 in3/s / 7.0686 in2 = 5.446 in/s
r=cyCalc(3*IN,1.5*IN,3000*PSI,10*3.785411784e-3/60,0,1,0,0,0,0);ok(near(r.vExt/IN,231*10/60/(Math.PI*9/4),1e-3),'speed '+r.vExt/IN);
// Euler textbook: steel E=200 GPa, d=25 mm, L=1 m pinned -> Pcr = pi^2 E I / L^2 = 37.85 kN (slender: lambda=160 > Cc)
r=cyCalc(0.05,0.025,1e6,0,1,1,350e6,200e9,0,0);ok(r.method==='Euler'&&near(r.Pcr,Math.PI**2*200e9*(Math.PI*0.025**4/64),1)&&near(r.Pcr/1000,37.85,0.01),'euler '+r.Pcr);
// Johnson: short column lambda < Cc -> P = A Sy (1 - Sy lam^2/(4 pi^2 E)), and continuity at lam = Cc (P = A*Sy/2 both)
r=cyCalc(0.05,0.025,1e6,0,0.2,1,350e6,200e9,0,0);ok(r.method==='Johnson','johnson method');
const A=Math.PI*0.025**2/4,lam=0.2/(0.025/4);ok(near(r.Pcr,A*350e6*(1-350e6*lam*lam/(4*Math.PI**2*200e9)),1e-6),'johnson value');
const Cc=Math.sqrt(2*Math.PI**2*200e9/350e6),Lc=Cc*0.025/4;r=cyCalc(0.05,0.025,1e6,0,Lc,1,350e6,200e9,0,0);ok(near(r.Pcr,A*350e6/2,A*350e6*1e-9),'continuity at Cc');
// tube: Lame vs Barlow, 3 in bore, 3.5 OD, 3000 psi
r=cyCalc(3*IN,1.5*IN,3000*PSI,0,0,1,0,0,3.5*IN,70e3*PSI);ok(near(r.barlow/PSI,3000*3.5/(2*0.25),1e-6),'barlow 21000');ok(near(r.lame/PSI,3000*(1.75**2+1.5**2)/(1.75**2-1.5**2),1e-6),'lame '+r.lame/PSI);
// ISO 4406: published example 2136/463/63 -> 18/16/13 ; boundaries: 1300 -> 17 (up to and including), 1300.1 -> 18
ok(cyIsoCode(2136)===18&&cyIsoCode(463)===16&&cyIsoCode(63)===13,'iso example');ok(cyIsoCode(1300)===17&&cyIsoCode(1300.1)===18&&cyIsoCode(0.005)===0&&cyIsoCode(3e6)==='>28','iso bounds');
ok(CY_ISO.length===29&&CY_ISO.every((r,i)=>i===0||r[0]===CY_ISO[i-1][1]),'iso table contiguous');
// GD&T: hole .500-.510 pos .010 at MMC
let g=gdMmc('hole','M',.010,.500,.510,.505);ok(near(g.VC,.490,1e-12)&&near(g.RC,.530,1e-12)&&near(g.bonus,.005,1e-12)&&near(g.allowed,.015,1e-12),'hole MMC '+JSON.stringify(g));
g=gdMmc('pin','M',.010,.490,.500,.495);ok(near(g.VC,.510,1e-12)&&near(g.RC,.470,1e-12)&&near(g.allowed,.015,1e-12),'pin MMC '+JSON.stringify(g));
g=gdMmc('hole','L',.010,.500,.510,.505);ok(near(g.VC,.520,1e-12)&&near(g.RC,.480,1e-12)&&near(g.allowed,.015,1e-12),'hole LMC');
g=gdMmc('pin','L',.010,.490,.500,.495);ok(near(g.VC,.480,1e-12)&&near(g.RC,.520,1e-12),'pin LMC');
g=gdMmc('hole','S',.010,.500,.510,.505);ok(near(g.allowed,.010,1e-12)&&g.bonusMax===0,'RFS no bonus');
// GUM: rect a/sqrt3, tri a/sqrt6, U a/sqrt2, normal U/k, typeA s/sqrt n ; RSS
const u=gdUnc(['cert, 0.002, normal 2','res, 0.0005, rect','rep, 0.0012, typeA 10','x, 0.0006, tri','y, 0.0004, u, 2'],2);
const exp=Math.sqrt(0.001**2+(0.0005/Math.sqrt(3))**2+(0.0012/Math.sqrt(10))**2+(0.0006/Math.sqrt(6))**2+(2*0.0004/Math.sqrt(2))**2);
ok(near(u.uc,exp,1e-15)&&near(u.U,2*exp,1e-15),'gum '+u.uc);ok(near(u.rows.reduce((a,r)=>a+r.pct,0),100,1e-9),'shares sum 100');
console.log(f?`FAILED ${f}/${n}`:`OK ${n} cylinder / ISO 4406 / GD&T / GUM checks passed`);
