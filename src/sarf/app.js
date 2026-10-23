var DATA=__DATA__;
var SIGA=DATA.siga,LS=DATA.lessons;
var CAT=[['mm','1 · Мозий'],['rm','2 · Музореъ'],['foil','3 · Исми фоил'],['maful','4 · Исми мафъул'],['jahd','5 · Жаҳд'],['nafy','6 · Нафий'],
 ['amr','7 · Амри ҳозир'],['ag','8 · Амри ғоиб'],['nahy','9 · Наҳий'],['zm','10 · Замон, макон'],['ol','11 · Исми олат'],['tf','12 · Исми тафзил']];
var MJ={mm:'mj',rm:'rj',jahd:'jahdj',nafy:'nafyj',ag:'agj',nahy:'nahyj'},SM='m';
function curK(v){v=v||SV;var j=MJ[SC];return (SM=='j'&&j&&v.T[j]&&!v.l)?j:SC}
var CFULL={mm:'Феъли мозий',rm:'Феъли музореъ',foil:'Исми фоил',maful:'Исми мафъул',jahd:'Феъли жаҳд',nafy:'Феъли нафий',amr:'Амри ҳозир',ag:'Амри ғоиб',nahy:'Наҳий',zm:'Исми замон ва макон',ol:'Исми олат',tf:'Исми тафзил',mj:'Мозий мажҳул',rj:'Музореъ мажҳул',agj:'Амри ғоиб мажҳул',nahyj:'Наҳий мажҳул'};
var CN=CFULL;
var K12=['mm','rm','foil','maful','jahd','nafy','amr','ag','nahy','zm','ol','tf'];
var MAJ={mj:1,rj:1,maful:1,agj:1,nahyj:1,jahdj:1,nafyj:1};
var ISMS=['муз. вохид','муз. тасния','муз. жамъ','муан. вохида','муан. тасния','муан. жамъ'],ZL=['вохид','тасния','жамъ'];
var ROWS={amr:[6,7,8,9,10,11],ag:[0,1,2,3,4,5,12,13]};
var L12=['Феъли мозий','Феъли музореъ','Исми фоил','Исми мафъул','Феъли жаҳд','Феъли нафий','Амри ҳозир','Амри ғоиб','Наҳий','Исми замон ва макон','Исми олат','Исми тафзил'];
var ST={};try{ST=JSON.parse(localStorage.getItem('sarf-holat')||'{}')||{}}catch(e){}
function save(){try{localStorage.setItem('sarf-holat',JSON.stringify(ST))}catch(e){}}
function $(s){return document.querySelector(s)}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function A(s){return '<span class="ar">'+s+'</span>'}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
/* o'zak harflari: shakllarda 1,2,3 raqamlari bilan belgilangan */
function P(f,r){return f.replace(/[123]/g,function(d){return r[d-1]})}
function C(f,r){return P(f,r)}
function bare(s){return String(s).replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim()}
function allV(){var a=[];LS.forEach(function(L){L.models.forEach(function(m,i){a.push({L:L,v:m,id:L.id+'/m'+i})});L.verbs.forEach(function(v,i){a.push({L:L,v:v,id:L.id+'/v'+i})})});return a}

/* ---------- ovoz ---------- */
var AU=null,AUt=0,TTS=null;
try{if(window.speechSynthesis&&typeof SpeechSynthesisUtterance!='undefined')TTS=speechSynthesis}catch(e){}
function arVoice(){if(!TTS)return null;var vs=TTS.getVoices()||[];for(var i=0;i<vs.length;i++)if(/^ar/i.test(vs[i].lang))return vs[i];return null}
if(TTS)try{TTS.getVoices();TTS.onvoiceschanged=function(){}}catch(e){}
function audioOf(v,cat,i){var a=v.au&&v.au.s[cat];return a&&a[i]?a[i]:null}
function canSay(v,cat){var a=v.au&&v.au.s[cat];return (a&&a.length==v.T[cat].length&&a.every(Boolean))||!!arVoice()}
var AUF='';
function say(v,cat,i,done){
  stopSay();var seg=audioOf(v,cat,i),f=P(v.T[cat][i],v.r||'');
  if(seg){au(v);var a=v.au.s[cat],nx=a[i+1]?a[i+1][0]:seg[1]+.5,end=Math.max(seg[1]+.12,Math.min(nx-.03,seg[1]+.45));
    AU.currentTime=Math.max(0,seg[0]-.04);var p=AU.play();if(p&&p.catch)p.catch(function(){});
    (function w(){if(AU.paused)return;if(AU.currentTime>=end){AU.pause();done&&done();return}RAF=requestAnimationFrame(w)})();return}
  var vo=arVoice();if(!vo){done&&setTimeout(done,600);return}
  var u=new SpeechSynthesisUtterance(f);u.voice=vo;u.lang=vo.lang;u.rate=.8;u.onend=function(){done&&done()};TTS.speak(u);
}
var RAF=0;
function au(v){if(!AU||AUF!=v.au.f){if(AU)AU.pause();AU=new Audio(v.au.f);AU.preload='auto';AUF=v.au.f}return AU}
function stopSay(){clearTimeout(AUt);cancelAnimationFrame(RAF);if(AU)AU.pause();try{TTS&&TTS.cancel()}catch(e){}}

