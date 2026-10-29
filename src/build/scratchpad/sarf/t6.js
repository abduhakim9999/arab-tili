const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const D=process.argv[2];
  await p.goto('http://localhost:8765/sarf.html#b1/f'); await p.waitForTimeout(800);
  await p.screenshot({path:D+'/f1.png'});
  await p.click('#jmp button >> nth=4'); await p.waitForTimeout(700); await p.screenshot({path:D+'/f2.png'});
  await p.click('.grp >> nth=4 >> .vr >> nth=0'); await p.waitForTimeout(400); await p.screenshot({path:D+'/f3.png'});
  console.log(errs); await b.close(); })();
