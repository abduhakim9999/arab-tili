const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/70.html'); await p.waitForTimeout(900);
  const r=await p.evaluate(()=>{var bad=[];document.querySelectorAll('.ws span[data-i]').forEach(s=>{try{op(s)}catch(e){bad.push(s.getAttribute('data-i')+e)}});
    return {lines:document.querySelectorAll('.ln').length, pool:qpool().length, trk:Object.keys(TRK).length, bad:bad}});
  console.log(JSON.stringify(r), errs);
  await p.evaluate(()=>{document.getElementById('sh').classList.remove('on');var e=document.querySelectorAll('.ln')[6];e.scrollIntoView()}); await p.waitForTimeout(300);
  await p.screenshot({path:'s70.png'}); await b.close();
})();
