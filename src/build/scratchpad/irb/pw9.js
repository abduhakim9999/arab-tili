const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:800}});
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{tab(3);var d=document.createElement('div');d.className='qam';d.innerHTML='<b>Боғлиқ сўз:</b> <span class="ar">أَنْ</span><br>'+arw(TRK['17-2'][1]);document.getElementById('p3').appendChild(d);
 return [d.innerHTML,[].map.call(d.querySelectorAll('.ar'),function(s){return s.textContent+'@'+Math.round(s.getBoundingClientRect().left)+'/'+getComputedStyle(s).unicodeBidi})]});
console.log(JSON.stringify(r));await b.close()})();
