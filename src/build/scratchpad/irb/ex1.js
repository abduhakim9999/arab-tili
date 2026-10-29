const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:390,height:400},deviceScaleFactor:2});
await p.goto('file://'+process.cwd()+'/ex1.html');await p.waitForTimeout(500);await p.screenshot({path:'misol1.png',fullPage:true});await b.close()})();
