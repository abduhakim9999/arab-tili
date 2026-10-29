const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html');await p.waitForTimeout(1200);await p.screenshot({path:process.argv[2]+'/l-home.png'});
await p.goto('file:///mnt/user-data/outputs/arab-tili/tinglash.html');await p.waitForTimeout(800);
await p.evaluate(()=>{const A=document.getElementById('au');A.muted=true;A.currentTime=40;A.play()});await p.waitForTimeout(1500);
await p.screenshot({path:process.argv[2]+'/l-pl.png'});await p.click('#bg');await p.waitForTimeout(500);await p.screenshot({path:process.argv[2]+'/l-pl2.png'});
console.log('errs',errs, await p.evaluate(()=>document.getElementById('au').currentTime));await b.close();})();
