const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html#b1'); await p.waitForTimeout(500);
  await p.click('#tbs button[data-t="t"]'); await p.waitForTimeout(300);
  await p.click('.g12 >> nth=5 >> div >> nth=11'); await p.waitForTimeout(300); await p.screenshot({path: process.argv[2]+'/t1.png'});
  await p.evaluate(()=>closeSh()); await p.click('.g12 >> nth=4 >> div >> nth=6'); await p.waitForTimeout(300); await p.screenshot({path: process.argv[2]+'/t2.png'});
  console.log(errs); await b.close(); })();
