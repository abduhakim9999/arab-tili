const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html#b1/m0'); await p.waitForTimeout(700);
  await p.click('#scs button[data-c="rm"]'); await p.waitForTimeout(200); await p.click('#seg button[data-m="j"]'); await p.waitForTimeout(300);
  await p.screenshot({path: process.argv[2]+'/j1.png'}); console.log(errs); await b.close(); })();
