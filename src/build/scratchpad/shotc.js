const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const sch of ['light','dark']){const p=await b.newPage({viewport:{width:420,height:900},colorScheme:sch});
await p.goto('file:///mnt/user-data/outputs/arab-tili/93.html');await p.waitForTimeout(1200);
await p.evaluate(()=>{const t=[...document.querySelectorAll('button,a,div')].find(e=>e.textContent.trim()==='Тартиб');t&&t.click()});await p.waitForTimeout(500);
await p.evaluate(()=>window.scrollTo(0,2600));await p.waitForTimeout(300);
await p.screenshot({path:process.argv[2]+'/col-'+sch+'.png'});}
await b.close();})();
