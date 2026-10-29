# -*- coding: utf-8 -*-
import json, re, sys
sys.path.insert(0, '.')
import new92
P = '/mnt/user-data/outputs/lesson92/index.html'
h = open(P, encoding='utf-8').read()

def jdump(o): return json.dumps(o, ensure_ascii=False, separators=(',', ':'))
def sub1(old, new):
    global h
    n = h.count(old)
    assert n == 1, (n, old[:80])
    h = h.replace(old, new)

# ---- IRB ----
a = h.index('var IRB='); b = h.index(';\n', a)
E = json.loads(h[a+8:b])
NE = {}
for k, e in E.items():
    n = new92.N[k]
    aa = e.get('a', [])
    aa = [[p[0], new92.AFIX.get((k, p[0]), p[1])] for p in aa]
    o = {'k': n['k'], 's': n['s'], 'j': n['j']}
    if n.get('q'): o['q'] = 1
    if n.get('x'): o['x'] = n['x']
    if n.get('y'): o['y'] = n['y']
    if aa: o['a'] = aa
    NE[k] = o
assert set(NE) == set(new92.N)
gt = {str(k): v for k, v in new92.GT.items()}
h = h[:a] + 'var IRB=' + jdump(NE) + ';\nvar GT=' + jdump(gt) + h[b:]

# ---- TRK ----
a = h.index('var TRK='); b = h.index(';\n', a)
h = h[:a] + 'var TRK=' + jdump(new92.TRK) + h[b:]

