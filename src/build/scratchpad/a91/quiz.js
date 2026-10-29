/* ---- i'rob mashqi ---- */
var QZ=[],qi=0,qsc=0,qmis=[],qdone=false,qmode="m";
var QV={R:["ُ","ٌ","дамма"],N:["َ","ً","фатҳа"],J:["ِ","ٍ","касра"]};
/* qiyin joylar: kalit -> [ta'sir qilgan so'z, sababi] */
var TRK={
"11-0":["10-9","Олдинги гапдаги فِرَقٍ дан бадал: «уч гуруҳ»ни бирма-бир санаб беради, шунинг учун у каби мажрур."],
"12-0":["11-0","و орқали олдинги فَرِيقٍ га атф қилинган, шунинг учун у каби мажрур."],
"12-1":["12-0","Мажрур فَرِيقٍ нинг сифати, лекин ғайри мунсариф: мажрур ҳолда касра ўрнига фатҳа олади, танвин олмайди."],
"13-0":["12-0","و орқали олдинги فَرِيقٍ га атф қилинган, шунинг учун мажрур."],
"13-1":["13-0","Мажрур فَرِيقٍ нинг сифати, шунинг учун мажрур."],
"10-6":["10-5","عَنْ дан кейинги هَذَا нинг аниқловчиси, шунинг учун мажрур."],
"7-3":["7-1","Яқиндаги الْمَرْأَةِ нинг эмас, вазифанинг сифати: وَظِيفَةُ марфуъ бўлгани учун у ҳам марфуъ."],
"16-6":["16-4","أَنَّ нинг исми وَظِيفَةَ нинг сифати: у мансуб бўлгани учун бу ҳам мансуб."],
"19-10":["19-9","Мансуб عَمَلَهَا нинг сифати, шунинг учун мансуб."],
"14-4":["14-3","إِنَّ ўз исмини насб қилади."],
"16-4":["16-3","أَنَّ ўз исмини насб қилади."],
"17-4":["17-3","أَنَّ ўз исмини насб қилади."],
"18-4":["18-3","إِنَّ ўз исмини насб қилади."],
"19-5":["19-4","أَنَّ ўз исмини насб қилади."],
"11-5":["11-4","أَنْ мудорийни насб қилади."],
"12-6":["12-5","أَنْ мудорийни насб қилади."],
"14-10":["14-9","أَنْ мудорийни насб қилади."],
"19-15":["19-14","أَنْ мудорийни насб қилади."],
"19-20":["19-19","أَنْ мудорийни насб қилади."],
"18-12":["18-10","و орқали мажрур تَفَكُّكِ га атф қилинган, шунинг учун мажрур."],
"20-3":["20-1","أَوْ орқали طَبِيبَةً га атф қилинган, шунинг учун мансуб."],
"21-3":["21-1","أَوْ орқали مُعَلِّمَةً га атф қилинган, шунинг учун мансуб."],
"21-5":["21-3","أَوْ орқали мансуб مُرَبِّيَةً га атф қилинган, шунинг учун мансуб."]
};
var ANS={"12-1":"N"};
function qlast(o){var hk=o.e[1].replace(/[^ً-ِ]/g,"");return hk.charAt(hk.length-1)}
function qpool(h){
  var P=[];
  if(h){Object.keys(TRK).forEach(function(k){var p=k.split("-"),o=get(k);P.push({l:+p[0],w:+p[1],tn:/[ً-ٍ]/.test(qlast(o))})});return P}
  D.forEach(function(l,i){l[1].split("/").forEach(function(w,j){
    var o=info(w);if(!QV[o.c])return;
    var last=qlast(o),tn=/[ً-ٍ]/.test(last);
    if(last!==QV[o.c][tn?1:0])return;
    P.push({l:i,w:j,tn:tn});
  })});
  return P;
}
function qstart(m){
  if(m)qmode=m;
  var P=qpool(qmode=="h");
  for(var i=P.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=P[i];P[i]=P[j];P[j]=t}
  QZ=P.slice(0,10);qi=0;qsc=0;qmis=[];qshow();
}
function qbase(o){return o.e[0]+o.e[1].replace(/[ً-ِ]/g,"")}
function qline(l,tw,cls){
  var h="";D[l][1].split("/").forEach(function(w,j){var x=info(w);
    h+='<span data-q="'+l+'-'+j+'"'+(j==tw?' class="qt"':'')+'>'+(j==tw?qbase(get(l+"-"+j)):x.v)+'</span>'+x.pu+" "});
  return '<div class="qs'+(cls?" "+cls:"")+'">'+h+'</div>';
}
function qmodes(){
  var n=Object.keys(TRK).length;
  return '<div class="qm"><button class="'+(qmode=="m"?"on":"")+'" onclick="qstart(\'m\')">Аралаш</button><button class="'+(qmode=="h"?"on":"")+'" onclick="qstart(\'h\')">Қийин жойлар ('+n+')</button></div>';
}
function qshow(){
  qdone=false;
  var q=QZ[qi],k=q.l+"-"+q.w,o=get(k),am=TRK[k],ctx="";
  if(am){var al=+am[0].split("-")[0];if(al!=q.l)ctx=qline(al,-1,"qc")}
  var tr=TR[q.l].map(function(t){return t[0]}).join(" ");
  var ops="";
  ["R","N","J"].forEach(function(c){var v=QV[c][q.tn?1:0],bs=o.e[1].replace(/[ً-ِ]/g,""),al2=(c=="N"&&q.tn&&!/[ةىء]/.test(bs.charAt(0)))?"ا":"";
    ops+='<button data-c="'+c+'" onclick="qans(this)"><b>'+bs+v+al2+'</b><span>'+QV[c][2]+(q.tn?' (танвин)':'')+'</span></button>'});
  document.getElementById("p3").innerHTML=qmodes()+'<div class="qbox"><div class="qhd"><span>Савол '+(qi+1)+' / '+QZ.length+(am?' · <b>қийин жой</b>':'')+'</span><span>Тўғри: '+qsc+'</span></div>'+
   ctx+qline(q.l,q.w)+'<div class="qtr">'+tr+'</div>'+
   '<div class="qq">Бўялган сўзнинг охирги ҳарфига қайси ҳаракат қўйилади?'+(am?' Олдинги сўзларга эътибор беринг.':'')+'</div><div class="qo">'+ops+'</div><div class="qf" id="qf"></div>'+
   '<div class="qb hide" id="qb"><button onclick="pw('+q.l+','+q.w+')">🔊 Тинглаш</button><button class="pr" onclick="qnext()">'+(qi==QZ.length-1?'Натижа':'Кейинги')+'</button></div></div>';
}
function qans(b){
  if(qdone)return;qdone=true;
  var q=QZ[qi],k=q.l+"-"+q.w,o=get(k),cor=ANS[k]||o.c,ok=b.getAttribute("data-c")==cor,am=TRK[k];
  document.querySelectorAll(".qo button").forEach(function(x){if(x.getAttribute("data-c")==cor)x.classList.add("ok")});
  if(ok)qsc++;else{b.classList.add("no");qmis.push(q)}
  var t=document.querySelector('.qs [data-q="'+k+'"]');if(t)t.textContent=o.v;
  var h='<div class="res" style="color:'+(ok?'#16a34a':'#dc2626')+'">'+(ok?'Тўғри!':'Хато. Тўғриси: '+QV[cor][2])+'</div>';
  if(am){var as=document.querySelector('.qs [data-q="'+am[0]+'"]');if(as)as.classList.add("qa");
    h+='<div class="qam"><b>Таъсир қилган сўз:</b> <span class="ar">'+get(am[0]).v+'</span><br>'+am[1]+'</div>'}
  h+=(o.ty?'<div><b>'+o.ty+'</b></div>':'')+(o.role?'<div>'+o.role+'</div>':'')+'<div>'+o.why+'</div><div style="color:var(--mu);margin-top:4px">Маъноси: '+o.mn+'</div>';
  document.getElementById("qf").innerHTML=h;
  document.getElementById("qb").classList.remove("hide");
}
function qnext(){
  qi++;if(qi<QZ.length){qshow();return}
  var h=qmodes()+'<div class="qbox"><div class="qhd"><span>Натижа</span></div><div class="qsc">'+qsc+' / '+QZ.length+'</div>';
  if(qmis.length){h+='<div class="qq">Хато қилинган сўзлар:</div>';qmis.forEach(function(q){var k=q.l+"-"+q.w,o=get(k),am=TRK[k];h+='<div class="g"><div class="hd"><span class="ar vw">'+o.v+'</span><div class="mn"><div>'+QV[ANS[k]||o.c][2]+' — '+(am?am[1]:o.role)+'</div></div></div></div>'})}
  h+='<div class="qb"><button class="pr" onclick="qstart()">Яна 10 та савол</button></div></div>';
  document.getElementById("p3").innerHTML=h;
}
