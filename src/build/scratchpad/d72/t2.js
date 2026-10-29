const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8811/index.html');await p.waitForTimeout(1500);await p.evaluate(()=>scrollTo(0,350));await p.waitForTimeout(300);await p.screenshot({path:'h.png'});
await p.goto('http://localhost:8811/72.html');await p.waitForTimeout(1500);
const ok=await p.evaluate(()=>{const a=document.querySelector('audio');return a&&a.src.slice(0,40)});console.log('audio',ok);
await p.evaluate(()=>{const s=document.querySelectorAll('#p1 .card, #p1 .ln');}); 
await p.evaluate(()=>scrollTo(0,2600));await p.waitForTimeout(300);await p.screenshot({path:'l13.png'});
console.log('errs',errs);await b.close()})();
