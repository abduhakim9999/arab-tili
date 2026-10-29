const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/index.html');
  await p.evaluate(()=>{localStorage.setItem('oxirgi-dars','71');localStorage.setItem('dars71-holat',JSON.stringify({pos:1}))});
  await p.reload(); await p.waitForTimeout(1500);
  await p.screenshot({path:'s_home3.png'}); console.log(errs); await b.close();
})();
