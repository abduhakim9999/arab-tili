const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']}); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/93.html'); await p.waitForTimeout(1000);
  const info = await p.evaluate(()=>{const c=document.querySelectorAll('#tx > *');return [c.length, [...c].slice(0,10).map(e=>e.className+'|'+(e.getAttribute('data-l')||'')+'|'+e.textContent.slice(0,25))]});
  console.log(JSON.stringify(info));
  for (const li of [1,8,9]) {
    const el = await p.$('#tx [data-l="'+li+'"]') || (await p.$$('#tx > *'))[li];
    await el.click({position:{x:40,y:20}}); await p.waitForTimeout(600);
    console.log(li, await p.evaluate(()=>[au.currentTime.toFixed(2), au.paused]));
    await p.evaluate(()=>au.pause());
  }
  await b.close();
})();
