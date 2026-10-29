/* ---- mashq: harakatsiz so'zni to'g'ri o'qish ---- */
var QUR={};for(var qj=8;qj<=21;qj++)QUR["6-"+qj]=1;
function qlet(v){var L=[];v.replace(/[ء-ي][ً-ْٰ]*/g,function(m,i){L.push({i:i,t:m})});return L}
function qvow(t){var m=t.match(/[َُِْ]/);return m?m[0]:""}
function qset(t,nv){return t.replace(/[َُِْ]/,nv)}
function qvars(k){
  var o=get(k),v=o.v,L=qlet(v),ir=irb(k),ip=ir.pre.length,ii=-1;
  for(var a=0;a<L.length;a++)if(L[a].i==ip)ii=a;
  if(ii<0)return null;
  var pre=/—|\+|^Жар-мажрур|^Ҳарф ва/.test(o.ty||"")?1:0;
  if(/^Жар-мажрур/.test(o.ty||"")&&/^.ِ?ا?لْ/.test(v.slice(L[0].t.length)))pre=1;
  function rebuild(idx,nt){var s="",p=0;for(var a=0;a<L.length;a++){s+=v.slice(p,L[a].i)+(a==idx?nt:L[a].t);p=L[a].i+L[a].t.length}return s+v.slice(p)}
  var out={},cor=v;
  /* oxiri (i'rob) */
  var mb=(o.c=="B"||o.c=="BC"),hid=/кўринмайди|айтилмайди/.test(o.why||"");
  if(!hid){
    var mid=ir.mid,base=mid.replace(/[ً-ْ]/g,"");
    if(!mb&&qcase(o)){
      var tn=/[ً-ٍ]/.test(mid),core=base.replace(/(.)ا$/,"$1"),sh=/ّ/.test(mid)?"ّ":"";
      var opts=tn?[core+sh+"ٌ",core+sh+"ً"+(/[ةىء]/.test(core)?"":"ا"),core+sh+"ٍ"]:[core+sh+"ُ",core+sh+"َ",core+sh+"ِ"];
      if(tn&&!/[ةىء]/.test(core))opts[1]=core+sh+"اً";
      opts.forEach(function(x){var w=ir.pre+x+ir.post;if(w!=cor)out[w]=1});
    }else{
      var lt=L[L.length-1],lv=qvow(lt.t);
      if(lv&&lv!="ْ"&&L.length>=3){["َ","ُ","ِ"].forEach(function(nv){if(nv!=lv){var w=rebuild(L.length-1,qset(lt.t,nv));if(w!=cor)out[w]=1}})}
    }
  }
  /* ichki harakatlar */
  var ins={};
  var pv=plain(v),am0=pv.match(/^(و|ف|ب|ك)?ال/)||pv.match(/^(و|ف)?لل/);if(am0)pre=Math.max(pre,am0[0].length);
  for(var a=pre;a<L.length;a++){
    if(a==ii||a>ii&&!mb)continue;
    var nx=L[a+1];if(nx&&(/[اى]/.test(nx.t.charAt(0))||(/[وي]/.test(nx.t.charAt(0))&&!qvow(nx.t))))continue;
    if(L[a].t.charAt(0)=="إ")continue;
    if(mb&&a==L.length-1)continue;
    var t=L[a].t,cv=qvow(t);if(!cv)continue;
    if(cv=="ْ"&&(/[اوي]/.test(t.charAt(0))))continue;
    if(t.charAt(0)=="ل"&&cv=="ْ"&&a>0&&L[a-1].t=="ا")continue;
    var alt=cv=="ْ"?["َ"]:["َ","ُ","ِ"].filter(function(x){return x!=cv});
    if(t.charAt(0)=="أ")alt=alt.filter(function(x){return x!="\u0650"});
    alt.forEach(function(nv){var w=rebuild(a,qset(t,nv));if(w!=cor)ins[w]=1});
  }
  var E=Object.keys(out),I=Object.keys(ins);
  function qsh(A){for(var a=A.length-1;a>0;a--){var b=Math.floor(Math.random()*(a+1)),t=A[a];A[a]=A[b];A[b]=t}return A}
  qsh(E);qsh(I);
  var pick=[];if(E.length)pick.push(E.shift());while(pick.length<3&&I.length)pick.push(I.shift());while(pick.length<3&&E.length)pick.push(E.shift());
  if(pick.length<2)return null;
  return qsh(pick.concat([cor]));
}
function qok(k){var o=get(k);if(QUR[k]||/الله|لله/.test(plain(o.v)))return false;if(/^Ҳарф/.test(o.ty||""))return false;if(plain(o.v).length<3)return false;return !!qvars(k)}
function qpool(h){
  var P=[];
  if(h){Object.keys(TRK).forEach(function(k){if(!QUR[k]&&qvars(k)){var p=k.split("-");P.push({l:+p[0],w:+p[1]})}});return P}
  D.forEach(function(l,i){if(i==0)return;l[1].split("/").forEach(function(w,j){var k=i+"-"+j;if(qok(k))P.push({l:i,w:j})})});
  return P;
}
function qstart(m){
  if(m)qmode=m;
  var P=qpool(qmode=="h");
  for(var i=P.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=P[i];P[i]=P[j];P[j]=t}
  QZ=P.slice(0,10);QZ.forEach(function(q){q.o=qvars(q.l+"-"+q.w)});qi=0;qsc=0;qmis=[];qshow();
}
function qline(l,tw,cls){
  var h="";D[l][1].split("/").forEach(function(w,j){var x=info(w);
    h+='<span data-q="'+l+'-'+j+'"'+(j==tw?' class="qt"':'')+'>'+plain(x.v)+'</span>'+x.pu+" "});
  return '<div class="qs'+(cls?" "+cls:"")+'">'+h+'</div>';
}
function qmodes(){
  var n=qpool(true).length;
  return '<div class="qm"><button class="'+(qmode=="m"?"on":"")+'" onclick="qstart(\'m\')">Машқ</button><button class="'+(qmode=="h"?"on":"")+'" onclick="qstart(\'h\')">Қийин жойлар ('+n+')</button></div>';
}
function qshow(){
  qdone=false;
  var q=QZ[qi],k=q.l+"-"+q.w,am=TRK[k],ctx="";
  if(am){var al=+am[0].split("-")[0];if(al!=q.l)ctx=qline(al,-1,"qc")}
  var tr=TR[q.l].map(function(t){return t[0]}).join(" ");
  var ops="";q.o.forEach(function(w,x){ops+='<button data-x="'+x+'" onclick="qans(this)"><b>'+w+'</b></button>'});
  document.getElementById("p3").innerHTML=qmodes()+'<div class="qbox"><div class="qhd"><span>Савол '+(qi+1)+' / '+QZ.length+'</span><span>Тўғри: '+qsc+'</span></div>'+
   ctx+qline(q.l,q.w)+'<div class="qtr">'+tr+'</div>'+
   '<div class="qo qo2">'+ops+'</div><div class="qf" id="qf"></div>'+
   '<div class="qb hide" id="qb"><button onclick="pw('+q.l+','+q.w+')">🔊 Тинглаш</button><button class="pr" onclick="qnext()">'+(qi==QZ.length-1?'Натижа':'Кейинги')+'</button></div></div>';
}
function qans(b){
  if(qdone)return;qdone=true;
  var q=QZ[qi],k=q.l+"-"+q.w,o=get(k),am=TRK[k],ch=q.o[+b.getAttribute("data-x")],ok=ch==o.v;
  document.querySelectorAll(".qo button").forEach(function(x){if(q.o[+x.getAttribute("data-x")]==o.v)x.classList.add("ok")});
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
  var h=qmodes()+'<div class="qbox"><div class="qhd"><span>Натижа</span></div><div class="qsc">'+qsc+' / '+QZ.length+'</div>';
  if(qmis.length){h+='<div class="qq">Хато қилинган сўзлар:</div>';qmis.forEach(function(q){var k=q.l+"-"+q.w,o=get(k),am=TRK[k];h+='<div class="g"><div class="hd"><span class="ar vw">'+o.v+'</span><div class="mn"><div>'+(am?am[1]:(o.role||o.ty))+'</div></div></div></div>'})}
  h+='<div class="qb"><button class="pr" onclick="qstart()">Яна 10 та савол</button></div></div>';
  document.getElementById("p3").innerHTML=h;
}
