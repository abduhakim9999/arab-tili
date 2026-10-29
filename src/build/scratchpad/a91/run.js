const fs=require('fs');let src=fs.readFileSync(process.argv[2],'utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.localStorage={getItem(){return null}};global.navigator={};
src+=';global.G=get;';new Function(src)();
for(const k of ['0-0','0-2','1-0','1-1','9-0']){const o=G(k);console.log(k,o.v+(o.pu||''),'|',o.ty,'|',o.role,'|',o.why)}
console.log((st.tx._h||'').slice(0,300));
