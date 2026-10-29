const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/script.google.com/**', async r => { const q = JSON.parse(r.request().postData() || '{}');
    const body = q.b === 'bugun' ? { ok: true, jami: 5, ha: [{ n: 'Абдуҳаким', ok: 5, men: true }, { n: 'Шошийй', ok: 3 }], yoq: ['Ҳамидулла'] } : q.b === 'res' ? { ok: true, streak: 2 } : { ok: true, mist: [] };
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) }); });
  await p.goto('http://localhost:8765/fel.html?k=3#tgWebAppData=x%3D1'); await p.waitForSelector('.op');
  for (let i = 0; i < 6; i++) { const o = await p.$('.op'); if (!o) break; await o.click(); await p.waitForTimeout(150); const n = await p.$('.nx'); if (n) await n.click(); await p.waitForTimeout(150); }
  await p.waitForTimeout(800); await p.screenshot({ path: '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/bg.png', fullPage: true });
  console.log('errs', errs); await b.close();
})();
