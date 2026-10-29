const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},offsetHeight:0,set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},classList:{add(){}},style:{}}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800,addEventListener(){},scrollTo(){}};global.screen={height:800,availHeight:780};global.setTimeout=()=>0;global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>0;
src+=';global.R={CAT,get,D,irb,TRK,ANS,qpool:typeof qpool!="undefined"?qpool:null};';new Function(src)();
const mode=process.argv[2];
for(let i=0;i<R.D.length;i++){const ws=R.D[i][1].split('/');
 if(mode=='cat')console.log(i,ws.map((w,j)=>R.get(i+'-'+j).v.replace(/[ً-ْ]/g,'')+'['+(R.CAT[i+'-'+j]||'-')+']').join(' '));
 else ws.forEach((w,j)=>{const o=R.get(i+'-'+j);if(o.c=='B'||o.c=='BC')return;const r=R.irb(i+'-'+j);console.log(i+'-'+j,o.c,r.pre+'['+r.mid+']'+r.post)})}
