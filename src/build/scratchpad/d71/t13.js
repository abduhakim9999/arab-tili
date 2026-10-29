const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/70.html'); await p.waitForTimeout(900);
  await p.evaluate(async()=>{const a=document.querySelector('audio');a.muted=true;await new Promise(r=>{if(a.readyState>=1)r();else a.addEventListener('loadedmetadata',r,{once:true})});a.currentTime=56;await a.play()});
  await p.waitForTimeout(2500);
  await p.screenshot({path:'s70f.png'}); console.log(errs); await b.close();
})();
