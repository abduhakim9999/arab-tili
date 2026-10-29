const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const errs=[];
for(const [f,k] of [['70','10-3'],['92','6-13']]){
const p=await b.newPage({viewport:{width:390,height:900}});p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/lesson'+f+'/index.html');await p.waitForTimeout(1000);
await p.evaluate(k=>{var bad=0;document.querySelectorAll('#tx .ws span[data-i]').forEach(function(s){op(s);if(/undefined/.test(document.getElementById('sb').innerHTML))bad++});window.__bad=bad;op(document.querySelector('[data-i="'+k+'"]'))},k);
console.log(f,'bad',await p.evaluate(()=>window.__bad),await p.evaluate(()=>[...document.querySelectorAll('#sb .qmb')].map(b=>b.textContent).join(' | ')));
await p.screenshot({path:'n'+f+'.png',clip:{x:0,y:300,width:390,height:600}});
await p.evaluate(()=>{tab(3);var bs=[...document.querySelectorAll('.qo button')];bs[0].click();bs[1]&&bs[1].click()});
await p.close()}
console.log(errs);await b.close()})();
