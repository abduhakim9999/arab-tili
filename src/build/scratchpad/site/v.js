const {chromium}=require('playwright');
const V={
1:`.it .ic b{background:#fff!important;color:var(--ac)!important;border:1.5px solid var(--ac);font-size:13.5px!important;line-height:20px!important;min-width:26px!important;border-radius:10px!important;right:-6px!important;bottom:-6px!important;box-shadow:0 1px 3px rgba(0,0,0,.12)}`,
2:`.it .ic b{display:none}.it .t .num{font-weight:800;color:var(--ac);margin-right:4px}`,
3:`.it .ic{flex-direction:column}.it .ic b{position:static!important;background:none!important;color:var(--ac)!important;font-size:13px!important;padding:0!important;margin-top:2px}.it .ic{height:auto!important;padding:8px 0 4px}`,
4:`.it .ic b{background:#DDF0E6!important;color:#0c5e3f!important;font-size:13.5px!important;line-height:21px!important;min-width:27px!important;border-radius:11px!important;right:-6px!important;bottom:-6px!important}`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
for(const k of [1,2,3,4]){await p.goto('http://localhost:8811/index.html');await p.waitForTimeout(1200);
 await p.addStyleTag({content:V[k]});
 if(k==2)await p.evaluate(()=>document.querySelectorAll('a.it').forEach(a=>{const n=a.querySelector('.ic b');const t=a.querySelector('.t');if(n&&t)t.innerHTML='<span class="num">'+n.textContent+'</span>· '+t.innerHTML}));
 if(k==3)await p.evaluate(()=>document.querySelectorAll('a.it .ic b').forEach(b=>b.textContent=b.textContent+'-дарс'));
 await p.waitForTimeout(300);
 const els=await p.$$('a.it');await els[2].screenshot({path:'v'+k+'.png'});}
await b.close()})();
