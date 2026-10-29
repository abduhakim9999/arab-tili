P='/mnt/user-data/outputs/lesson92/index.html'
h=open(P,encoding='utf-8').read()
a=h.index('function qshow(){');b=h.index('function pw(l,w){')
new=r'''function qshow(){
  var q=QZ[qi],k=q.l+"-"+q.w,am=TRK[k],ctx="";
  if(am){var al=+am[0].split("-")[0];if(al!=q.l)ctx=qline(al,-1,"qc")}
  var tr=TR[q.l].map(function(t){return t[0]}).join(" ");
  var ops="";q.o.forEach(function(x,i){ops+='<button data-x="'+i+'" onclick="qans(this)"><b>'+x.w+'</b><span>'+QV[x.c][2]+'</span></button>'});
  var nv='<div class="qnv"><button onclick="qgo(-1)"'+(qi==0?' disabled':'')+'>‹</button><span>Савол '+(qi+1)+' / '+QZ.length+(am?' · <b>қийин жой</b>':'')+'</span><button onclick="qgo(1)">›</button></div>';
  document.getElementById("p3").innerHTML='<div class="qbox">'+nv+'<div class="qhd"><span>Суринг: ўнгга — кейинги, чапга — олдинги</span><span>Тўғри: '+qsc+'</span></div>'+
   ctx+qline(q.l,q.w)+'<div class="qtr">'+tr+'</div>'+
   '<div class="qo">'+ops+'</div><div class="qf" id="qf"></div>'+
   '<div class="qb hide" id="qb"><button onclick="pw('+q.l+','+q.w+')">🔊 Тинглаш</button><button class="pr" onclick="qgo(1)">'+(qi==QZ.length-1?'Натижа':'Кейинги')+'</button></div></div>';
  if(q.ch!=null)qfb(q);
}
function qans(b){
  var q=QZ[qi];if(q.ch!=null)return;
  var k=q.l+"-"+q.w,o=get(k),i=+b.getAttribute("data-x");
  q.ch=i;q.ok=q.o[i].w==o.v;if(q.ok)qsc++;
  document.querySelector(".qhd span:last-child").textContent="Тўғри: "+qsc;
  qfb(q);
  if(q.ok){var me=q;clearTimeout(qtm);qtm=setTimeout(function(){if(QZ[qi]===me&&document.getElementById("qf"))qgo(1)},1000)}
}
var qtm=null;
function qfb(q){
  var k=q.l+"-"+q.w,o=get(k),am=TRK[k],ok=q.ok;
  document.querySelectorAll(".qo button").forEach(function(x){var j=+x.getAttribute("data-x");if(q.o[j].w==o.v)x.classList.add("ok");else if(j==q.ch)x.classList.add("no")});
  var t=document.querySelector('.qs [data-q="'+k+'"]');if(t)t.textContent=o.v;
  var h='<div class="res" style="color:'+(ok?'#16a34a':'#dc2626')+'">'+(ok?'Тўғри!':'Хато. Тўғриси: <span class="ar">'+o.v+'</span>')+'</div>';
  if(am){var as=document.querySelector('.qs [data-q="'+am[0]+'"]');if(as)as.classList.add("qa");
    h+='<div class="qam"><b>Таъсир қилган сўз:</b> <span class="ar">'+get(am[0]).v+'</span><br>'+am[1]+'</div>'}
  h+=irbRows(k,o,null,true);
  document.getElementById("qf").innerHTML=h;
  document.getElementById("qb").classList.remove("hide");
}
function qgo(d){
  clearTimeout(qtm);
  if(!document.getElementById("qf"))return;
  if(d>0){if(QZ[qi].ch==null)return;if(qi==QZ.length-1){qres();return}qi++}
  else{if(qi==0)return;qi--}
  qshow();document.getElementById("p3").scrollIntoView({block:"start"});
}
function qnext(){qgo(1)}
function qres(){
  var qmis=QZ.filter(function(q){return !q.ok});
  var h='<div class="qbox"><div class="qhd"><span>Натижа</span></div><div class="qsc">'+qsc+' / '+QZ.length+'</div>';
  if(qmis.length){h+='<div class="qq">Хато қилинган сўзлар:</div>';qmis.forEach(function(q){var k=q.l+"-"+q.w,o=get(k),am=TRK[k];h+='<div class="g"><div class="hd"><span class="ar vw">'+o.v+'</span><div class="mn"><div>'+(am?am[1]:arw(IRB[k]?IRB[k].r:(o.role||o.ty)))+'</div></div></div></div>'})}
  h+='<div class="qb"><button onclick="qi=QZ.length-1;qshow()">‹ Саволларга қайтиш</button><button class="pr" onclick="qstart()">Қайтадан</button></div></div>';
  document.getElementById("p3").innerHTML=h;
}
(function(){var p3=document.getElementById("p3"),sx=null,sy=0;
  p3.addEventListener("touchstart",function(e){if(e.touches.length==1){sx=e.touches[0].clientX;sy=e.touches[0].clientY}else sx=null},{passive:true});
  p3.addEventListener("touchend",function(e){if(sx==null)return;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6)qgo(dx>0?1:-1)},{passive:true});
  document.addEventListener("keydown",function(e){if(p3.classList.contains("hide"))return;if(e.key=="ArrowRight")qgo(1);else if(e.key=="ArrowLeft")qgo(-1)});
})();
'''
h=h[:a]+new+h[b:]
old='function qstart(){\n  QZ=qsh(qpool());QZ.forEach(function(q){q.o=qends(q.l+"-"+q.w)});qi=0;qsc=0;qmis=[];qshow();'
assert h.count(old)==1
h=h.replace(old,'function qstart(){\n  clearTimeout(qtm);QZ=qsh(qpool());QZ.forEach(function(q){q.o=qends(q.l+"-"+q.w);q.ch=null;q.ok=false});qi=0;qsc=0;qshow();')
css='''.qnv{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;font-size:14px}
.qnv button{font:inherit;font-size:22px;line-height:1;width:44px;height:36px;border-radius:10px;border:1px solid var(--bd);background:var(--cd);color:var(--tx);cursor:pointer}
.qnv button:disabled{opacity:.35}
.qbox .qb{position:sticky;bottom:0;background:var(--cd);padding:8px 0 calc(8px + env(safe-area-inset-bottom,0px));margin-bottom:-14px;border-top:1px solid var(--bd);z-index:3}
'''
h=h.replace('.qf .rw{font-size:14px}\n','.qf .rw{font-size:14px}\n'+css,1)
open(P,'w',encoding='utf-8').write(h);print('ok')
