const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await c.newPage();
await p.goto('http://localhost:8811/70.html');await p.waitForTimeout(1000);
const s=await c.newCDPSession(p);const T=(type,x)=>s.send('Input.dispatchTouchEvent',{type,touchPoints:type=='touchEnd'?[]:[{x,y:400}]});
await T('touchStart',5);for(let x=20;x<=260;x+=30){await T('touchMove',x);await p.waitForTimeout(16)}
console.log('mid',await p.evaluate(()=>document.body.style.transform));
await T('touchEnd');await p.waitForTimeout(800);console.log(p.url());await b.close()})();
