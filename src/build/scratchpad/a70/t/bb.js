const {chromium}=require('playwright');
const FAKE=`window.__log=JSON.parse(sessionStorage.getItem('__log')||'[]');function L(x){__log.push(x+'@'+location.pathname.split('/').pop());sessionStorage.setItem('__log',JSON.stringify(__log))}
window.Telegram={WebApp:{initData:'x',ready(){},expand(){},isVersionAtLeast(v){return true},
BackButton:{show(){L('show')},hide(){L('hide')},onClick(f){window.__bf=f;L('onClick')}},
CloudStorage:{setItem(){},getItem(k,cb){cb(null,'')},getItems(ks,cb){cb(null,{})}},addToHomeScreen(){},checkHomeScreenStatus(cb){cb('missed')},onEvent(){}}};`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const c=await b.newContext({viewport:{width:390,height:760},serviceWorkers:'block'});await c.route('https://telegram.org/**',r=>r.fulfill({body:FAKE,contentType:'text/javascript'}));
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8766/arab-tili/index.html');await p.waitForTimeout(800);
const h0=await p.evaluate(()=>history.length);
await p.click('a.it');await p.waitForTimeout(1000);
console.log('url1',p.url());
await p.evaluate(()=>__bf());await p.waitForTimeout(800);
console.log('url2',p.url());
await p.click('a.it >> nth=2');await p.waitForTimeout(1000);
await p.click('a.home');await p.waitForTimeout(800);
console.log('url3',p.url(),'hist',h0,await p.evaluate(()=>history.length));
console.log(await p.evaluate(()=>__log.join(' ')));console.log('errs',errs);await b.close();})();
