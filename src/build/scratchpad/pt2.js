const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 380, height: 760 } });
  await p.goto('file:///mnt/user-data/outputs/arab-tili/91.html'); await p.waitForTimeout(800);
  console.log(await p.evaluate(() => ['.pbar .tk','.pbar .tk .tr','.pbar .tk i'].map(s=>{const e=document.querySelector(s);const c=getComputedStyle(e);return s+' bg='+c.backgroundColor+' bgi='+c.backgroundImage.slice(0,60)+' bd='+c.border+' h='+c.height+' w='+c.width+' pad='+c.padding})));
  const rules=await p.evaluate(()=>{const out=[];for(const sh of document.styleSheets){try{for(const r of sh.cssRules){if(r.selectorText&&/(^|[\s,.])(tk|tr)\b/.test(r.selectorText)&&!/pbar/.test(r.selectorText))out.push(r.cssText.slice(0,200))}}catch(e){}}return out});
  console.log(rules.join('\n')); await b.close();
})();
