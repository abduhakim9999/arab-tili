const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/2.html'); await p.waitForTimeout(1200); await p.screenshot({path: process.argv[2]+'/l2.png'});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html#k1'); await p.waitForTimeout(2200); await p.screenshot({path: process.argv[2]+'/l2h.png'});
  console.log(errs); await b.close(); })();
