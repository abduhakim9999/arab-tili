const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 400, height: 860 } }); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('http://localhost:8765/index.html'); 
  await p.evaluate(async()=>{await navigator.serviceWorker.ready});
  await p.waitForTimeout(1500);
  const cached = await p.evaluate(async()=>{const ks=await caches.keys();const c=await caches.open(ks[0]);return ks.concat((await c.keys()).length)});
  console.log('cache', cached);
  await ctx.setOffline(true);
  const t0=Date.now();
  await p.click('a[href="71.html"]'); await p.waitForLoadState('domcontentloaded'); await p.waitForSelector('#tx .ws span'); 
  console.log('offline open ms', Date.now()-t0, await p.title());
  await p.waitForTimeout(800);
  const r = await p.evaluate(async()=>{
    const a=document.querySelector('audio'); a.muted=true;
    await a.play().catch(e=>'playerr '+e); await new Promise(r=>setTimeout(r,500));
    a.currentTime=60; await new Promise(r=>setTimeout(r,800));
    const fontOk=document.fonts.check('20px DarsNaskh');
    return {t:a.currentTime.toFixed(1), dur:a.duration, paused:a.paused, err:a.error&&a.error.code, fontOk, hl:(document.querySelector('#tx .ws span.pl')||{}).textContent};
  });
  console.log(JSON.stringify(r), errs);
  await b.close();
})();
