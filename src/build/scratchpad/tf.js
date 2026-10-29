const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']}); const ctx = await b.newContext({...require('playwright').devices['Pixel 5']}); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8766/2.html'); await p.waitForTimeout(1500);
  await p.evaluate(()=>{au.currentTime=0;au.play()});
  for(let i=0;i<10;i++){await p.waitForTimeout(2500); console.log(await p.evaluate(()=>[au.currentTime.toFixed(1),Math.round(scroller().scrollTop),(document.querySelector('.pl')||{className:'-'}).className.slice(0,20), !!SC].join(' ')))}
  console.log(errs); await b.close(); })();
