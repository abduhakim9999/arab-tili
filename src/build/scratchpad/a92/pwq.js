const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());const p=await b.newPage({viewport:{width:400,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.sp')].slice(0,4).map(e=>e.textContent).join(' | ')));
await p.click('#t3');await p.waitForTimeout(200);
const r=await p.evaluate(()=>{QZ=[{l:6,w:4,tn:true},{l:12,w:2,tn:true}];qi=0;qshow();var a=[...document.querySelectorAll('.qo b')].map(e=>e.textContent).join(',')+' / '+document.querySelector('.qs .qt').textContent;qi=1;qshow();return a+' || '+[...document.querySelectorAll('.qo b')].map(e=>e.textContent).join(',')+' / '+document.querySelector('.qs .qt').textContent});
console.log(r,'errors',errs);await b.close()})();
