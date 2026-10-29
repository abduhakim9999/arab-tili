const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file:///mnt/user-data/outputs/arab-tili/70.html'); await p.waitForTimeout(800);
  const r=await p.evaluate(async()=>{const a=document.querySelector('audio');a.muted=true;await new Promise(r=>{if(a.readyState>=1)r();else a.addEventListener('loadedmetadata',r,{once:true})});
    const out=[];for(const t of [1.2,4.3,8.5,20.5,41,51,62.5,67.8]){a.currentTime=t;await a.play();await new Promise(r=>setTimeout(r,300));const s=document.querySelector('#tx .ws span.pl');out.push(t+':'+(s?s.getAttribute('data-i')+' '+s.textContent:'-'));a.pause()}return [a.duration.toFixed(1)].concat(out)});
  console.log(r.join(' | '),errs); await b.close();
})();
