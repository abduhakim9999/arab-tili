const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/script.google.com/**', async r => { await new Promise(x => setTimeout(x, 2500)); r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, mist: [50, 60, 2] }) }); });
  const t0 = Date.now();
  await p.goto('http://localhost:8765/fel.html?k=1#tgWebAppData=x%3D1');
  await p.waitForSelector('.op'); const t1 = Date.now() - t0;
  const h1 = await p.textContent('#hc');
  await p.waitForTimeout(3000);
  const h2 = await p.textContent('#hc'), nd = await p.$$eval('.dots i', x => x.length);
  console.log('first question ms', t1, '|', h1, '->', h2, 'dots', nd, 'errs', errs);
  await b.close();
})();
