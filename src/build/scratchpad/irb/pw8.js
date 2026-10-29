const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:800}});
const p=await ctx.newPage();const logs=[];p.on('console',m=>logs.push(m.text()));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(800);
await p.evaluate(()=>{localStorage.setItem('dars92-holat',JSON.stringify({pos:[10,0]}))});
await p.reload();
for(const t of [200,500,900,1500,2500]){await p.waitForTimeout(t==200?200:300);console.log(t,await p.evaluate(()=>[scroller().scrollTop,document.documentElement.scrollHeight,window.scrollY,!!SC,document.querySelectorAll('#tx .ln').length]))}
await p.evaluate(()=>{var L=document.querySelectorAll('#tx .ln')[10];var r=L.getBoundingClientRect();console.log('rect',r.top);window.scrollTo(0,r.top);console.log('after',window.scrollY)});
console.log(logs);await b.close()})();
