const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:1600},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1200);
const fr=p.frames().find(f=>f.url().includes('about:srcdoc'))||p.mainFrame();
await fr.addStyleTag({content:'.sheet{max-height:none!important}'});
for(const k of (process.argv[2]||'3-3,6-14,14-2').split(',')){
  await fr.evaluate(k=>op(document.querySelector('[data-i="'+k+'"]')),k);await fr.waitForTimeout(250);
  const s=await fr.$('.sheet');await s.screenshot({path:'shots/s'+k+'.png'});
}
await fr.evaluate(()=>document.getElementById('sh').classList.remove('on'));
await fr.evaluate(()=>tab(3));await fr.waitForTimeout(300);
await fr.click('.qo button');await fr.waitForTimeout(300);
const q=await fr.$('.qbox');await q.screenshot({path:'shots/q.png'});
console.log('errors',errs, p.frames().map(f=>f.url().slice(0,40)));await b.close()})();
