const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:400,height:800}});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(500);
await p.click('#tg');await p.waitForTimeout(200);
console.log(await p.evaluate(()=>[5,6,7].map(j=>document.querySelector('[data-i="6-'+j+'"]').textContent).join(' | ')));
const e=await p.$('[data-i="6-5"]');await e.scrollIntoViewIfNeeded();
const bb=await (await p.$$('.ln'))[6].boundingBox();await p.screenshot({path:'l6.png',clip:{x:0,y:bb.y,width:400,height:Math.min(bb.height,400)}});await b.close()})();
