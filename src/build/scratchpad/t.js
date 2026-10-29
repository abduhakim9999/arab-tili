const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const req = [];
  p.on('request', r => { if (r.url().includes('/fq/')) req.push(r.url().split('/').pop()); });
  const D = '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/';
  await p.goto('http://localhost:8765/feellar.html'); await p.waitForTimeout(800);
  await p.screenshot({ path: D + 'f_home.png' });
  await p.click('#bKt'); await p.waitForTimeout(400); await p.screenshot({ path: D + 'f_days.png' });
  await p.click('#bk'); await p.waitForTimeout(300);
  await p.click('#bDc'); await p.waitForTimeout(500);
  await p.click('.lx [data-say]'); await p.waitForTimeout(300); await p.screenshot({ path: D + 'f_lug.png' });
  await p.click('#bk'); await p.waitForTimeout(300);
  await p.click('[data-p="0"]'); await p.waitForTimeout(400); await p.screenshot({ path: D + 'f_q.png' });
  // fel.html finish flow: answer all
  await p.goto('http://localhost:8765/fel.html?k=3'); await p.waitForTimeout(2500);
  for (let i = 0; i < 8; i++) { const o = await p.$('.op'); if (!o) break; await o.click(); await p.waitForTimeout(200); const n = await p.$('.nx'); if (n) await n.click(); await p.waitForTimeout(200); }
  await p.screenshot({ path: D + 'f_fin.png' });
  console.log(await p.evaluate(() => [localStorage.getItem('fl200_mist'), localStorage.getItem('fel_done')]));
  await p.goto('http://localhost:8765/feellar.html'); await p.waitForTimeout(600); await p.click('#bKt'); await p.waitForTimeout(300);
  await p.screenshot({ path: D + 'f_days2.png' });
  console.log('errs', errs, 'req', req.slice(0, 6));
  await b.close();
})();
