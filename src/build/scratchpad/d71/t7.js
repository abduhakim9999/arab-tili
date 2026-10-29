const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/71.html'); await p.waitForTimeout(800);
  await p.evaluate(()=>tab(2));
  const out=[];
  for (const q of ['ўйла','oʻyla','tuxum','yuguradi','زيادة','زِيَادَةٌ','اخذ','ширинлик','xyz']) {
    await p.fill('.lq input', q); await p.waitForTimeout(250);
    out.push(q+' → '+await p.evaluate(()=>document.querySelector('.lqn').textContent+' | '+[].filter.call(document.querySelectorAll('#p2 .g'),g=>!g.classList.contains('lqh')).map(g=>g.querySelector('.vw').textContent).join(' ; ')));
  }
  console.log(out.join('\n'), errs);
  await p.fill('.lq input', 'oshirmoq'); await p.waitForTimeout(250);
  await p.screenshot({path:'s_search.png'});
  await b.close();
})();
