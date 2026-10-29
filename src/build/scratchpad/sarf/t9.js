const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']}); const p = await b.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8765/sarf.html#b1/m0'); await p.waitForTimeout(1000);
  await p.click('#bP'); const r=[]; for(let i=0;i<8;i++){await p.waitForTimeout(700); r.push(await p.evaluate(()=>[AU.currentTime.toFixed(2),(document.querySelector('#sbd tr.pl')||{getAttribute:()=>'-'}).getAttribute('data-i')].join(':')))}
  console.log(r.join(' '), errs); await b.close(); })();
