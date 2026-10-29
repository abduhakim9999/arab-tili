const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const D=process.argv[2];
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html'); await p.waitForTimeout(2500); await p.screenshot({path:D+'/h1.png'});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html'); await p.waitForTimeout(800); await p.screenshot({path:D+'/h2.png'});
  console.log(errs); await b.close(); })();
