import json,sys,re
sys.path.insert(0,'irb')
import data
P='/mnt/user-data/outputs/lesson92/index.html'
h=open(P,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global h
    n=h.count(old)
    assert n==cnt,(old[:60],n)
    h=h.replace(old,new)
# 1. data
E={}
for k,e in data.E.items():
    d={}
    for f in 't r o i b n'.split():
        if e.get(f): d[f]=e[f]
    if e.get('x'): d['x']=e['x']
    d['a']=[list(p) for p in e['a']]
    E[k]=d
js='/* klassik i\'rob: t=turi r=gapdagi o\'rni o=omil i=i\'robi b=belgisi x=qolgan qismlari n=izoh a=arabcha i\'rob */\nvar IRB='+json.dumps(E,ensure_ascii=False,separators=(',',':'))+';\n'
rep('\nvar CK=[', '\n'+js+'var CK=[')
# 2. renderer + op
old_op=h[h.index('function op(el){'):h.index('function cl(e)')]
new_op='''function arw(s){return String(s).replace(/[\\u0600-\\u06FF]+(?:[\\s\\u060C]+[\\u0600-\\u06FF]+)*/g,function(m){return '<span class="ar">'+m+'</span>'})}
function irbRows(k,o,WP,q){
  var E=IRB[k],h="";
  function rw(l,v,raw){if(v)h+='<div class="rw"><i>'+l+'</i><div>'+(raw?v:arw(v))+'</div></div>'}
  if(!E){if(o.ty)rw("Тури",'<b>'+o.ty+'</b>');rw("Гапдаги ўрни",o.role);rw("Изоҳ",o.why);rw("Маъноси",o.mn);return h}
  rw("Тури",'<b>'+(E.t||o.ty)+'</b>');
  if(WP&&!q){var p="";WP.forEach(function(r){p+='<div class="wpr"><span class="ar">'+r.h.replace(/<\\/?b>/g,"")+'</span> — '+arw(r.d)+'</div>'});rw("Қисмлари",p,1)}
  rw("Гапдаги ўрни",E.r);rw("Омил (таъсир қилувчи)",E.o);rw("Иъроби",E.i);rw("Белгиси",E.b);
  if(E.x)rw("Қолган қисмлари",E.x.join("<br>"));
  rw("Изоҳ",E.n);rw("Маъноси",o.mn);
  if(E.a){var a="";E.a.forEach(function(p){a+='<div>'+(p[0]?'<b>'+p[0]+':</b> ':'')+p[1]+'</div>'});h+='<div class="irb"><i>Арабча иъроб</i>'+a+'</div>'}
  return h;
}
function op(el){
  var k=el.getAttribute("data-i"),q=k.split("-");hl(+q[0],[+q[1]]);
  var o=get(k),mb=o.c=="BC";
  var ir=irb(k),WP=wparts(o),mbn=mb||o.c=="B",h='<div class="big">'+(WP?wshow(o,mbn?{pre:"",mid:""}:ir,WP):(mbn?o.v:ir.pre+'<b>'+ir.mid+'</b>'+ir.post))+'</div>';
  h+=irbRows(k,o,WP,false);
  h+='<button class="x" onclick="document.getElementById(\\'sh\\').classList.remove(\\'on\\')">Ёпиш</button>';
  document.getElementById("sb").innerHTML=h;
  document.getElementById("sh").classList.add("on");
}
'''
h=h.replace(old_op,new_op)
# 3. qans
rep("""h+=(o.ty?'<div><b>'+o.ty+'</b></div>':'')+(o.role?'<div>'+o.role+'</div>':'')+(o.why?'<div>'+o.why+'</div>':'')+'<div style="color:var(--mu);margin-top:4px">Маъноси: '+o.mn+'</div>';""",
    "h+=irbRows(k,o,null,true);")
rep("h+='<div class=\"g\"><div class=\"hd\"><span class=\"ar vw\">'+o.v+'</span><div class=\"mn\"><div>'+(am?am[1]:(o.role||o.ty))+'</div>",
    "h+='<div class=\"g\"><div class=\"hd\"><span class=\"ar vw\">'+o.v+'</span><div class=\"mn\"><div>'+(am?am[1]:arw(IRB[k]?IRB[k].r:(o.role||o.ty)))+'</div>")
# 4. CSS
css='''.rw{display:grid;grid-template-columns:92px 1fr;gap:10px;padding:7px 0;border-bottom:1px solid var(--bd);font-size:15px;line-height:1.5}
.rw>i{font-style:normal;color:var(--mu);font-size:12px;line-height:1.35;padding-top:3px}
.rw .ar{font-size:1.2em;line-height:1.3;unicode-bidi:isolate;direction:rtl}
.rw .wpr .ar{font-size:22px}
.irb{margin-top:12px;background:rgba(15,118,110,.07);border:1px solid var(--bd);border-radius:12px;padding:8px 12px}
.irb>i{display:block;font-style:normal;color:var(--mu);font-size:12px;margin-bottom:2px}
.irb div{direction:rtl;text-align:right;font-family:"DarsNaskh","Noto Naskh Arabic","Geeza Pro","Traditional Arabic",serif;font-size:calc(var(--fs,22px) * .86);line-height:2}
.irb div+div{border-top:1px dashed var(--bd)}
.irb b{color:var(--ac);font-weight:700}
.qf .rw{font-size:14px}
'''
rep('.hide{display:none}\n', '.hide{display:none}\n'+css)
# 5. typo
h=h.replace('маушуф','мавсуф')
open(P,'w',encoding='utf-8').write(h)
print('ok',len(h))
