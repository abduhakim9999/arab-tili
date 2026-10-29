const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:760}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('requestfailed',r=>errs.push('REQ '+r.url()));
await p.goto('http://localhost:8765/arab-tili/');await p.waitForTimeout(1500);
await p.screenshot({path:'h1.png'});
await p.click('a[href="lessons/70.html"]');await p.waitForTimeout(2000);
const r=await p.evaluate(()=>({h1:document.querySelector('h1').textContent,font:[...document.fonts].map(f=>f.family+':'+f.status).join(','),home:!!document.querySelector('a.home'),spans:document.querySelectorAll('#tx .ws span').length}));
await p.evaluate(()=>{tab(3);var bs=[...document.querySelectorAll('.qo button')];bs[0].click();qgo(1);var bs2=[...document.querySelectorAll('.qo button')];bs2[1].click();});
await p.waitForTimeout(500);
await p.click('a.home');await p.waitForTimeout(1500);
const r2=await p.evaluate(()=>[...document.querySelectorAll('.pg')].map(x=>x.textContent));
const sw=await p.evaluate(async()=>{const k=await caches.keys();if(!k.length)return 'nocache';const c=await caches.open(k[0]);return (await c.keys()).map(x=>x.url.split('/arab-tili/')[1])});
await p.screenshot({path:'h2.png'});
console.log(JSON.stringify({r,r2,sw,errs}));
// offline
await ctx.setOffline(true);await p.reload();await p.waitForTimeout(800);await p.click('a[href="lessons/92.html"]');await p.waitForTimeout(1500);
console.log('offline h1:',await p.evaluate(()=>document.querySelector('h1').textContent));
await b.close()})();
