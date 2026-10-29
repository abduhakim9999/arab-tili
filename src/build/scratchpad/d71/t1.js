const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1.5 });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e))); p.on('console', m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file:///mnt/user-data/outputs/lesson71/index.html'); await p.waitForTimeout(1500);
  const f = p.frames().find(f=>f.url().includes('index')) || p.mainFrame();
  const fr = p.frames().length>1 ? p.frames()[1] : p.mainFrame();
  const r = await fr.evaluate(() => {
    const out={lines:document.querySelectorAll('.ln').length, spans:document.querySelectorAll('.ws span[data-i]').length};
    // check every word popup builds
    const bad=[];
    document.querySelectorAll('.ws span[data-i]').forEach(s=>{try{op(s)}catch(e){bad.push(s.getAttribute('data-i')+':'+e)}});
    out.bad=bad;
    // quiz pool
    out.pool=qpool().map(q=>q.l+'-'+q.w);
    out.missingTRK=Object.keys(TRK).filter(k=>out.pool.indexOf(k)<0);
    out.voc=VOC.length;
    return out;
  });
  console.log(JSON.stringify(r), errs);
  await fr.evaluate(()=>{document.querySelector('.ws span[data-i="14-12"]')&&op(document.querySelector('.ws span[data-i="19-5"]'))});
  await p.screenshot({path:'s_pop.png'});
  await fr.evaluate(()=>{document.getElementById('sh').classList.remove('on');window.scrollTo(0,0)});
  await p.screenshot({path:'s_top.png'});
  await b.close();
})();
