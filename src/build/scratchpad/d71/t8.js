const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html'); await p.waitForTimeout(1500);
  await p.screenshot({path:'s_home2.png'}); await b.close();
})();
