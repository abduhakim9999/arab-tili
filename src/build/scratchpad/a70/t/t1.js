const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{
 var out={lines:document.querySelectorAll('#tx .ln').length,spans:document.querySelectorAll('#tx .ws span[data-i]').length};
 // sheet for every word
 var bad=[];document.querySelectorAll('#tx .ws span[data-i]').forEach(function(s){try{op(s);var h=document.getElementById('sb').innerHTML;if(!/Таркиб/.test(h))bad.push(s.getAttribute('data-i')+':notk');if(/undefined|NaN/.test(h))bad.push(s.getAttribute('data-i')+':undef')}catch(e){bad.push(s.getAttribute('data-i')+':'+e.message)}});
 out.bad=bad;
 // big words of split forms
 var bw={};['14-6','14-4','3-2','2-0','16-2','15-0','17-4','5-5','11-0','7-3','9-0','10-1','10-3','12-3','13-0','6-5','1-1','1-2'].forEach(function(k){var s=document.querySelector('[data-i="'+k+'"]');op(s);var sb=document.getElementById('sb');bw[k]=sb.querySelector('.big').innerHTML+' || '+(sb.querySelector('.hk')||{}).textContent});
 out.bw=bw;
 // tartib labels
 mkCat&&0;var cats={};document.querySelectorAll('#tx .ws span[data-i]').forEach(function(s){cats[s.getAttribute('data-i')]=(s.className||'')+'|'+(s.getAttribute('data-s')||'')});out.cats=cats;
 // quiz
 tab(3);out.qn=QZ.length;out.qk=QZ.map(function(q){return q.l+'-'+q.w});
 var P=[];D.forEach(function(l,i){if(i==0)return;l[1].split("/").forEach(function(w,j){var k=i+"-"+j;if(TRK[k]&&!QUR[k]){var o=qends(k);P.push(k+':'+(o?o.map(function(x){return x.w}).join(','):'NULL'))}})});out.pool=P;
 tab(2);out.voc=document.querySelectorAll('#p2 .g').length;
 return out});
console.log(JSON.stringify(r,null,0));console.log('ERR',errs);
await p.screenshot({path:'s_tab2.png'});
await b.close()})();
