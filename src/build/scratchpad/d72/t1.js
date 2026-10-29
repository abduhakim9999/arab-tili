const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.5});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('http://localhost:8812/index.html');await p.waitForTimeout(1500);
await p.screenshot({path:'s1.png'});
const w=await p.$$('#p1 .w, #p1 [data-k], #p1 span.wd');console.log('words',w.length);
const tabs=await p.$$('.tabs button');console.log('tabs',tabs.length);
for(let i=1;i<tabs.length;i++){await tabs[i].click();await p.waitForTimeout(500);await p.screenshot({path:'s_tab'+i+'.png'});}
console.log('errs',errs.filter(e=>!/telegram|fonts|net::/i.test(e)));await b.close()})();