# ---- QT terminology ----
a = h.index('var QT='); b = h.index(';\n', a)
QT = json.loads(h[a+7:b])
SPEC = [
 ("Иккаласи ҳам марфуъ", "Иккаласи ҳам раф қилинади"),
 ("мубтадони ибтидо (маънавий омил), хабарни эса мубтадо марфуъ қилади", "мубтадони ибтидо (маънавий омил), хабарни эса мубтадо раф қилади"),
 ("хабари ёки мубтадоси тушириб қолдирилган деб иъроб қилинади", "хабари ёки мубтадоси маҳзуф деб таркиб қилинади"),
 ("мубтадо уларнинг исми бўлиб марфуъ қолади, хабар уларнинг хабари бўлиб мансуб бўлади", "мубтадо уларнинг исми бўлиб раф қилинади, хабар уларнинг хабари бўлиб насб қилинади"),
 ("лафзан мажрур, маҳаллан мансуб", "лафзан жар қилинган, насб ўринда"),
 ("хабарни марфуъ қолдиради", "хабарни раф қилади"),
 ("Насб белгиси — фатҳа; афъоли хамсада — нуннинг ҳазфи", "Насб аломати — фатҳа; амсилатул хомсада — нуннинг ҳазф бўлиши"),
 ("Яширин أَنْ билан ҳам мансуб бўлади", "Маҳзуф أَنْ билан ҳам насб қилинади"),
 ("Мудори феъл ўзини насб ёки жазм қилувчи сўз бўлмаса марфуъ бўлади.", "Музорий феъли уни насб ёки жазм қилувчи сўз бўлмаса раф қилинади."),
 ("Рафъ белгиси — дамма", "Раф аломати — замма"),
 ("Афъоли хамсада рафъ белгиси — ن", "Амсилатул хомсада раф аломати — нуннинг жойида туриши"),
 ("Улар амал қилмайди — феъл марфуъ қолади", "Улар амал қилмайди — феъл раф қилинганича қолади"),
 ("мудорисининг жазмдаги белгисига мабний", "музорийсининг жазмдаги аломатига мабний"),
 ("• афъоли хамсадан бўлса — нуннинг ҳазфига", "• амсилатул хомсадан бўлса — ن нинг ҳазф бўлишига"),
 ("Афъоли хамса:", "Амсилатул хомса:"),
 ("(фориқа алиф)", "(фарқлаш ҳарфи)"),
 ("Ҳаракатли рафъ олмоши", "Ҳаракатли бориз фоил замири"),
 ("иъробда эргашади", "эъробда эргашади"),
 ("Маътуф маътуфун алайҳга", "Маътуф ўзидан олдингисига"),
 ("иъроб белгиси эмас", "эъроб аломати эмас"),
 ("жамъ музаккар солимдек иъроб қилинади", "жам музаккар солимдек турланади"),
 ("мусаннодек иъроб қилинади", "тасниядек турланади"),
 ("уланган олмош", "муттасил замир"),
 ("(марфуъ)", "(раф)"), ("(мансуб)", "(насб)"), ("(мажрур)", "(жар)"),
 ("маҳаллан мажрур — мудоф илайҳ", "жар ўринда — музофун илайҳ"),
 ("Олмошлар доим мабний; иъроби қаерга уланганига қараб:", "Замирлар доим мабний; ўрни қаерга уланганига қараб:"),
 ("• исмга — мудоф илайҳ, маҳаллан мажрур", "• исмга — музофун илайҳ, жар ўринда"),
 ("• феълга — мафъул биҳ, маҳаллан мансуб", "• феълга — мафъулун биҳ, насб ўринда"),
 ("(ёки фоил:", "(ёки бориз фоил замири:"),
 ("• жарр ҳарфига — маҳаллан мажрур", "• жар ҳарфига — мажрур, жар ўринда"),
 ("унинг исми, маҳаллан мансуб", "унинг исми, насб ўринда"),
 ("Мудоф илайҳ доим мажрур бўлади", "Музофун илайҳ доим жар қилинади"),
 ("Мудофнинг ўз иъроби", "Музофнинг ўз эъроби"),
 ("— маҳаллан мансуб", "— насб ўринда"),
 ("доим марфуъ", "доим раф қилинади"),
 ("муттасил замир (فَكَّرْتُ) ёки яширин олмош", "бориз муттасил замир (فَكَّرْتُ) ёки мустатир замир"),
 ("иъробда ҳурмат учун", "таркибда ҳурмат учун"),
 ("икки мафъул олади", "икки мафъулун биҳ олади"),
 ("мажрур қилади", "жар қилади"),
 ("олмошга уланганда", "замирга уланганда"),
 ("олмош билан фатҳа олади", "замир билан фатҳа олади"),
 ("Жар-мажрур бирор феълга", "Жар ҳарфи ва мажрур бирор феълга"),
 ("Зарф ва жар-мажрур", "Зарф ҳамда жар ҳарфи ва мажрур"),
 ("(мутааллақ)", "(мутааллиқ)"),
 ("соҳиби эса маърифа", "зул ҳол эса маърифа"),
 ("Бир соҳибга", "Битта зул ҳолга"),
 ("маҳаллан мажзум бўлади", "жазм ўринда бўлади"),
 ("шартига мудоф, жавоби билан мансуб", "шартига музоф, жавоби билан насб қилинади"),
 ("фақат أَيُّ муъраб", "фақат أَيُّ мўъроб"),
 ("ҳол, мафъул…", "ҳол, мафъулун биҳ…"),
 ("сила, иъробда ўрни йўқ", "сила, эъробдан унга ўрин йўқ"),
 ("мавсулга қайтувчи олмош", "мавсулга қайтувчи замир"),
 ("мусаннодек муъраб", "тасниядек мўъроб"),
 ("гапда марфуъ ўрнида келади", "гапда раф ўринда келади"),
 ("Мансуб ўрни учун", "Насб ўрни учун"),
 ("Бундай жумла дуоийя дейилади, иъробда ўрни йўқ", "Бундай жумла жумлатун дуоийя дейилади (7-дарс), эъробдан унга ўрин йўқ"),
 ("мансуб бўлади", "насб қилинади"),
 ("Фоил очиқ исм,", "Фоил зоҳир (алоҳида исм),"),
 ("жар-мажрур", "жар ҳарфи ва мажрур"),
]
TITLE = {"MUDRAF": "Музорийнинг рафи", "NASB": "Музорийни насб қилувчи ҳарфлар", "MULHAQ": "Жам музаккар солимга мулҳақ сўзлар",
         "MUTANNA": "Тасния", "MUTLAQ": "Мафъулун мутлақ", "PRON": "Муттасил замирлар", "ZARF": "Зарф (мафъулун фийҳ)",
         "MAFUL": "Мафъулун биҳ", "JARR": "Жар ҳарфлари", "MIM": "Жам мими", "DAMIR": "Мунфасил замирлар", "JMS": "Жам муаннас солим"}
