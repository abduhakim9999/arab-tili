const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const n of ['91','92']){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson'+n+'/index.html');await p.waitForTimeout(800);
console.log(n,await p.evaluate(()=>[...document.fonts].filter(f=>f.family.includes('DarsNaskh')).map(f=>f.status).join(',')),errs);await p.close()}
await b.close()})();
