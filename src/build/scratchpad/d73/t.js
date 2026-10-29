const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8811/index.html');await p.waitForTimeout(1500);await p.evaluate(()=>scrollTo(0,700));await p.waitForTimeout(400);await p.screenshot({path:'h.png'});
for(const f of ['73-1','73-2']){await p.goto('http://localhost:8811/'+f+'.html');await p.waitForTimeout(1500);
 await p.evaluate(()=>scrollTo(0,1800));await p.waitForTimeout(300);await p.screenshot({path:'p'+f+'.png'});
 const tabs=await p.$$('.tabs button');await tabs[2].click();await p.waitForTimeout(500);await p.screenshot({path:'q'+f+'.png'});}
console.log('errs',errs);await b.close()})();
