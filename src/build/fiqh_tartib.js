// Ishlatish: node src/build/fiqh_tartib.js src/fiqh/fN.html  (16.11.2026; UZF ga yozadi, hku ni ham tuzatadi)
// So'z izohini o'ngdan chapga tartiblaydi: oldidagi harf(lar) → so'zning o'zi → zamir → bog'lanish (jar-majrur va h.k.) → izohlar.
const fs=require('fs'),vm=require('vm');
const f=process.argv[2];let s=fs.readFileSync(f,'utf8');
const a=s.indexOf('var MZ='),b=s.indexOf('var LG=');const ctx={};vm.createContext(ctx);vm.runInContext(s.slice(a,b),ctx);
const {S,UZF,PT}=ctx;
const strip=t=>t.replace(/[\u064B-\u0652\u0654\u0655\u0670\u0640]/g,'').replace(/[\u0621\u0623\u0624\u0625\u0626]/g,'ء');
const harfs=p=>(p.match(/[ء-ي][ً-ْٰ]*/g)||[]);
function reorder(t,pt){
  let mn='',tail='';
  t=t.replace(/\s*Маъноси:\s*([^.]*)\.?/,(_,x)=>{mn=' Маъноси: '+x.trim()+'.';return ''});
  const i=t.search(/\s*(⚖️|📜)/);if(i>=0){tail=' '+t.slice(i).trim();t=t.slice(0,i)}
  const ss=t.trim().replace(/([.;])\s+(?=[«А-ЯЁЎҚҒҲ؀-ۿ])/g,'$1\u0001').split('\u0001').filter(z=>z.trim());
  const pre=harfs(pt[0]).map(strip),stem=strip(pt[1]),z=strip(pt[2]||'');
  const ml=[],gr=[];let st=false;
  ss.forEach((x,k)=>{const m=x.match(/^«([^»]+)»/);
    if(!m){if(k==0){ml.push([10,'«'+pt[1]+'» — '+x.charAt(0).toLowerCase()+x.slice(1)]);st=true}else gr.push(x);return}
    const X=strip(m[1]);let r=null;const pi=pre.indexOf(X);
    if(pi>=0)r=pi;else if(X==stem&&!st){r=10;st=true}else if(z&&X==z)r=20;else if(X.includes(stem))r=30;
    if(r===null)gr.push('Бунда '+x);else ml.push([r,x])});
  ml.sort((p,q)=>p[0]-q[0]);
  return [...ml.map(x=>x[1]),...gr].join(' ')+mn+tail;
}
let n=0;const out=Object.assign({},UZF);
for(const k of Object.keys(PT)){const [si,wi]=k.split('-').map(Number);const w=S[si].w[wi];const t=UZF[k]||w[2];const r=reorder(t,PT[k]);if(r!==t){out[k]=r;n++}}
s=s.replace(/var UZF=\{.*?\};\n/s,()=> 'var UZF='+JSON.stringify(out)+';\n');
s=s.replace('hk=hku(P.m)','hk=hku(P.ml.join(" "))');
fs.writeFileSync(f,s);console.log(f,'tartiblandi:',n);
