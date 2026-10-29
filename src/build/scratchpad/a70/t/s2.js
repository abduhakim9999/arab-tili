const {chromium}=require('playwright');
const FAKE=`window.__cloud=JSON.parse(localStorage.getItem('__fakecloud')||'{}');window.Telegram={WebApp:{initData:'x',ready(){},expand(){},isVersionAtLeast(v){return true},BackButton:{show(){window.__bb=1},onClick(f){}},
CloudStorage:{setItem(k,v){__cloud[k]=v;localStorage.setItem('__fakecloud',JSON.stringify(__cloud));window.__set=(window.__set||0)+1},getItem(k,cb){setTimeout(()=>cb(null,__cloud[k]||''),10)},getItems(ks,cb){var o={};ks.forEach(k=>o[k]=__cloud[k]||'');setTimeout(()=>cb(null,o),10)}},
addToHomeScreen(){window.__ath=1},checkHomeScreenStatus(cb){cb('missed')},onEvent(){}}};`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
// device A
const A=await b.newContext({viewport:{width:390,height:760},serviceWorkers:'block'});await A.route('https://telegram.org/**',r=>r.fulfill({body:FAKE,contentType:'text/javascript'}));
const p=await A.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/arab-tili/lessons/70.html');await p.waitForTimeout(1200);
await p.evaluate(()=>{tab(3);[...document.querySelectorAll('.qo button')][0].click();qgo(1);[...document.querySelectorAll('.qo button')][0].click();qgo(1);[...document.querySelectorAll('.qo button')][0].click();});
await p.waitForTimeout(9000);
const cloud=await p.evaluate(()=>[window.__bb,window.__set,Object.keys(__cloud),(__cloud['dars70-holat']||'').length]);
console.log('A',JSON.stringify(cloud),errs);
const fc=await p.evaluate(()=>localStorage.getItem('__fakecloud'));
// device B: fresh storage, same cloud
const B=await b.newContext({viewport:{width:390,height:760},serviceWorkers:'block'});await B.route('https://telegram.org/**',r=>r.fulfill({body:FAKE,contentType:'text/javascript'}));
const q=await B.newPage();await q.goto('http://localhost:8765/arab-tili/');await q.evaluate(fc=>localStorage.setItem('__fakecloud',fc),fc);
await q.reload();await q.waitForTimeout(1000);
console.log('B index',await q.evaluate(()=>[...document.querySelectorAll('.pg')].map(x=>x.textContent)+' add:'+document.getElementById('add').className));
await q.goto('http://localhost:8765/arab-tili/lessons/70.html');await q.waitForTimeout(2500);
console.log('B lesson',await q.evaluate(()=>[document.getElementById('t3').className, QZ.filter(x=>x.ch!=null).length, (localStorage.getItem('dars70-holat')||'').slice(0,120), sessionStorage.getItem('dars70-holat-r'), typeof Telegram, Object.keys(window.__cloud||{})]));
await b.close()})();