GEN = [("Мудорийни", "Музорийни"), ("мудорийни", "музорийни"), ("мудорисининг", "музорийсининг"), ("Мудори", "Музорий"), ("мудори", "музорий"),
       ("Мудоф", "Музоф"), ("мудоф", "музоф"), ("дамма", "замма"), ("Дамма", "Замма"), ("иъроб", "эъроб"), ("Иъроб", "Эъроб"),
       ("Рафъда", "Рафда"), ("рафъда", "рафда"), ("Рафъ", "Раф"), ("рафъ", "раф"), ("жаррда", "жарда"), ("жарр", "жар"), ("Жарр", "Жар"),
       ("Жамъ", "Жам"), ("жамъ", "жам"), ("муъраб", "мўъроб"), ("афъоли хамса", "амсилатул хомса"), ("Мусанно", "Тасния")]
def fix(s):
    for o, n in SPEC: s = s.replace(o, n)
    for o, n in GEN: s = s.replace(o, n)
    return s
for key, v in QT.items():
    if key in TITLE: v[0] = TITLE[key]
    else: v[0] = fix(v[0])
    v[1] = [fix(x) for x in v[1]]
h = h[:a] + 'var QT=' + jdump(QT) + h[b:]

# ---- QV labels ----
sub1('R:["ُ","ٌ","дамма"]', 'R:["ُ","ٌ","замма"]')

# ---- legend ----
sub1('<span class="pb">● Мафъул биҳ</span>', '<span class="pb">● Мафъулун биҳ</span>')
sub1('<span class="pj">● Жар-мажрур</span>', '<span class="pj">● Жар ва мажрур</span>')

# ---- build: schema labels ----
sub1("""h+='<span data-i="'+i+'-'+j+'"'+(NR[j]!==undefined?' data-n="'+NR[j]+'"':'')+'>'""",
     """var SE=IRB[i+'-'+j];h+='<span data-i="'+i+'-'+j+'"'+(NR[j]!==undefined?' data-n="'+NR[j]+'"':'')+(SE&&SE.s?' data-s="'+SE.s+'"':'')+'>'""")

# ---- irbRows ----
s0 = h.index('function irbRows(k,o,WP,q){'); s1 = h.index('function op(el){')
NEW_IRB = r'''var JN={R:"раф қилинган",N:"насб қилинган",J:"жар қилинган",Z:"жазм қилинган"};
function gtype(k){var p=k.split("-"),L=GT[p[0]];if(!L)return "";for(var i=0;i<L.length;i++)if(+p[1]<=L[i][0])return "Жумлатун "+L[i][1]+".";return ""}
function tline(l){return '<div class="tl">'+(l[0]?'<span class="ar">'+l[0]+'</span> — ':'<span class="tn">↳</span> ')+arw(l[1])+'</div>'}
function mainLine(k){var E=IRB[k];if(!E||!E.k)return "";for(var i=0;i<E.k.length;i++)if(E.k[i][0]&&/қилинган/.test(E.k[i][1]))return tline(E.k[i]);return tline(E.k[0])}
function tgl(b){b.classList.toggle("on");b.nextSibling.classList.toggle("hide")}
function irbRows(k,o,WP,q){
  var E=IRB[k],h="";if(!E)return "";
  h+='<div class="tk"><i>📘 Таркиб</i>'+E.k.map(tline).join("");
  if(E.y)h+='<div class="ny">⚠️ '+arw(E.y)+'</div>';
  var g=gtype(k);if(g)h+='<div class="jt">'+g+'</div>';
  h+='</div>';
  var x="";(E.x||[]).forEach(function(s){x+='<div class="xi">'+arw(s)+'</div>'});
  if(E.a){var a="";E.a.forEach(function(p){a+='<div>'+(p[0]?'<b>'+p[0]+':</b> ':'')+p[1]+'</div>'});x+='<div class="irb"><i>Арабча эъроб</i>'+a+'</div>'}
  if(x)h+='<button class="qmb tb" onclick="tgl(this)">💡 Тушунтириш</button><div class="qmx hide">'+x+'</div>';
  if(!q&&QMP[k]){var m='';QMP[k].forEach(function(t){var T=QT[t];m+='<div class="qmt"><b>'+arw(T[0])+'</b><ul>'+T[1].map(function(s){return '<li>'+arw(s)+'</li>'}).join('')+'</ul></div>'});
    h+='<button class="qmb" onclick="tgl(this)">📖 Қўшимча маълумот</button><div class="qmx hide"><div class="qmn">Ҳужжатда йўқ — умумий наҳв китобларидан</div>'+m+'</div>'}
  return h;
}
'''
h = h[:s0] + NEW_IRB + h[s1:]

