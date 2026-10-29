const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800};global.requestAnimationFrame=()=>1;
src+=';global.R={qpool,qstart,get,irb,qcase,D};';new Function(src)();
for(const k of ['9-4','15-1','17-6','17-10','5-5','6-1','0-2','11-0','16-13','19-26','12-1','0-1']){const r=R.irb(k);console.log(k,r.o.v,'=> [',r.pre,'|',r.mid,'|',r.post,'] case',R.qcase(r.o))}
const m=R.qpool(false);console.log('pool m',m.length,'h',R.qpool(true).length);
const add=m.filter(q=>R.irb(q.l+'-'+q.w).sk).map(q=>R.get(q.l+'-'+q.w).v);console.log('pronoun words in quiz',add.length,add.join(' '));
R.qstart('m');console.log((st.p3._h||'').match(/class="qt">[^]*?<\/span>/)[0]);
