const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const D='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/';
  await p.goto('http://localhost:8766/3.html'); await p.waitForTimeout(1500);
  await p.screenshot({ path: D + 'l3a.png' });
  const w = await p.$$('.w'); console.log('words', w.length);
  // click a word (Pakistan)
  const el = await p.$('text=بَاكِسْتَانَ'); if (el) { await el.click(); await p.waitForTimeout(600); }
  await p.screenshot({ path: D + 'l3b.png' });
  await p.goto('http://localhost:8766/#k1'); await p.waitForTimeout(1200); await p.screenshot({ path: D + 'l3c.png' });
  console.log('errs', errs); await b.close();
})();
