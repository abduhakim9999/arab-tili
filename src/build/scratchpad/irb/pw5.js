const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:900},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1500);
await p.addStyleTag({content:'.sheet{max-height:none!important}'});
// open every word sheet, check no error
const keys=await p.evaluate(()=>Object.keys(IRB));
const bad=await p.evaluate((keys)=>{var r=[];keys.forEach(function(k){try{op(document.querySelector('[data-i="'+k+'"]'));var b=document.querySelector('#sb .big b');var t=document.querySelector('#sb .hk').textContent;r.push(k+' | '+(b?b.textContent+' '+b.className:'-')+' | '+t)}catch(e){r.push(k+' ERR '+e.message)}});return r},keys);
require('fs').writeFileSync('shots/ops.txt',bad.join('\n'));
for(const k of ['6-20','3-0','15-2']){await p.evaluate(k=>op(document.querySelector('[data-i="'+k+'"]')),k);await p.waitForTimeout(150);
 await p.evaluate(()=>document.querySelectorAll('#sb .qmb').forEach(b=>b.click()));await p.waitForTimeout(150);
 const el=await p.$('.sheet');await el.screenshot({path:'shots/s_'+k+'.png'});}
await p.evaluate(()=>document.getElementById('sh').classList.remove('on'));
await p.evaluate(()=>bol());await p.waitForTimeout(200);
const ln=await p.$$('.ln');await ln[3].screenshot({path:'shots/tartib3.png'});await ln[6].screenshot({path:'shots/tartib6.png'});
await p.evaluate(()=>tab(3));await p.waitForTimeout(200);
await p.evaluate(()=>{var q=QZ[qi],o=get(q.l+'-'+q.w);var bs=[...document.querySelectorAll('.qo button')];var w=bs.find((b,i)=>q.o[i].w!=o.v);qans(w)});await p.waitForTimeout(200);
const qb=await p.$('.qbox');await qb.screenshot({path:'shots/quiz.png'});
console.log('errors',errs);await b.close()})();
