const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/71.html'); await p.waitForTimeout(1500);
  await p.evaluate(()=>tab(3)); await p.waitForTimeout(500);
  await p.screenshot({path:'s_quiz.png'});
  await p.evaluate(()=>{document.querySelector('.qo button').click()}); await p.waitForTimeout(400);
  await p.screenshot({path:'s_quiz2.png'});
  await p.evaluate(()=>tab(2)); await p.waitForTimeout(400);
  await p.screenshot({path:'s_voc.png'});
  await p.evaluate(()=>{tab(1); bol();}); await p.waitForTimeout(400);
  await p.evaluate(()=>window.scrollTo(0,1400)); await p.waitForTimeout(300);
  await p.screenshot({path:'s_tartib.png'});
  console.log(errs);
  await b.close();
})();
