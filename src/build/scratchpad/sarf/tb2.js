const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 820 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const D=process.argv[2];
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html#b2/f'); await p.waitForTimeout(700); await p.screenshot({path:D+'/b2a.png'});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html#b2/m1'); await p.waitForTimeout(500); await p.click('#scs button[data-c="amr"]'); await p.waitForTimeout(200); await p.screenshot({path:D+'/b2b.png'});
  await p.goto('file:///mnt/user-data/outputs/arab-tili/sarf.html#b2/m'); await p.waitForTimeout(400); await p.click('#qst'); 
  for(let i=0;i<10;i++){await p.click('.op button >> nth=0'); await p.click('#qn');}
  await p.waitForTimeout(200); await p.screenshot({path:D+'/b2c.png'});
  console.log(errs); await b.close(); })();