/* ---------- bosh sahifa ---------- */
function home(){
  var h='<div class="top"><a class="bk" href="./">‹</a><div class="tt"><h1>Сарф</h1><p>Феъл боблари · тусланиш · машқ</p></div></div>';
  var nv=0;LS.forEach(function(L){nv+=L.verbs.length+L.models.length});
  var last=LS.filter(function(x){return x.id==ST.last})[0]||LS[0],p0=ST[last.id]||{};
  h+='<div class="hero2"><div class="ha ar">عِلْمُ الصَّرْفِ</div><p>Феъл қандай ясалиши ва тусланишини китоблардаги тартибда ўрганамиз.</p>'+
    '<div class="hs"><div><b>'+LS.length+'</b><span>очиқ боб</span></div><div><b>22</b><span>боб жами</span></div><div><b>'+nv+'</b><span>феъл</span></div><div><b>'+(p0.best!=null?p0.best+'%':'—')+'</b><span>машқ</span></div></div>'+
    '<a class="hgo" href="#'+last.id+'">▶ '+(p0.tab?'Давом этиш':'Бошлаш')+': '+last.n+' '+A(last.ar)+'</a></div>';
  h+='<div class="srch"><input id="q" type="search" placeholder="Феъл қидириш: باع، يضرب، сотмоқ…" autocomplete="off"></div><div id="qr"></div>';
  var due=(ST.err||[]).length;
  if(due)h+='<a class="it rv" href="#'+LS[0].id+'/m"><div class="nb">↻</div><div class="md"><b>Такрор</b><small>Хато қилинган '+due+' та шакл сизни кутяпти</small></div></a>';
  var SAR=['ثُلَاثِيٌّ مُجَرَّدٌ','ثُلَاثِيٌّ مَزِيدٌ','رُبَاعِيٌّ']; 
  DATA.plan.forEach(function(g,gi){
    h+='<div class="stg"><span class="sn">'+(gi+1)+'</span><div><b>'+g[0]+'</b><small class="ar">'+(SAR[gi]||'')+'</small></div></div><div class="tl">';
    if(gi==0)LS.forEach(function(L){var p=ST[L.id]||{};
      h+='<a class="it" href="#'+L.id+'"><div class="nb">'+L.n.replace('-','-<br>')+'</div><div class="md">'+A(L.ar)+'<small>'+A(L.m)+'</small>'+
        (p.best!=null?'<span class="pg">Машқ: '+p.best+'%</span>':'<span class="pg">Очиқ</span>')+'</div></a>'});
    g[1].forEach(function(x){h+='<div class="it lk"><div class="nb">'+x[0].replace('-','-<br>')+'</div><div class="md">'+A(x[1])+'<small>'+(x[2]?A(x[2])+' · ':'')+'тез орада</small></div></div>'});
    h+='</div>';
  });
  $('#app').innerHTML=h;
  $('#q').oninput=function(){search(this.value,$('#qr'))};
}
function search(q,el){
  q=q.trim();if(!q){el.innerHTML='';return}
  var b=bare(q),lo=q.toLowerCase(),res=[];
  allV().forEach(function(x){var v=x.v,r=v.r,hit=0;
    if(/[؀-ۿ]/.test(q)){for(var c in v.T){if(v.T[c].some(function(f){return bare(P(f,r))==b})){hit=2;break}}
      if(!hit&&(bare(P(v.T.mm[0],r)).indexOf(b)==0||bare(v.ms||'').indexOf(b)==0))hit=1}
    else if((v.mn||'').toLowerCase().indexOf(lo)>=0)hit=1;
    if(hit&&!res.some(function(y){return P(y.v.T.mm[0],y.v.r)==P(v.T.mm[0],r)}))res.push(x)});
  el.innerHTML=res.length?res.slice(0,12).map(function(x){var v=x.v;return '<div class="vb" onclick="location.hash=\''+x.id+'\'"><div class="mn">'+esc(v.mn)+'<span class="tg">'+x.L.n+' · '+v.tn+'</span></div><div class="fm ar">'+P(v.T.mm[0],v.r)+' – '+P(v.T.rm[0],v.r)+'</div></div>'}).join('')
    :'<p class="note">Топилмади. Ҳозирча базада фақат 1-боб феъллари бор.</p>';
}

