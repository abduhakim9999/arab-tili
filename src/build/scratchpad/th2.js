const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/2.html'); await p.waitForTimeout(1000);
  console.log(await p.evaluate(()=>[document.getElementById('tx').className, document.querySelector('.hdr').className]));
  await p.click('text=Таржима'); await p.waitForTimeout(400);
  console.log(await p.evaluate(()=>[document.getElementById('tx').className, document.querySelector('.hdr').className]));
  await p.screenshot({path: process.argv[2]+'/hd3.png'});
  console.log(errs); await b.close(); })();
