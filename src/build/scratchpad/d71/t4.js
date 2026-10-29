const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html'); await p.waitForTimeout(1200);
  await p.screenshot({path:'s_home.png'});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/71.html'); await p.waitForTimeout(1200);
  // simulate playback position to check highlight
  const r = await p.evaluate(async()=>{const a=document.querySelector('audio');a.muted=true;await a.play().catch(()=>{});a.currentTime=56.3;await new Promise(r=>setTimeout(r,700));var s=document.querySelector('#tx .ws span.pl');return s?s.getAttribute('data-i')+' '+s.textContent:'none'});
  console.log(r, errs);
  await b.close();
})();
