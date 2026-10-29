const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());const p=await b.newPage({viewport:{width:400,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(800);
await p.click('#bl');await p.waitForTimeout(200);
await p.screenshot({path:'s1.png'});
await p.click('#t3');await p.waitForTimeout(300);
await p.click('#t2');await p.waitForTimeout(300);
console.log('errors',errs);await b.close()})();
