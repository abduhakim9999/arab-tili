const fs=require('fs');let src=fs.readFileSync(process.argv[2],'utf8');
const st={};function mk(){return {classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},textContent:'',addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}}}
function el(id){return st[id]||(st[id]=mk())}
global.document={getElementById:el,querySelector(){return mk()},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.requestAnimationFrame=()=>1;
src+=';global.R={qpool,qstart,qans,qnext,get,LS,pline,ttr,tab};';new Function(src)();
const P=R.qpool();console.log('pool',P.length,'tanwin',P.filter(x=>x.tn).length);
R.tab(3);console.log(st.p3._h.slice(0,900));
const b={getAttribute(){return 'R'},classList:{add(){}}};R.qans(b);console.log('FB',st.qf._h);
for(let i=0;i<9;i++){R.qnext();R.qans(b)}R.qnext();console.log('END',st.p3._h.slice(0,300));
console.log('LS lines',Object.keys(R.LS).length,R.LS[0],R.LS[21]);
