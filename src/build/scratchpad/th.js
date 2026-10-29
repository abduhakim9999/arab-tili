const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html'); await p.waitForTimeout(2500);
  await p.screenshot({path: process.argv[2]}); await b.close(); })();
