const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']}); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/93.html'); await p.waitForTimeout(1000);
  console.log('follow', await p.evaluate(()=>typeof follow));
  await p.evaluate(()=>window.scrollTo(0,1500)); await p.waitForTimeout(300);
  await p.evaluate(()=>{au.currentTime=0;au.play()}); await p.waitForTimeout(1500);
  console.log(await p.evaluate(()=>[au.currentTime.toFixed(2), (document.scrollingElement||document.documentElement).scrollTop]));
  await b.close();
})();
