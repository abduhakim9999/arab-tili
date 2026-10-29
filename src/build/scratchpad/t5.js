const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const D='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/';
  await p.goto('http://localhost:8766/3.html'); await p.waitForTimeout(1200);
  await p.getByText('Ҳаракат', { exact: true }).first().click().catch(()=>{}); await p.waitForTimeout(500);
  await p.screenshot({ path: D + 'l3b.png' });
  const els = await p.$$('[data-w], .wd, .w span'); console.log('cand', els.length);
  const vis = await p.locator('text=بَاكِسْتَانَ').first(); await vis.click({timeout:3000}).catch(e=>console.log('noclick'));
  await p.waitForTimeout(700); await p.screenshot({ path: D + 'l3d.png' });
  await p.goto('http://localhost:8766/'); await p.waitForTimeout(1200);
  await p.getByText('1-БОБ').first().click().catch(()=>{}); await p.waitForTimeout(800); await p.screenshot({ path: D + 'l3c.png' });
  console.log('errs', errs); await b.close();
})();
