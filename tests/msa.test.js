// MSA studies: AIAG/Minitab linearity example, Cohen & Fleiss published examples, Type 1 formulas, t p-values.
const fs=require('fs'),path=require('path');const s=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function grab(name){const i=s.indexOf('function '+name+'(');let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]=='{')d++;else if(s[k]=='}'){d--;if(d==0)return s.slice(i,k+1);}}}
['lgamma','betacf','ibeta','msNums','msMean','msSd','msTp','msType1','msLinear','msCohen','msFleiss'].forEach(n=>{eval('global.'+n+'='+grab(n).replace(/^function \w+/,'function'))});
let n=0,f=0;function ok(c,m){n++;if(!c){f++;console.log('FAIL',m)}}const near=(a,b,t)=>Math.abs(a-b)<=t;
// 1. AIAG MSA 4th ed / Minitab GAGELIN example
const d={2:[2.7,2.5,2.4,2.5,2.7,2.3,2.5,2.5,2.4,2.4,2.6,2.4],4:[5.1,3.9,4.2,5.0,3.8,3.9,3.9,3.9,3.9,4.0,4.1,3.8],6:[5.8,5.7,5.9,5.9,6.0,6.1,6.0,6.1,6.4,6.3,6.0,6.1],8:[7.6,7.7,7.8,7.7,7.8,7.8,7.8,7.7,7.8,7.5,7.6,7.7],10:[9.1,9.3,9.5,9.3,9.4,9.5,9.5,9.5,9.6,9.2,9.3,9.4]};
const P=[];for(const r in d)d[r].forEach(v=>P.push([+r,v]));const L=msLinear(P,14.1941);
ok(near(L.slope,-0.131667,5e-6),'slope '+L.slope);ok(near(L.intercept,0.736667,5e-6),'intercept '+L.intercept);ok(near(L.r2,0.714,5e-4),'R2 '+L.r2);
ok(near(L.avgBias,-0.053333,5e-6),'avg bias');ok(near(L.pctLin,13.1667,1e-3),'%lin '+L.pctLin);ok(near(L.linearity,1.86889,5e-4),'linearity '+L.linearity);
[0.491667,0.125,0.025,-0.291667,-0.616667].forEach((b,i)=>ok(near(L.per[i].bias,b,5e-6),'bias ref '+i));
ok(L.pa<1e-10&&L.pb<1e-10,'slope and intercept significant');ok(near(L.ta,-12.043,5e-4)&&near(L.tb,10.158,5e-4),'AIAG published t values');
console.log('linearity: s',L.s.toFixed(5),'t slope',L.ta.toFixed(3),'t const',L.tb.toFixed(3));
// 2. Cohen kappa textbook example (50 items; 20 yes/yes, 5 yes/no, 10 no/yes, 15 no/no) -> 0.40
const A=[],B=[];[[20,'y','y'],[5,'y','n'],[10,'n','y'],[15,'n','n']].forEach(([k,a,b])=>{for(let i=0;i<k;i++){A.push(a);B.push(b)}});ok(near(msCohen(A,B),0.4,1e-12),'cohen '+msCohen(A,B));
// 3. Fleiss kappa published example (10 subjects, 14 raters, 5 categories) -> 0.210
const T=[[0,0,0,0,14],[0,2,6,4,2],[0,0,3,5,6],[0,3,9,2,0],[2,2,8,1,1],[7,7,0,0,0],[3,2,6,3,0],[2,5,3,2,2],[6,5,2,1,0],[0,2,2,3,7]];
const subj=T.map(r=>{const a=[];r.forEach((c,j)=>{for(let i=0;i<c;i++)a.push('c'+j)});return a});ok(near(msFleiss(subj),0.20993,5e-5),'fleiss '+msFleiss(subj));
// 4. t two-sided p: t=2.262157, df=9 -> 0.05 ; t=1.96, df=1e6 -> 0.05
ok(near(msTp(2.262157,9),0.05,2e-6),'p df9 '+msTp(2.262157,9));ok(near(msTp(1.959964,1e6),0.05,1e-5),'p normal');
// 5. Type 1 against independent formulas
const x=[10.002,10.001,9.999,10.003,10.000,10.002,9.998,10.001,10.002,10.000,10.001,10.003,9.999,10.000,10.002,10.001,10.000,9.999,10.002,10.001,10.000,10.003,10.001,9.998,10.002];
const m=x.reduce((a,b)=>a+b)/x.length,sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/(x.length-1)),tol=0.1;
const t1=msType1(x,10,tol);ok(near(t1.cg,0.2*tol/(6*sd),1e-12),'cg');ok(near(t1.cgk,(0.1*tol-Math.abs(m-10))/(3*sd),1e-12),'cgk');ok(near(t1.pctRep,100*6*sd/tol,1e-9),'%rep = 6s/T');
console.log('type1 example: cg',t1.cg.toFixed(3),'cgk',t1.cgk.toFixed(3));
console.log(f?`FAILED ${f}/${n}`:`OK ${n} MSA checks passed`);
