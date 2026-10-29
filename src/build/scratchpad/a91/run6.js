const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.requestAnimationFrame=()=>1;
src+=';global.R={get,irb,wparts,wshow,D};';new Function(src)();
let n=0;R.D.forEach((l,i)=>l[1].split('/').forEach((w,j)=>{const k=i+'-'+j,o=R.get(k),P=R.wparts(o);if(P){n++;const h=R.wshow(o,R.irb(k),P);console.log(k,o.v,'=>',h.replace(/<span class="wp">\+<\/span>/g,' + '),'|',P.map(p=>p.d).join(' / '))}}));
console.log('split words',n);
