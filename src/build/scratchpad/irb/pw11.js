const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:800}});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{tab(3);var i=QZ.findIndex(q=>q.l==8&&q.w==6);qi=i;qshow();var q=QZ[qi],o=get('8-6');var bs=[...document.querySelectorAll('.qo button')];qans(bs.find((b,j)=>q.o[j].w!=o.v));
 var d=document.querySelector('.qam');return [d.innerHTML,[].map.call(d.querySelectorAll('.ar'),function(s){var r=s.getBoundingClientRect();return s.textContent+'@'+Math.round(r.left)+','+Math.round(r.top)})]});
console.log(JSON.stringify(r));await b.close()})();
