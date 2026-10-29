const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},offsetHeight:0,set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},classList:{add(){}},style:{}}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800,addEventListener(){},scrollTo(){}};global.screen={height:800,availHeight:780};global.setTimeout=()=>0;global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>0;
src+=';global.R={qpool,qline,get,irb,gl,st:null};';new Function(src)();
const n=R.qpool(false),h=R.qpool(true);
console.log('normal',n.length,n.map(p=>p.l+'-'+p.w+(p.tn?'t':'')).join(' '));
console.log('hard',h.length,h.map(p=>p.l+'-'+p.w+(p.tn?'t':'')).join(' '));
console.log(R.qline(6,4).replace(/<[^>]+>/g,'').slice(0,80));
R.gl();console.log(st.p2._h.slice(0,200));
