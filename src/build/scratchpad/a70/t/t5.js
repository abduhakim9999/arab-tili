const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:760}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{tab(3);var out=[];['19-2','10-3','12-4'].forEach(function(k){var i=QZ.findIndex(q=>q.l+'-'+q.w==k);qi=i;qshow();var bs=[...document.querySelectorAll('.qo button')];bs[0].click();out.push(k+':'+document.querySelector('#qb').textContent)});return out});
console.log(JSON.stringify(r),errs);await b.close()})();
