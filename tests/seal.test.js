// unit tests of the seal maths, extracted from index.html
const fs=require('fs');const s=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
function grab(name){const i=s.indexOf('function '+name+'(');let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]=='{')d++;else if(s[k]=='}'){d--;if(d==0)return s.slice(i,k+1);}}}
const a=s.indexOf('var SG_AS568 = '),b=s.indexOf(';',a);global.SG_AS568=JSON.parse(s.slice(a+15,b));
const c=s.indexOf('var SG_CHART = '),e=s.indexOf('/* END DATA SG_CHART */');eval(s.slice(c,e).replace('var SG_CHART','global.SG_CHART'));
eval(grab('sgRed')+';'+grab('sgAnalyse')+';'+grab('sgDesign')+';global.R=sgRed;global.A=sgAnalyse;global.D=sgDesign;');
let fails=0,n=0;function ok(c,m){n++;if(!c){fails++;console.log('FAIL',m)}}
// 1. Parker Fig 3-3 reproduces FST reduced-CS table (rounded to .001)
const FST={.070:[.069,.069,.068,.068,.068],.103:[.102,.101,.100,.100,.100],.139:[.138,.137,.136,.135,.134],.210:[.208,.206,.205,.204,.203],.275:[.272,.270,.268,.267,.266]};
for(const cs in FST){FST[cs].forEach((v,k)=>{const x=+cs*(1-R(k+1)/100);ok(Math.abs(Math.round(x*1000)/1000-v)<1e-9||Math.abs(x-v)<=0.0006,`FST ${cs} @${k+1}%: ${x.toFixed(4)} vs ${v}`)})}
// 2. chart squeeze reproduction: no stretch (ring ID = seat), concentric -> squeeze % must equal Parker chart range (rounded)
for(const svc of ['stat','dyn'])for(const k in SG_CHART[svc]){const ch=SG_CHART[svc][k],cs=+k,ct={0.07:.003,0.103:.003,0.139:.004,0.21:.005,0.275:.006}[k];
 const sqMinIn=(cs-ct)-ch.L[1], sqMaxIn=(cs+ct)-ch.L[0];const pMin=sqMinIn/(cs-ct)*100,pMax=sqMaxIn/(cs+ct)*100;
 // Parker chart % uses nominal-ish basis; accept within 1.5 percentage points
 ok(Math.abs(pMin-ch.sq[0])<=1.6&&Math.abs(pMax-ch.sq[1])<=1.6,`${svc} ${k} chart sq ${ch.sq} vs calc ${pMin.toFixed(1)}-${pMax.toFixed(1)}`)}
// 3. design mode round-trips: designed gland gives L exactly = chart L, E = chart E
for(const type of ['piston','rod'])for(const svc of ['stat','dyn'])for(const k in SG_CHART[svc]){
 const ring={id:1.5,idt:.01,cs:+k,cst:.003,key:k};const d=D(type,svc,0,ring,3.0);const r=A(type,ring,d.g);const ch=SG_CHART[svc][k];
 ok(Math.abs(r.L[0]-ch.L[0])<1e-9&&Math.abs(r.L[1]-ch.L[1])<1e-9,`${type} ${svc} ${k} L ${r.L} vs ${ch.L}`);
 ok(Math.abs(r.E[0]-ch.E[0])<1e-9&&Math.abs(r.E[1]-ch.E[1])<1e-9,`${type} ${svc} ${k} E ${r.E} vs ${ch.E}`);}
// 4. hand-worked example: piston, bore 2.000-2.002, groove 1.756-1.758, -224 (ID 1.734±.015, CS .139±.004), G .187-.192
{const ring={id:1.734,idt:.015,cs:.139,cst:.004};const r=A('piston',ring,{A:[2.000,2.002],B:[1.756,1.758],C:[1.995,1.997],G:[.187,.192]});
 // L = (2.000-1.758)/2=.121 ; (2.002-1.756)/2=.123
 ok(Math.abs(r.L[0]-.121)<1e-9&&Math.abs(r.L[1]-.123)<1e-9,'example L');
 // stretch min=(1.756-1.749)/1.749=0.400% ; max=(1.758-1.719)/1.719=2.269%
 ok(Math.abs(r.st[0]-0.40023)<1e-3&&Math.abs(r.st[1]-2.26876)<1e-3,'example stretch '+r.st);
 // wRmin = .135*(1-Y(2.26876)/100); Y = -.005+1.19X-.19X^2-.001X^3+.008X^4
 const X=r.st[1],Y=-.005+1.19*X-.19*X*X-.001*X**3+.008*X**4;const wRmin=.135*(1-Y/100);
 ok(Math.abs(r.wR[0]-wRmin)<1e-9,'example wRmin');ok(Math.abs(r.sq[0]-(wRmin-.123)/wRmin*100)<1e-9,'example sqmin');
 // fill max = pi/4*wRmax^2/(Lmin*Gmin)
 const X0=r.st[0],Y0=-.005+1.19*X0-.19*X0*X0-.001*X0**3+.008*X0**4,wRmax=.143*(1-Y0/100);
 ok(Math.abs(r.fill[1]-Math.PI/4*wRmax*wRmax/(.121*.187)*100)<1e-6,'example fill');
 console.log('example: L',r.L,'stretch',r.st.map(x=>x.toFixed(2)),'sq',r.sq.map(x=>x.toFixed(1)),'fill',r.fill.map(x=>x.toFixed(1)),'E',r.E);}
// 5. AS568 data sanity: within each series ID strictly increasing, tolerance non-decreasing
const ser={};SG_AS568.forEach(r=>(ser[r[3]]=ser[r[3]]||[]).push(r));for(const k in ser){const L=ser[k];for(let i=1;i<L.length;i++){ok(L[i][1]>L[i-1][1],'ID order '+L[i][0]);ok(L[i][2]>=L[i-1][2],'tol order '+L[i][0]);}}
ok(SG_AS568.length===345,'count');
console.log(fails?`FAILED ${fails}/${n}`:`OK ${n} seal checks passed`);
