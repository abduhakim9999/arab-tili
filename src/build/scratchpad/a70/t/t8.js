const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:600}});
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{var a=getComputedStyle(document.querySelector('.tr')).fontSize;fz(8);var c=getComputedStyle(document.querySelector('.tr')).fontSize;fz(-8);return [a,c]});
console.log(r);await b.close()})();
