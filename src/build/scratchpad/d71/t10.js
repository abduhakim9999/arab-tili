const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/71.html'); await p.waitForTimeout(800);
  const r = await p.evaluate(async()=>{
    const a=document.querySelector('audio'); a.muted=true;
    await new Promise(r=>{if(a.readyState>=1)r();else a.addEventListener('loadedmetadata',r,{once:true})});
    a.currentTime=a.duration-0.8; await a.play();
    await new Promise(r=>setTimeout(r,1600));
    const after={ended:a.ended,t:a.currentTime.toFixed(2),paused:a.paused};
    document.querySelector('.pbar .pb').click(); await new Promise(r=>setTimeout(r,700));
    return {after, replay:{t:a.currentTime.toFixed(2),paused:a.paused}, key:localStorage.getItem('dars71-holat')?'ok':'none'};
  });
  console.log(JSON.stringify(r), errs); await b.close();
})();
