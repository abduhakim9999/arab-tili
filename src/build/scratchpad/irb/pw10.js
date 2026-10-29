const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{var P=qpool().map(function(q){return q.l+'-'+q.w});var miss=Object.keys(TRK).filter(function(k){return P.indexOf(k)<0});tab(3);return [P.length,P.join(' '),'missing:'+miss.join(' '),document.querySelector('.qnv span').textContent]});
console.log(JSON.stringify(r));
// answer wrong on 8-6 and screenshot
await p.evaluate(()=>{var i=QZ.findIndex(q=>q.l==8&&q.w==6);qi=i;qshow();var q=QZ[qi],o=get('8-6');var bs=[...document.querySelectorAll('.qo button')];qans(bs.find((b,j)=>q.o[j].w!=o.v))});
await p.waitForTimeout(200);await (await p.$('.qbox')).screenshot({path:'shots/q86.png'});
console.log(errs);await b.close()})();
