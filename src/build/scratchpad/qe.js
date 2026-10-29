const fs=require('fs');let src=fs.readFileSync('main92.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},offsetHeight:0,set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},classList:{add(){}},style:{}}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}},fonts:{add(){}}};global.window={innerHeight:800,addEventListener(){},scrollTo(){}};global.screen={height:800,availHeight:780};global.setTimeout=()=>0;global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>0;
src+=';global.R={qpool,qends,get,TRK};';new Function(src)();
const P=R.qpool();console.log('pool',P.length,'hard in pool',P.filter(p=>R.TRK[p.l+'-'+p.w]).length,'of',Object.keys(R.TRK).length);
for(const p of P){const k=p.l+'-'+p.w;console.log(k,R.get(k).v,'=>',R.qends(k).map(x=>x.w).join(' | '))}