/* ---------- dars ---------- */
var CUR=null,TAB='q';
function lesson(id,sub){
  var L=LS.filter(function(x){return x.id==id})[0];if(!L)return home();
  CUR=L;ST.last=id;save();var p=ST[id]||{};TAB=sub=='m'?'m':(sub=='t'||sub=='f'?'f':(p.tab||'q'));if(TAB=='j'||TAB=='t')TAB='f';
  var h='<div class="top"><a class="bk" href="#">‹</a><div class="tt"><h1>'+L.n+': '+A(L.ar)+'</h1><p>'+L.uz+'</p></div></div>'+
    '<div class="tbs" id="tbs">'+[['q','Қоида'],['f','Феъллар'],['m','Машқ']].map(function(t){return '<button data-t="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div><div id="tc"></div>';
  $('#app').innerHTML=h;
  [].forEach.call(document.querySelectorAll('#tbs button'),function(b){b.onclick=function(){tab(b.getAttribute('data-t'))}});
  tab(TAB,true);
  if(sub&&/^[mv]\d+$/.test(sub)){var v=sub[0]=='m'?L.models[+sub.slice(1)]:L.verbs[+sub.slice(1)];if(v)sheet(v)}
}
function tab(t,first){
  TAB=t;ST[CUR.id]=ST[CUR.id]||{};ST[CUR.id].tab=t;save();
  [].forEach.call(document.querySelectorAll('#tbs button'),function(b){b.classList.toggle('on',b.getAttribute('data-t')==t)});
  var f={q:rule,f:feellar,m:mashq}[t];$('#tc').innerHTML='';f($('#tc'));
  if(!first)window.scrollTo(0,0);
}
function arw(s){return s.replace(/([؀-ۿ][؀-ۿً-ْ]*(?:\s*[→،–]\s*[؀-ۿ][؀-ۿً-ْ]*)*)/g,function(m){return A(m)})}
function rule(el){
  var h='',open=false;
  CUR.rule.forEach(function(r){
    if(r[0]=='h'){if(open)h+='</div>';h+='<div class="card"><h3>'+arw(r[1])+'</h3>';open=true}
    else if(r[0]=='p')h+='<p>'+r[1]+'</p>';
    else if(r[0]=='verse')h+='<div class="verse">'+r[1]+'</div>';
    else if(r[0]=='ms')h+='<table class="ms">'+r[1].map(function(x){return '<tr><td class="ar">'+x[0]+'</td><td class="ar">'+x[1]+'</td><td>'+x[2]+'</td></tr>'}).join('')+'</table>';
    else if(r[0]=='l12')h+='<ol class="l12">'+L12.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol>';
  });
  if(open)h+='</div>';
  el.innerHTML=h+'<button class="sbtn full" onclick="tab(\'f\')">Феъллар ›</button>';
}
/* ---------- fe'llar: turlar bo'yicha, namuna bilan birga ---------- */
function groups(){
  var G=[];
  CUR.models.forEach(function(m,mi){
    var g={m:m,mi:mi,tn:m.tn,v:[]},mz=P(m.T.mm[0],m.r);
    CUR.verbs.forEach(function(v,vi){if(v.tn==m.tn&&P(v.T.mm[0],v.r)!=mz)g.v.push([v,vi])});
    G.push(g);
  });
  return G;
}
var OPEN={};
function vrow(v,on,nam){
  return '<div class="vr'+(nam?' nm':'')+'" onclick="'+on+'"><div class="vm"><b>'+esc(v.mn)+'</b>'+(nam?'<span class="nb2">намуна</span>':'')+(v.l?'<span class="lz">лозим</span>':'')+'</div>'+
    '<div class="va ar">'+P(v.T.mm[0],v.r)+'<span> – '+P(v.T.rm[0],v.r)+'</span></div></div>';
}
function feellar(el){
  var G=groups(),tot=0;G.forEach(function(g){tot+=1+g.v.length});
  var h='<div class="srch"><input id="q2" type="search" placeholder="Қидириш: باع، يضرب، сотмоқ…" autocomplete="off"></div>'+
    '<div class="jmp" id="jmp">'+G.map(function(g,i){return '<button data-i="'+i+'">'+g.tn+' <small>'+(1+g.v.length)+'</small></button>'}).join('')+'</div><div id="vl"></div>';
  el.innerHTML=h;
  [].forEach.call(el.querySelectorAll('#jmp button'),function(b){b.onclick=function(){var t=document.getElementById('g'+b.getAttribute('data-i'));
    if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-$('#tbs').offsetHeight-8,behavior:'smooth'})}});
  $('#q2').oninput=function(){if(this.value.trim())search(this.value,$('#vl'));else list()};
  function list(){
    var vh='';
    G.forEach(function(g,gi){var m=g.m,iz=m.izoh,op=OPEN[gi];
      vh+='<section class="grp" id="g'+gi+'"><div class="gh"><div class="gt"><span class="gn">'+g.tn+'</span><span class="gc">'+(1+g.v.length)+' та феъл</span></div>'+
        '<div class="gi"><p>'+arw(iz[0])+'</p>'+(iz.length>1?(op?iz.slice(1).map(function(p){return '<p>'+arw(p)+'</p>'}).join(''):'')+
        '<button class="more" data-g="'+gi+'">'+(op?'Қисқароқ ‹':'Батафсил ›')+'</button>':'')+'</div></div>'+
        '<div class="vls">'+vrow(m,'sheet(CUR.models['+g.mi+'])',1)+g.v.map(function(x){return vrow(x[0],'sheet(CUR.verbs['+x[1]+'])')}).join('')+'</div></section>';
    });
    $('#vl').innerHTML=vh+'<p class="note c">Жами '+tot+' та феъл. Феълни босинг — 12 нарсаси ва тўлиқ тусланиши очилади.</p>';
    [].forEach.call($('#vl').querySelectorAll('.more'),function(b){b.onclick=function(e){e.stopPropagation();var g=+b.getAttribute('data-g');OPEN[g]=!OPEN[g];list()}});
  }
  list();
}

