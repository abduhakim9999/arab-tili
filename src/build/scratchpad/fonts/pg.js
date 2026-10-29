const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [n,line,w] of [['92',6,6],['91',14,0]]){
const p=await b.newPage({viewport:{width:400,height:800},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson'+n+'/index.html');await p.waitForTimeout(600);
await p.click('#tg');await p.waitForTimeout(200);
const ff=await p.evaluate(()=>getComputedStyle(document.querySelector('.ws span')).fontFamily+' | loaded:'+document.fonts.check('20px DarsNaskh'));
const ln=(await p.$$('.ln'))[line];await ln.scrollIntoViewIfNeeded();const bb=await ln.boundingBox();
await p.screenshot({path:'p'+n+'.png',clip:{x:0,y:bb.y,width:400,height:Math.min(bb.height,420)}});
await p.evaluate(([l,w])=>op(document.querySelector('[data-i="'+l+'-'+w+'"]')),[line,w]);await p.waitForTimeout(200);
await p.screenshot({path:'s'+n+'.png'});
console.log(n,ff,errs);await p.close()}
await b.close()})();
