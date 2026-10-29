const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:400,height:800},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(500);
await p.click('#t3');await p.waitForTimeout(200);await p.click('.qo button');await p.waitForTimeout(200);
await p.screenshot({path:'q4.png'});console.log(errs);await b.close()})();
