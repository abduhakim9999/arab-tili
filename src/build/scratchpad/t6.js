const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const D='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/';
  await p.goto('http://localhost:8767/4.html'); await p.waitForTimeout(1200);
  await p.getByText('Ҳаракат', { exact: true }).first().click().catch(()=>{}); await p.waitForTimeout(500);
  await p.screenshot({ path: D + 'l4a.png' });
  await p.goto('http://localhost:8767/'); await p.waitForTimeout(1000);
  await p.getByText('الْكِتَابُ الْأَوَّلُ').first().click().catch(()=>{}); await p.waitForTimeout(800);
  await p.getByText('1-БОБ').first().click().catch(()=>{}); await p.waitForTimeout(900);
  await p.screenshot({ path: D + 'l4b.png' });
  console.log('errs', errs); await b.close();
})();
