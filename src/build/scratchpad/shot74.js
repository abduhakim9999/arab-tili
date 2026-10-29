const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/arab-tili/74.html');await p.waitForTimeout(1500);
await p.screenshot({path:process.argv[2]+'/s74a.png'});
await p.evaluate(()=>window.scrollTo(0,700));await p.waitForTimeout(300);await p.screenshot({path:process.argv[2]+'/s74b.png'});
await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html#k2');await p.waitForTimeout(1200);await p.screenshot({path:process.argv[2]+'/s74c.png'});
console.log('errs',errs);await b.close();})();
