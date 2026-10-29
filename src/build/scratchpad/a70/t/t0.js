const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const f of ['lesson92','lesson70']){
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(String(e.stack||e).slice(0,400)));p.on('requestfailed',r=>errs.push('REQ '+r.url().slice(0,80)));
await p.goto('file:///mnt/user-data/outputs/'+f+'/index.html');await p.waitForTimeout(1500);
console.log(f,JSON.stringify(errs));await p.close()}
await b.close()})();