/* ---------- jadval oynasi ---------- */
var SV=null,SC='mm',HIDE=false,CMP=null,PLAY=false;
function sheet(v,cat){
  SV=v;SC=cat||'mm';SM='m';CMP=null;HIDE=false;stopSay();PLAY=false;
  var b=$('#sbx');
  var nam=CUR&&CUR.models.indexOf(v)>=0;
  b.innerHTML='<div class="grab"></div><div class="bh"><div class="tt"><div class="hv ar">'+P(v.T.mm[0],v.r)+' – '+P(v.T.rm[0],v.r)+(v.ms?' – '+v.ms:'')+'</div>'+
    '<div class="hm">'+esc(v.mn||'')+'</div><div class="hb"><span>'+v.tn+'</span>'+(nam?'<span class="o">намуна</span>':'')+(v.l?'<span>лозим</span>':'')+'</div></div><button class="x" onclick="closeSh()">✕</button></div>'+
    '<div class="acts"><button id="bP">▶ Ўқиб бериш</button></div>'+
    '<div class="cats" id="scs"></div><div class="bd" id="sbd"></div>';
  $('#bP').onclick=function(){if(PLAY){PLAY=false;stopSay();this.textContent='▶ Ўқиб бериш';mark(-1)}else playAll()};
  if(v.au)au(v);
  draw();$('#sh').classList.add('on');
}
function cats(v){return CAT.filter(function(c){return v.T[c[0]]&&!(v.l&&MAJ[c[0]])&&!(CMP&&!CMP.T[c[0]])})}
function draw(){
  var v=SV,cs=cats(v);if(!v.T[SC]||(v.l&&MAJ[SC]))SC='mm';
  $('#scs').innerHTML=cs.map(function(c){return '<button data-c="'+c[0]+'" class="'+(c[0]==SC?'on':'')+'">'+c[1]+'</button>'}).join('');
  [].forEach.call(document.querySelectorAll('#scs button'),function(b){b.onclick=function(){SC=b.getAttribute('data-c');stopSay();PLAY=false;$('#bP').textContent='▶ Ўқиб бериш';draw()}});
  var on=$('#scs .on'),sc=$('#scs');if(on)sc.scrollLeft=on.offsetLeft-sc.offsetLeft-sc.clientWidth/2+on.offsetWidth/2;
  var K=curK(),hasJ=MJ[SC]&&v.T[MJ[SC]]&&!v.l&&!(CMP&&CMP.l);
  $('#bP').style.display=canSay(v,K)&&!CMP?'':'none';
  var F=v.T[K],G=CMP&&CMP.T[K],rows='',lab=labels(K,F.length);
  if(CMP)rows+='<tr class="cmh"><td></td><td class="f">'+C(CMP.T.mm[0],CMP.r)+'</td><td class="f">'+C(v.T.mm[0],v.r)+'</td></tr>';
  F.forEach(function(x,i){
    if(lab[i].g)rows+='<tr class="gp"><td colspan="3">'+lab[i].g+'</td></tr>';
    if(CMP){var y=G[i]||'',df=y.replace(/[123]/g,'#')!=x.replace(/[123]/g,'#');
      rows+='<tr><td class="s">'+lab[i].s+(lab[i].p?' '+A(lab[i].p):'')+'</td><td class="f'+(df?' df':'')+'">'+C(y,CMP.r)+'</td><td class="f'+(df?' df':'')+'">'+C(x,v.r)+'</td></tr>'}
    else rows+='<tr data-i="'+i+'"><td class="s">'+lab[i].s+'</td><td class="p">'+(lab[i].p||'')+'</td><td class="f'+(HIDE?' hid':'')+'">'+C(x,v.r)+'</td></tr>';
  });
  var h=(hasJ?'<div class="seg" id="seg"><button data-m="m" class="'+(SM=='m'?'on':'')+'">Маълум</button><button data-m="j" class="'+(SM=='j'?'on':'')+'">Мажҳул</button></div>':'')+
    '<table class="tb'+(CMP?' cmp':'')+'">'+rows+'</table>';
  if(CMP)h+='<p class="note">Сариқ — икки феълда фарқ қиладиган шакллар. <a href="javascript:void 0" onclick="CMP=null;draw()">Солиштиришни ёпиш</a></p>';
  else h+='<p class="note">'+'Қаторни босинг — ўқилиши, тузилиши ва шу олмошнинг бошқа шакллари.'+'</p>';
  if(v.l)h+='<p class="note">Бу феъл лозим (ўтимсиз), шунинг учун мажҳул сийғалари ва исми мафъули кўрсатилмади.</p>';
  $('#sbd').innerHTML=h;
  [].forEach.call(document.querySelectorAll('#seg button'),function(b){b.onclick=function(){SM=b.getAttribute('data-m');stopSay();PLAY=false;$('#bP').textContent='▶ Ўқиб бериш';draw()}});
  if(!CMP)[].forEach.call(document.querySelectorAll('#sbd tr[data-i]'),function(tr){tr.onclick=function(){
    var i=+tr.getAttribute('data-i'),fc=tr.querySelector('.f');
    if(fc.classList.contains('hid')){fc.classList.remove('hid');say(SV,curK(),i);return}
    detail(tr,i)}});
}
function labels(cat,n){
  var o=[];
  if(cat=='zm'||cat=='ol'){for(var i=0;i<n;i++)o.push({s:ZL[i]});return o}
  if(cat=='foil'||cat=='maful'||cat=='tf'){for(var i=0;i<n;i++)o.push({s:ISMS[i],g:i==0?'Музаккар':(i==3?'Муаннас':'')});return o}
  var R=ROWS[cat]||[0,1,2,3,4,5,6,7,8,9,10,11,12,13];
  R.forEach(function(k){o.push({s:SIGA[k][1],p:SIGA[k][0],k:k,g:k==0?'Ғоиб (III шахс)':(k==6?'Мухотаб (II шахс)':(k==12?'Мутакаллим (I шахс)':''))})});
  return o;
}
function detail(tr,i){
  var old=$('#sbd tr.dt'),was=old&&old.previousSibling==tr;if(old)old.parentNode.removeChild(old);
  [].forEach.call(document.querySelectorAll('#sbd tr.sel'),function(x){x.classList.remove('sel')});
  if(was)return;
  var K=curK();tr.classList.add('sel');say(SV,K,i);
  var v=SV,f=v.T[K][i],lab=labels(K,v.T[K].length)[i],h='';
  /* tuzilishi: old qo'shimcha · o'zak · oxirgi qo'shimcha */
  var a=f.search(/[123]/),b=-1;for(var j=f.length-1;j>=0;j--)if(/[123]/.test(f[j])){b=j;break}
  if(a>=0){b++;while(b<f.length&&/[ً-ْ]/.test(f[b]))b++;
    var pre=P(f.slice(0,a),v.r),mid=C(f.slice(a,b),v.r),post=P(f.slice(b),v.r);
    h+='<div class="prt">'+(post?'<span><small>охири</small>'+A(post)+'</span>':'')+'<span class="m"><small>ўзак</small>'+A(mid)+'</span>'+(pre?'<span><small>боши</small>'+A(pre)+'</span>':'')+'</div>'}
  /* shu olmoshning boshqa shakllari */
  if(lab.k!=null){var k=lab.k,L=[];
    CAT.forEach(function(c){var F=v.T[c[0]];if(!F||c[0]==K||(v.l&&MAJ[c[0]]))return;var R=ROWS[c[0]];
      if(R){var ix=R.indexOf(k);if(ix>=0)L.push([CFULL[c[0]],F[ix]])}else if(F.length==14)L.push([CFULL[c[0]],F[k]])});
    if(L.length)h+='<div class="oth"><small>'+A(lab.p)+' — бошқа шаклларда:</small>'+L.map(function(x){return '<div><span>'+x[0]+'</span>'+A(C(x[1],v.r))+'</div>'}).join('')+'</div>'}
  var d=document.createElement('tr');d.className='dt';d.innerHTML='<td colspan="3">'+h+'</td>';tr.parentNode.insertBefore(d,tr.nextSibling);
}
function mark(i){[].forEach.call(document.querySelectorAll('#sbd tr[data-i]'),function(tr){tr.classList.toggle('pl',+tr.getAttribute('data-i')==i)})}
function playAll(){
  var K=curK(),n=SV.T[K].length,i=0,A=SV.au&&SV.au.s[K];PLAY=true;$('#bP').textContent='■ Тўхтатиш';
  if(A&&A.length==n&&A.every(Boolean)){   /* yozilgan ovoz: uzluksiz o'qish, qatorlar ovozga ergashadi */
    stopSay();au(SV);var cur=-1,end=A[n-1][1]+.35;AU.currentTime=Math.max(0,A[0][0]-.05);var p=AU.play();if(p&&p.catch)p.catch(function(){});
    (function w(){if(!PLAY)return;var t=AU.currentTime,k=0;while(k+1<n&&t>=A[k+1][0]-.06)k++;
      if(k!=cur){cur=k;mark(k);var tr=$('#sbd tr[data-i="'+k+'"]');if(tr)tr.scrollIntoView({block:'nearest',behavior:'smooth'})}
      if(t>=end||AU.ended){AU.pause();PLAY=false;$('#bP').textContent='▶ Ўқиб бериш';mark(-1);return}
      RAF=requestAnimationFrame(w)})();
    return}
  (function nx(){if(!PLAY)return;if(i>=n){PLAY=false;$('#bP').textContent='▶ Ўқиб бериш';mark(-1);return}
    mark(i);var tr=$('#sbd tr[data-i="'+i+'"]');if(tr)tr.scrollIntoView({block:'nearest',behavior:'smooth'});
    var k=i++;say(SV,K,k,function(){setTimeout(nx,180)})})();
}
function pickCmp(){
  var a=allV().filter(function(x){return x.v!==SV}),b=$('#sbd');
  b.innerHTML='<p class="note">Қайси феъл билан солиштирамиз?</p>'+a.map(function(x,i){var v=x.v;return '<div class="vb" data-i="'+i+'"><div class="mn">'+esc(v.mn)+'<span class="tg">'+v.tn+'</span></div><div class="fm ar">'+C(v.T.mm[0],v.r)+' – '+C(v.T.rm[0],v.r)+'</div></div>'}).join('');
  [].forEach.call(b.querySelectorAll('.vb'),function(d){d.onclick=function(){CMP=a[+d.getAttribute('data-i')].v;draw()}});
}
function closeSh(){stopSay();PLAY=false;$('#sh').classList.remove('on')}
$('#sh').addEventListener('click',function(e){if(e.target.id=='sh')closeSh()});

