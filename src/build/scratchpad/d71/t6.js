const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/91.html'); await p.waitForTimeout(800);
  console.log(await p.evaluate(()=>{tab(2);var e=document.querySelector('#p2 .ar');return getComputedStyle(e).userSelect+' '+getComputedStyle(document.querySelector('.tr')).userSelect}), errs);
  await b.close();
})();
