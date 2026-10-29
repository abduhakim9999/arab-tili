const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:400,height:900},deviceScaleFactor:2});
await p.goto('file://'+process.cwd()+'/cmp.html');await p.waitForTimeout(500);await p.screenshot({path:'cmp.png',fullPage:true});await b.close()})();
