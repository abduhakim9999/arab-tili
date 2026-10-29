const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 700 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8769/3.html'); await p.waitForTimeout(1200);
  await p.getByText('Ҳаракат', { exact: true }).first().click().catch(()=>{}); await p.waitForTimeout(400);
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/l3h.png' });
  console.log(await p.evaluate(()=>JSON.stringify(window.HDR)), errs); await b.close();
})();