/* ---------- mashq ---------- */
var Q=null;
function uniq(F,k){var c=0;F.forEach(function(x){if(x==F[k])c++});return c==1}
function errs(){return ST.err=ST.err||[]}
function qBuild(vi,cat,k){
  var v=CUR.verbs[vi],F=v.T[cat],c=F[k],d=shuffle(F.filter(function(x,i,a){return x!=c&&a.indexOf(x)==i})).slice(0,3);if(d.length<3)return null;
  var R=ROWS[cat],sk=R?R[k]:k;
  return {t:CN[cat]+' · '+SIGA[sk][1],a:SIGA[sk][0],s:P(v.T.mm[0],v.r)+' – '+P(v.T.rm[0],v.r)+' — '+v.mn,o:shuffle(d.concat([c])).map(function(x){return {h:A(P(x,v.r)),ok:x==c}}),
          x:A(SIGA[sk][0])+' → '+A(P(c,v.r)),e:[vi,cat,k]};
}
function mkQ(){
  var V=CUR.verbs,out=[],E=errs().slice(0,4);
  E.forEach(function(e){var q=qBuild(e[0],e[1],e[2]);if(q){q.rv=1;out.push(q)}});
  var types=shuffle(['siga','build','tur','mu','siga','build','amr','siga','build','tur']).slice(0,10-out.length);
  types.forEach(function(ty){
    for(var tries=0;tries<30;tries++){
      var vi=Math.floor(Math.random()*V.length),v=V[vi],q=null;
      if(ty=='siga'){var cat=pick(['mm','rm']),k=Math.floor(Math.random()*14);if(!uniq(v.T[cat],k))continue;
        var o=shuffle(SIGA.map(function(s,i){return i}).filter(function(i){return i!=k&&SIGA[i][0]!=SIGA[k][0]})).slice(0,3).concat([k]);
        q={t:'Бу қайси сийға? ('+(cat=='mm'?'мозий':'музореъ')+')',a:P(v.T[cat][k],v.r),s:P(v.T.mm[0],v.r)+' – '+v.mn,o:shuffle(o).map(function(i){return {h:A(SIGA[i][0])+' · '+SIGA[i][1],ok:i==k}}),
           x:A(P(v.T[cat][k],v.r))+' — '+SIGA[k][1]+' ('+A(SIGA[k][0])+')',e:[vi,cat,k]}}
      else if(ty=='build'){var cat=pick(['mm','rm','jahd','amr']),n=v.T[cat].length,k=Math.floor(Math.random()*n);if(v.l&&MAJ[cat])continue;q=qBuild(vi,cat,k)}
      else if(ty=='tur'){var ts=[];CUR.models.forEach(function(m){if(m.tn!=v.tn)ts.push(m.tn)});
        q={t:'Бу феъл қайси турдан?',a:P(v.T.mm[0],v.r)+' – '+P(v.T.rm[0],v.r),s:v.mn,o:shuffle(shuffle(ts).slice(0,3).concat([v.tn])).map(function(x){return {h:x,ok:x==v.tn}}),x:A(P(v.T.mm[0],v.r))+' — '+v.tn}}
      else if(ty=='mu'){if(!v.alt)continue;var c=P(v.T.rm[0],v.r);
        q={t:'Музореъи қайси? ('+CUR.n+')',a:P(v.T.mm[0],v.r),s:v.mn,o:shuffle([v.T.rm[0]].concat(v.alt)).map(function(x){return {h:A(P(x,v.r)),ok:x==v.T.rm[0]}}),x:CUR.qmu+': '+A(c)}}
      else if(ty=='amr'){if(!v.alta)continue;var c=v.T.amr[0];
        q={t:'Амри ҳозир (мухотаб) қайси?',a:P(v.T.mm[0],v.r)+' – '+P(v.T.rm[0],v.r),s:v.mn,o:shuffle([c].concat(v.alta)).map(function(x){return {h:A(P(x,v.r)),ok:x==c}}),x:CUR.qamr+': '+A(P(c,v.r))}}
      if(q){out.push(q);break}
    }
  });
  return out;
}
function mashq(el){
  var p=ST[CUR.id]||{},n=errs().length;
  el.innerHTML='<div class="card"><h3>Машқ</h3><p>10 та савол: сийғани топиш, тўғри шаклни танлаш, феълнинг турини ва музореъини аниқлаш.</p>'+
    (n?'<p>↻ Аввалги хатолардан <b>'+Math.min(4,n)+'</b> таси яна сўралади.</p>':'')+
    (p.best!=null?'<p>Энг яхши натижа: <b>'+p.best+'%</b></p>':'')+'<button class="sbtn full" id="qst">Бошлаш</button></div>';
  $('#qst').onclick=function(){Q={qs:mkQ(),i:0,ok:0,mis:[]};qshow(el)};
}
function qshow(el){
  var q=Q.qs[Q.i];
  var h='<div class="card q"><div class="pr"><i style="width:'+(Q.i*100/Q.qs.length)+'%"></i></div><div class="qt">'+(Q.i+1)+' / '+Q.qs.length+(q.rv?' · ↻ такрор':'')+' · '+q.t+'</div>'+
    '<div class="qa ar">'+q.a+'</div><div class="qs">'+(/[؀-ۿ]/.test(q.s)?arw(esc(q.s)):esc(q.s))+'</div>'+
    '<div class="op">'+q.o.map(function(o,i){return '<button data-i="'+i+'">'+o.h+'</button>'}).join('')+'</div><div id="qx"></div></div>';
  el.innerHTML=h;
  [].forEach.call(el.querySelectorAll('.op button'),function(b){b.onclick=function(){
    if(q.done)return;q.done=1;var i=+b.getAttribute('data-i'),ok=q.o[i].ok,E=errs(),key=q.e&&q.e.join('|');
    [].forEach.call(el.querySelectorAll('.op button'),function(x,j){if(q.o[j].ok)x.classList.add('ok')});
    if(key){var at=-1;E.forEach(function(e,j){if(e.join('|')==key)at=j});
      if(ok&&at>=0)E.splice(at,1);if(!ok&&at<0)E.push(q.e);save()}
    if(!ok){b.classList.add('no');Q.mis.push(q)}else Q.ok++;
    $('#qx').innerHTML='<div class="ex">'+(ok?'✓ Тўғри. ':'✗ Нотўғри. ')+q.x+'</div><button class="sbtn full" style="margin-top:10px" id="qn">'+(Q.i+1<Q.qs.length?'Кейинги ›':'Натижа')+'</button>';
    $('#qn').onclick=function(){Q.i++;if(Q.i<Q.qs.length)qshow(el);else qres(el)};
  }});
}
function qres(el){
  var pc=Math.round(Q.ok*100/Q.qs.length),p=ST[CUR.id]=ST[CUR.id]||{};
  if(p.best==null||pc>p.best)p.best=pc;save();
  el.innerHTML='<div class="card res"><div class="sc">'+pc+'%</div><p>'+Q.ok+' / '+Q.qs.length+' тўғри</p>'+
    (Q.mis.length?'<div style="text-align:left">'+Q.mis.map(function(q){return '<div class="izoh"><p>'+q.x+'</p></div>'}).join('')+'<p class="note">Хато қилинганлари кейинги машқларда яна сўралади.</p></div>':'<p>Барака топинг! Ҳаммаси тўғри.</p>')+
    '<button class="sbtn full" id="qa">Яна бир марта</button></div>';
  $('#qa').onclick=function(){Q={qs:mkQ(),i:0,ok:0,mis:[]};qshow(el)};
}

function route(){closeSh();var h=decodeURIComponent(location.hash.slice(1));if(/tgWebApp/.test(h))h='';var p=h.split('/');if(p[0])lesson(p[0],p[1]);else home();window.scrollTo(0,0)}
addEventListener('hashchange',route);route();
