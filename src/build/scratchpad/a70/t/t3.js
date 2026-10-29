const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:900}});
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{op(document.querySelector('[data-i="15-2"]'));document.querySelector('#sb .qmb').click();var x=document.querySelector('#sb .xi');var cs=getComputedStyle(x);return [cs.direction,cs.unicodeBidi,cs.textAlign,getComputedStyle(x.parentNode).direction,x.parentNode.className,[].map.call(x.querySelectorAll('.ar'),function(s){return s.textContent.slice(0,6)+'@'+Math.round(s.getBoundingClientRect().left)})]});
console.log(JSON.stringify(r));await b.close()})();
