const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/lesson92/index.html');await p.waitForTimeout(1000);
await p.evaluate(()=>tab(3));await p.waitForTimeout(200);
const right=()=>p.evaluate(()=>{var q=QZ[qi],v=get(q.l+"-"+q.w).v,i=q.o.findIndex(x=>x.w==v);qans(document.querySelector('.qo button[data-x="'+i+'"]'));return qi});
const wrong=()=>p.evaluate(()=>{var q=QZ[qi],v=get(q.l+"-"+q.w).v,i=q.o.findIndex(x=>x.w!=v);qans(document.querySelector('.qo button[data-x="'+i+'"]'));return qi});
console.log('a',await right());await p.waitForTimeout(1300);console.log('after auto',await p.evaluate(()=>qi));
console.log('b',await wrong());await p.waitForTimeout(1300);console.log('stays',await p.evaluate(()=>qi));
await p.screenshot({path:'shots/n1.png'});
// swipe left->right = next
const sw=async(x0,x1)=>p.evaluate(([x0,x1])=>{var e=document.getElementById('p3');function T(t,x){var ev=new Event(t,{bubbles:true});var to={clientX:x,clientY:400};ev.touches=t=='touchend'?[]:[to];ev.changedTouches=[to];e.dispatchEvent(ev)}T('touchstart',x0);T('touchend',x1)},[x0,x1]);
await sw(300,50);console.log('swipe left(next) ->',await p.evaluate(()=>qi));
await sw(50,300);console.log('swipe right(prev) ->',await p.evaluate(()=>qi));
await sw(50,300);console.log('prev again ->',await p.evaluate(()=>qi));
await p.screenshot({path:'shots/n2.png'});
console.log('errors',errs);await b.close()})();
