const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},src:''}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.requestAnimationFrame=()=>1;
src+=';global.R={qpool,get};';new Function(src)();
for(const k of ['11-0','12-0','12-1','13-1','11-1']){const o=R.get(k);console.log(k,o.v,'|',o.role,'|',o.why)}
console.log('pool',R.qpool().length);
