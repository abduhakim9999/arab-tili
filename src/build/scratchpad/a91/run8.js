const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},offsetHeight:0,set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},classList:{add(){}},style:{}}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800,addEventListener(){},scrollTo(){}};global.screen={height:800,availHeight:780};global.setTimeout=()=>0;global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>0;
src+=';global.R={CAT,get,D};';new Function(src)();
const N={e:'ЭГА',k:'КЕСИМ',t:'ТЎЛД',h:'ҲОЛ'};
for(const i of [6,9,10,11,12,14,15,16,17,18,19,20]){const ws=R.D[i][1].split('/');console.log(i,ws.map((w,j)=>R.get(i+'-'+j).v+'['+(N[R.CAT[i+'-'+j]]||'-')+']').join(' '))}
