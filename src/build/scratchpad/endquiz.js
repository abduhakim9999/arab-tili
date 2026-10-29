/* ---- mashq: so'z oxiri harakatini topish (bitta umumiy mashq) ---- */
var QUR={};for(var qj=8;qj<=21;qj++)QUR["6-"+qj]=1;
function qsh(A){for(var a=A.length-1;a>0;a--){var b=Math.floor(Math.random()*(a+1)),t=A[a];A[a]=A[b];A[b]=t}return A}
function qends(k){
  var o=get(k),ir=irb(k),c=qcase(o);if(!c)return null;
  var mid=ir.mid,base=mid.replace(/[ً-ْ]/g,""),tn=/[ً-ٍ]/.test(mid),sd=/ّ/.test(mid)?"ّ":"",core=base.replace(/(.)ا$/,"$1"),noA=/[ةىء]/.test(core)||!!ir.sk;
  var R={R:core+sd+(tn?"ٌ":"ُ"),N:core+sd+(tn?(noA?"ً":"اً"):"َ"),J:core+sd+(tn?"ٍ":"ِ")};
  var fl=/[Фф]еъл/.test(o.ty||""),cs=["R","N","J"];
  if(fl){R.Z=core+sd+"\u0652";cs=["R","N","Z"]}
  else if(/ات$/.test(plain(ir.pre+core)))cs=["R","J"];
  var out=[],hit=false;
  cs.forEach(function(x){var w=ir.pre+R[x]+ir.post;if(w==o.v)hit=true;out.push({w:w,c:x})});
  if(!hit)return null;
  return out;
}
function qpool(){
  var P=[];
  D.forEach(function(l,i){if(i==0)return;l[1].split("/").forEach(function(w,j){
    var k=i+"-"+j,o=get(k);if(QUR[k]||/кўринмайди|айтилмайди/.test(o.why||""))return;
    if(qends(k))P.push({l:i,w:j});
  })});
  return P;
}
function qstart(){
  QZ=qsh(qpool());QZ.forEach(function(q){q.o=qends(q.l+"-"+q.w)});qi=0;qsc=0;qmis=[];qshow();
}
function qline(l,tw,cls){
  var h="";D[l][1].split("/").forEach(function(w,j){var x=info(w);
    h+='<span data-q="'+l+'-'+j+'"'+(j==tw?' class="qt"':'')+'>'+plain(x.v)+'</span>'+x.pu+" "});
  return '<div class="qs'+(cls?" "+cls:"")+'">'+h+'</div>';
}
function qshow(){
  qdone=false;
  var q=QZ[qi],k=q.l+"-"+q.w,am=TRK[k],ctx="";
  if(am){var al=+am[0].split("-")[0];if(al!=q.l)ctx=qline(al,-1,"qc")}
  var tr=TR[q.l].map(function(t){return t[0]}).join(" ");
  var ops="";q.o.forEach(function(x,i){ops+='<button data-x="'+i+'" onclick="qans(this)"><b>'+x.w+'</b><span>'+QV[x.c][2]+'</span></button>'});
  document.getElementById("p3").innerHTML='<div class="qbox"><div class="qhd"><span>Савол '+(qi+1)+' / '+QZ.length+(am?' · <b>қийин жой</b>':'')+'</span><span>Тўғри: '+qsc+'</span></div>'+
   ctx+qline(q.l,q.w)+'<div class="qtr">'+tr+'</div>'+
   '<div class="qo">'+ops+'</div><div class="qf" id="qf"></div>'+
   '<div class="qb hide" id="qb"><button onclick="pw('+q.l+','+q.w+')">🔊 Тинглаш</button><button class="pr" onclick="qnext()">'+(qi==QZ.length-1?'Натижа':'Кейинги')+'</button></div></div>';
}
function qans(b){
  if(qdone)return;qdone=true;
  var q=QZ[qi],k=q.l+"-"+q.w,o=get(k),am=TRK[k],ch=q.o[+b.getAttribute("data-x")],ok=ch.w==o.v;
  document.querySelectorAll(".qo button").forEach(function(x){if(q.o[+x.getAttribute("data-x")].w==o.v)x.classList.add("ok")});
  if(ok)qsc++;else{b.classList.add("no");qmis.push(q)}
  var t=document.querySelector('.qs [data-q="'+k+'"]');if(t)t.textContent=o.v;
  var h='<div class="res" style="color:'+(ok?'#16a34a':'#dc2626')+'">'+(ok?'Тўғри!':'Хато. Тўғриси: <span class="ar">'+o.v+'</span>')+'</div>';
  if(am){var as=document.querySelector('.qs [data-q="'+am[0]+'"]');if(as)as.classList.add("qa");
    h+='<div class="qam"><b>Таъсир қилган сўз:</b> <span class="ar">'+get(am[0]).v+'</span><br>'+am[1]+'</div>'}
  h+=(o.ty?'<div><b>'+o.ty+'</b></div>':'')+(o.role?'<div>'+o.role+'</div>':'')+(o.why?'<div>'+o.why+'</div>':'')+'<div style="color:var(--mu);margin-top:4px">Маъноси: '+o.mn+'</div>';
  document.getElementById("qf").innerHTML=h;
  document.getElementById("qb").classList.remove("hide");
}
function qnext(){
  qi++;if(qi<QZ.length){qshow();return}
  var h='<div class="qbox"><div class="qhd"><span>Натижа</span></div><div class="qsc">'+qsc+' / '+QZ.length+'</div>';
  if(qmis.length){h+='<div class="qq">Хато қилинган сўзлар:</div>';qmis.forEach(function(q){var k=q.l+"-"+q.w,o=get(k),am=TRK[k];h+='<div class="g"><div class="hd"><span class="ar vw">'+o.v+'</span><div class="mn"><div>'+(am?am[1]:(o.role||o.ty))+'</div></div></div></div>'})}
  h+='<div class="qb"><button class="pr" onclick="qstart()">Қайтадан</button></div></div>';
  document.getElementById("p3").innerHTML=h;
}
