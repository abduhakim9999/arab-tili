const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 380, height: 760 }, deviceScaleFactor: 2 });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/91.html'); await p.waitForTimeout(1500);
  const box = await p.locator('.pbar .pqk').boundingBox();
  await p.mouse.move(box.x + 5, box.y + box.height/2); await p.mouse.down();
  for (let i=1;i<=10;i++) await p.mouse.move(box.x + box.width*0.06*i, box.y + box.height/2);
  await p.screenshot({ path: 'pl-drag.png', clip:{x:0,y:520,width:380,height:240} });
  await p.mouse.up(); await p.waitForTimeout(300);
  const t1 = await p.evaluate(() => document.querySelector('audio').currentTime);
  await p.click('.pbar .pqs[data-d="5"]'); await p.waitForTimeout(200);
  const t2 = await p.evaluate(() => [document.querySelector('audio').currentTime, document.querySelector('.pbar .pqt').textContent]);
  await p.screenshot({ path: 'pl.png', clip:{x:0,y:520,width:380,height:240} });
  console.log(t1, t2); await b.close();
})();
