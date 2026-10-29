const fs=require('fs');let src=fs.readFileSync('chk.js','utf8');
const st={};function el(id){return st[id]||(st[id]={classList:{toggle(){},add(){},remove(){},contains(){return false}},style:{},addEventListener(){},setAttribute(){},getAttribute(){return ""},querySelectorAll(){return []},querySelector(){return null},closest(){return null},set innerHTML(v){this._h=v},get innerHTML(){return this._h}})}
global.document={getElementById:el,querySelector(){return {addEventListener(){},classList:{add(){}},style:{}}},querySelectorAll(){return []},addEventListener(){},documentElement:{style:{setProperty(){}}}};global.window={innerHeight:800,addEventListener(){},scrollTo(){}};global.screen={height:800,availHeight:780};global.setTimeout=()=>0;global.cancelAnimationFrame=()=>0;global.requestAnimationFrame=()=>1;
src+=';global.R={qpool,qstart,get,TRK};';new Function(src)();
for(const k of Object.keys(R.TRK)){const o=R.get(k),a=R.get(R.TRK[k][0]);if(!o.v||!a.v)console.log('BAD',k)}
console.log('pool h',R.qpool(true).length,'m',R.qpool(false).length);
R.qstart('h');console.log((st.p3._h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,400));
for(const k of Object.keys(R.TRK)){console.log(k,R.get(k).v,'<-',R.TRK[k][0],R.get(R.TRK[k][0]).v)}
