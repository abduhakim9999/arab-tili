const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},src:''}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.requestAnimationFrame=()=>1;
src+=';global.R={qpool,qstart,qshow,get,LS,TM,D};';new Function(src)();
const P=R.qpool();console.log('quiz pool',P.length);
R.qstart();console.log((st.p3._h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,300));
console.log('lines with LS',Object.keys(R.LS).length,'of',R.D.length);
