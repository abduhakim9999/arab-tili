const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await c.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8811/73.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const e=document.querySelector('#p1');return getComputedStyle(e).userSelect||getComputedStyle(e).webkitUserSelect});
console.log('userSelect',r,'errs',errs);await b.close()})();
