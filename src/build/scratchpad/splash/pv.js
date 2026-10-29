const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:870,height:300}});
await p.goto('file://'+process.cwd()+'/pv.html');await p.screenshot({path:'pv.png'});await b.close();})();
