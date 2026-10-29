const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('http://localhost:8768/'); await p.waitForTimeout(1000);
  await p.getByText('الْكِتَابُ الْأَوَّلُ').first().click().catch(()=>{}); await p.waitForTimeout(800);
  await p.locator('.unit').first().click().catch(()=>{}); await p.waitForTimeout(1000);
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/l4c.png' });
  await b.close();
})();
