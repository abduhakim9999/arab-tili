const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:300}});
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1200);
await p.screenshot({path:'tb.png',clip:{x:0,y:0,width:390,height:170}});await b.close()})();
