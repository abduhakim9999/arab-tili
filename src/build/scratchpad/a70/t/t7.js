const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const nf of [0,1]){
const p=await b.newPage({viewport:{width:390,height:560},deviceScaleFactor:1});
if(nf)await p.addInitScript(()=>{Object.defineProperty(window,'DARSFONT',{get(){return ''},set(){}})});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{window.scrollTo(0,330)});await p.waitForTimeout(200);
await p.screenshot({path:'f'+nf+'.png'});await p.close()}
await b.close()})();
