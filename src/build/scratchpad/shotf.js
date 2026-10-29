const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));

await p.goto('http://127.0.0.1:8765/fel.html?k=1');await p.waitForTimeout(2500);
await p.screenshot({path:process.argv[2]+'/f1.png'});
await p.click('.op');await p.waitForTimeout(300);await p.screenshot({path:process.argv[2]+'/f2.png'});
console.log('errs',errs);await b.close();})();
