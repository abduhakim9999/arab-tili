const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/93.html'); await p.waitForTimeout(1200);
  await p.screenshot({path: process.argv[2]+'/s93a.png'});
  await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(300);
  await p.screenshot({path: process.argv[2]+'/s93b.png'});
  // tarkib: bosib turish
  const w = await p.$('[data-k="10-2"], #tx span.w >> nth=40');
  if (w) { const bb=await w.boundingBox(); await p.mouse.move(bb.x+5,bb.y+5); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(400); await p.screenshot({path: process.argv[2]+'/s93c.png'}); }
  console.log('errs', errs);
  await b.close();
})();
