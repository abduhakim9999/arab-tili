const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html#k2'); await p.waitForTimeout(1500);
  await p.evaluate(()=>window.scrollTo(0,99999)); await p.waitForTimeout(800);
  await p.screenshot({path: process.argv[2]}); await b.close(); })();
