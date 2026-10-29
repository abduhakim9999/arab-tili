const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(500);
await p.click('#t3');await p.click('text=Қийин жойлар');await p.waitForTimeout(200);
console.log(await p.evaluate(()=>document.querySelector('.qhd span').textContent),errs);await b.close()})();
