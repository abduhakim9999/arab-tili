const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:1100}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{var o={};['10-1','1-0'].forEach(function(k){op(document.querySelector('[data-i="'+k+'"]'));o[k]=[...document.querySelectorAll('#sb .qmb')].map(b=>b.textContent)});document.querySelectorAll('#sb .qmb').forEach(b=>b.click());op(document.querySelector('[data-i="10-1"]'));document.querySelectorAll('#sb .qmb').forEach(function(b,i){if(i<2)b.click()});return o});
await p.screenshot({path:'e1.png'});console.log(JSON.stringify(r),errs);await b.close()})();
