const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.5});
await p.goto('http://localhost:8811/index.html');await p.waitForTimeout(1200);await p.click('.ib');await p.waitForTimeout(400);
await p.screenshot({path:process.argv[2]});await b.close()})();