# ---- op ----
s0 = h.index('function op(el){'); s1 = h.index('function cl(e){')
NEW_OP = r'''function op(el){
  var k=el.getAttribute("data-i"),q=k.split("-");hl(+q[0],[+q[1]]);
  var o=get(k),E=IRB[k]||{},j=E.j||"";
  var ir=irb(k),WP=wparts(o),mbn=!j||!!E.q,h='<div class="big">'+(WP?wshow(o,mbn?{pre:"",mid:""}:ir,WP):(mbn?o.v:ir.pre+'<b>'+ir.mid+'</b>'+ir.post))+'</div>';
  h=h.replace('<b>','<b class="c'+j+'">');
  if(o.mn)h+='<div class="mnl">'+o.mn+'</div>';
  h+='<div class="hk"><span class="c'+(j||'M')+'">● '+(j?JN[j]+(E.q?' · аломати тақдирий':''):'мабний')+'</span></div>';
  h+=irbRows(k,o,WP,false);
  h+='<button class="x" onclick="document.getElementById(\'sh\').classList.remove(\'on\')">Ёпиш</button>';
  document.getElementById("sb").innerHTML=h;
  document.getElementById("sh").classList.add("on");
}
'''
h = h[:s0] + NEW_OP + h[s1:]

# ---- quiz feedback / results ----
sub1("""if(!am&&IRB[k]&&IRB[k].h)h+='<div class="xul">'+xl(o,IRB[k].h,'.')+'</div>';""",
     """if(!am){var ml=mainLine(k);if(ml)h+='<div class="xul">'+ml+'</div>'}""")
sub1("""<b>Таъсир қилган сўз:</b>""", """<b>Боғлиқ сўз:</b>""")
sub1("""<div>'+(am?am[1]:arw(IRB[k]?IRB[k].r:(o.role||o.ty)))+'</div>""", """<div>'+(am?arw(am[1]):mainLine(k))+'</div>""")

# ---- CSS ----
CSS = r'''
:root{--cR:#1d4ed8;--cN:#b91c1c;--cJ:#15803d;--cZ:#7e22ce}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--cR:#93c5fd;--cN:#fca5a5;--cJ:#86efac;--cZ:#d8b4fe}}
:root[data-theme="dark"]{--cR:#93c5fd;--cN:#fca5a5;--cJ:#86efac;--cZ:#d8b4fe}
.big b.cR,.hk .cR{color:var(--cR)}.big b.cN,.hk .cN{color:var(--cN)}.big b.cJ,.hk .cJ{color:var(--cJ)}.big b.cZ,.hk .cZ{color:var(--cZ)}.hk .cM{color:var(--mu)}
.mnl{text-align:center;color:var(--mu);font-size:15px;margin:-6px 0 6px}
.hk{text-align:center;margin:0 0 8px}.hk span{display:inline-block;font-size:13px;font-weight:600;padding:2px 12px;border-radius:999px;background:rgba(127,127,127,.12)}
.tk{background:rgba(127,127,127,.06);border:1px solid var(--bd);border-radius:12px;padding:8px 12px;margin-top:4px}
.tk>i{display:block;font-style:normal;color:var(--mu);font-size:12px;margin-bottom:2px}
.tl{font-size:15px;line-height:1.55;padding:6px 0}.tl+.tl{border-top:1px dashed var(--bd)}
.tl .ar,.ny .ar,.xi .ar,.xul .tl .ar{font-size:1.25em;line-height:1.3;unicode-bidi:isolate;direction:rtl}
.tl>.ar:first-child{color:var(--ac);font-weight:700;font-size:1.35em}
.tn{color:var(--mu)}
.ny{font-size:13px;color:var(--mu);margin-top:6px;padding-top:6px;border-top:1px solid var(--bd);line-height:1.5}
.jt{margin-top:6px;padding-top:6px;border-top:1px solid var(--bd);font-weight:600;color:var(--ac)}
.xi{padding:4px 0;font-size:15px;line-height:1.55}.xi+.xi{border-top:1px dashed var(--bd)}
.xul .tl{padding:0;font-weight:600}
#tx.tartib .ws span[data-s]{text-align:center}
#tx.tartib .ws span[data-s]::after{content:attr(data-s);display:block;font:600 10.5px system-ui,-apple-system,sans-serif;color:var(--mu);line-height:1.2;white-space:nowrap;direction:ltr;unicode-bidi:isolate;margin:-3px 0 5px}
'''
i = h.index('</style>\n</head>')
h = h[:i] + CSS + h[i:]

open(P, 'w', encoding='utf-8').write(h)
print('ok', len(h))
