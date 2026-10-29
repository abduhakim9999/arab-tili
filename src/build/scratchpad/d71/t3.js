const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file:///mnt/user-data/outputs/lesson71/index.html'); await p.waitForTimeout(1000);
  const fr = p.frames().length>1 ? p.frames()[1] : p.mainFrame();
  console.log(await fr.evaluate(()=>{var o=[];D.forEach(function(l,i){l[1].split('/').forEach(function(w,j){var x=get(i+'-'+j);o.push(i+'-'+j+':'+(CAT[i+'-'+j]||'·')+':'+x.v)})});return o.join('  ')}));
  await b.close();
})();
