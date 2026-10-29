const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8811/73.html');await p.waitForTimeout(1500);
const n=await p.evaluate(()=>document.querySelectorAll('#p1 .card, #p1 > div').length);
const tabs=await p.$$('.tabs button');await tabs[2].click();await p.waitForTimeout(500);
const q=await p.evaluate(()=>document.body.innerText.match(/Савол 1 \/ \d+/));
console.log('blocks',n,'quiz',q&&q[0],'errs',errs);await b.close()})();
