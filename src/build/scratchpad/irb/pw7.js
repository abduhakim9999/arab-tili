const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:1});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U='file:///mnt/user-data/outputs/lesson92/index.html';
await p.goto(U);await p.waitForTimeout(1500);
// set state
await p.evaluate(()=>{bol();ttr();fz(4)});
await p.evaluate(()=>{var L=document.querySelectorAll('#tx .ln')[10];L.scrollIntoView();});
await p.waitForTimeout(600);
const before=await p.evaluate(()=>{var L=document.querySelectorAll('#tx .ln')[10].getBoundingClientRect().top;return {top:L,sc:scroller().scrollTop,SC:!!SC}});
await p.evaluate(()=>{au.currentTime=30});await p.waitForTimeout(300);
await p.evaluate(()=>{tab(3)});await p.waitForTimeout(200);
await p.evaluate(()=>{var q=QZ[qi];qans(document.querySelectorAll('.qo button')[0])});await p.waitForTimeout(1300);
await p.evaluate(()=>{var q=QZ[qi];qans(document.querySelectorAll('.qo button')[1])});await p.waitForTimeout(300);
const qb=await p.evaluate(()=>({qi:qi,qsc:qsc,ch:QZ.slice(0,3).map(q=>q.ch),first:QZ[0].l+'-'+QZ[0].w}));
await p.evaluate(()=>{tab(1)});await p.waitForTimeout(200);
await p.evaluate(()=>{document.dispatchEvent(new Event('visibilitychange'))});
const st=await p.evaluate(()=>localStorage.getItem('dars92-holat'));
// reload
await p.reload();await p.waitForTimeout(2000);
const after=await p.evaluate(()=>({top:document.querySelectorAll('#tx .ln')[10].getBoundingClientRect().top,sc:scroller().scrollTop,bol:bolak,htr:hidetr,fs:fs,at:au.currentTime,qi:qi,qsc:qsc,ch:QZ.slice(0,3).map(q=>q.ch),first:QZ.length?QZ[0].l+'-'+QZ[0].w:null}));
console.log(JSON.stringify(before),JSON.stringify(qb));console.log(st.slice(0,200));console.log(JSON.stringify(after));
await p.evaluate(()=>tab(3));await p.waitForTimeout(200);await (await p.$('.qbox')).screenshot({path:'shots/q_restore.png'});
console.log('errs',errs);await b.close()})();
