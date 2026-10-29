const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:760}});
await p.goto('file:///mnt/user-data/outputs/lesson70/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{tab(2);window.scrollTo(0,0)});await p.waitForTimeout(300);await p.screenshot({path:'v1.png'});
await p.evaluate(()=>{tab(3);var i=QZ.findIndex(q=>q.l==10&&q.w==3);qi=i;qshow();var q=QZ[qi],o=get('10-3');var bs=[...document.querySelectorAll('.qo button')];qans(bs.find((b,j)=>q.o[j].w!=o.v));window.scrollTo(0,0)});
await p.waitForTimeout(300);await p.screenshot({path:'q1.png'});
await b.close()})();
