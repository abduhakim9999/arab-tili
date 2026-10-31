# -*- coding: utf-8 -*-
import json, re, base64, os
HERE = os.path.dirname(os.path.abspath(__file__))
D71 = os.path.join(HERE, '..', 'd71')
exec(open(os.path.join(D71, 'data71.py'), encoding='utf-8').read())
exec(open(os.path.join(HERE, 'data06.py'), encoding='utf-8').read())
exec(open(os.path.join(HERE, 'voc06.py'), encoding='utf-8').read())


SRC = '/mnt/user-data/outputs/lesson71/index.html'
OUTD = '/mnt/user-data/outputs/lesson06'
os.makedirs(OUTD, exist_ok=True)
s = open(SRC, encoding='utf-8').read()
ALIGN = os.environ.get('ALIGN', '/home/claude/arab-tili/align/out/c06.align.json')
CUT = 0
WSKIP = 0
SILENT = {0}

def J(x):
    return json.dumps(x, ensure_ascii=False)

def rep_json(s, name, val):
    key = 'var ' + name + '='
    i = s.find(key)
    assert i >= 0 and s.count(key) == 1, name
    st = i + len(key)
    obj, end = json.JSONDecoder().raw_decode(s, st)
    return s[:st] + J(val) + s[end:]

def get_json(s, name):
    i = s.find('var ' + name + '=')
    return json.JSONDecoder().raw_decode(s, i + len(name) + 5)[0]

# ---- tekshiruv: TR har so'zni qamrab oladi ----
for li, (sp, ws, tr) in enumerate(L):
    cov = sorted(x for t in tr for x in t[1])
    assert cov == list(range(len(ws))), (li, cov, len(ws))

# ---- D ----
def wstr(w):
    for f in ('v', 'ty', 'r', 'mn'):
        assert not re.search(r'[/|`]', w[f]), (f, w[f])
    return w['v'] + ('~' + w['pu'] if w['pu'] else '') + '|' + w['c'] + '|[[' + w['ty'] + ']]. ' + w['r'] + '|' + w['mn']

Dtxt = 'var D=[\n' + ',\n'.join('[' + J(sp) + ',`' + '/'.join(wstr(w) for w in ws) + '`]' for sp, ws, tr in L) + '\n];\n'
i = s.find('var D=[\n'); j = s.find('\n];\n', i) + 4
s = s[:i] + Dtxt + s[j:]
s = rep_json(s, 'TR', [tr for sp, ws, tr in L])

IRB = {}
for li, (sp, ws, tr) in enumerate(L):
    for wi, w in enumerate(ws):
        e = {'k': [list(x) for x in w['k']], 's': w['s'], 'j': w['j'], 'a': w['a']}
        if w['q']: e['q'] = 1
        if w['o']: e['o'] = w['o']
        if w['x']: e['x'] = w['x']
        IRB['%d-%d' % (li, wi)] = e
exec(open(os.path.join(HERE, 'jm06.py'), encoding='utf-8').read())
apply_jm(IRB)
s = rep_json(s, 'IRB', IRB)
# ЖУМЛА bloki: tarkib ichida, so'zlardan keyin
_o = 'h+=\'<div class="tk"><i>📘 Таркиб</i>\'+E.k.map(tline).join("");'
assert s.count(_o) == 1
s = s.replace(_o, _o + 'if(E.jm)h+=\'<div class="jmb"><b>ЖУМЛА</b>\'+String(E.jm).replace(/[\\u0600-\\u06FF]+(?:[\\s\\u060C…]+[\\u0600-\\u06FF]+)*/g,function(m){return \'<bdi class="ar">\'+m+\'</bdi>\'})+\'</div>\';')
_c = '.jt{'
assert s.count(_c) == 1
s = s.replace(_c, '.jmb{margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(29,120,80,.08);border-left:3px solid var(--ac);font-size:15px;line-height:1.6}.jmb b{display:block;font-size:11px;letter-spacing:.08em;color:var(--ac);margin-bottom:2px}.jmb .ar{font-size:19px}\n' + _c)

s = rep_json(s, 'OVK', {})

GT = {
 '1': [[1, 'дуоийя']], '2': [[1, 'дуоийя']], '3': [[1, 'хабарийя'], [3, 'хабарийя']], '4': [[1, 'дуоийя']],
 '5': [[1, 'хабарийя'], [3, 'хабарийя']], '6': [[1, 'дуоийя']], '7': [[1, 'дуоийя']], '8': [[1, 'дуоийя']],
}
s = rep_json(s, 'GT', GT)

qt = get_json(s, 'QT')
qt.update({
 'LANAFI': ['Зотни инкор қилувчи لَا', [
   'لَا النَّافِيَةُ لِلْجِنْسِ — бир турдаги нарсанинг умуман йўқлигини билдиради: لَا بُدَّ — «чора йўқ».',
   'إِنَّ каби амал қилади: исмини насб, хабарини раф қилади.',
   'Исми мудоф бўлмаса, фатҳага мабний бўлиб, насб ўринда туради: لَا بُدَّ.',
   'Хабари кўпинча ҳазф қилинади: لَا بُدَّ مِنَ الْحِمْيَةِ — مِنَ الْحِمْيَةِ маҳзуф хабарга (مَوْجُودٌ) мутааллиқ.',
   'لَا بُدَّ مِنْ … — «… зарур, … шарт».']],
 'ANNA': ['أَنَّ ва масдар', [
   'أَنَّ — إِنَّ нинг синглиси: исмини насб, хабарини раф қилади.',
   'أَنَّ ўз исми ва хабари билан бирга масдар ўрнида туради: أَعْتَقِدُ أَنَّكَ لَمْ تَتَّبِعِ الْحِمْيَةَ = أَعْتَقِدُ عَدَمَ اتِّبَاعِكَ الْحِمْيَةَ.',
   'Гап ўртасида келади (أَنَّ), гап бошида ва قَالَ дан кейин — إِنَّ.',
   'Хабари жумла бўлиши мумкин: لَمْ تَتَّبِعْ … — раф ўринда.']],
 'JAZMK': ['Жазм ва 2 сукун', [
   'لَمْ мудори феълни жазм қилади; жазм аломати — сукун: لَمْ تَتَّبِعْ.',
   'Кейинги сўз ال билан бошланса, 2 сукун йўлиқмаслиги учун сукун касрага алмашади: لَمْ تَتَّبِعِ الْحِمْيَةَ، لَمْ تُمَارِسِ الرِّيَاضَةَ.',
   'Бу касра эъроб аломати эмас — феъл барибир мажзум.',
   'Ўртаси иллатли феълда иллат ҳарфи тушади: أَسْتَطِيعُ → لَمْ أَسْتَطِعْ.',
   'Амр феълида ҳам шундай: اتَّبِعْ → اتَّبِعِ الْحِمْيَةَ.']],
 'MUQ': ['Муқаддар замма', [
   'Охири ي бўлган мудори феълда (يَكْفِي، يَمْشِي) раф аломати — ي даги муқаддар (кўринмас) замма, чунки ي да замма оғир.',
   'Насбда фатҳа кўринади: لَنْ يَكْفِيَ.',
   'Жазмда ي тушади: لَمْ يَكْفِ.']],
 'WAHD': ['وَحْدَ', [
   'وَحْدَ — «ёлғиз, бир ўзи» маъносидаги исм; доим насб қилинади ва олмошга музоф бўлади: وَحْدَهُ، وَحْدَكَ، وَحْدِي.',
   'Гапда ҳол бўлади: اَلدَّوَاءُ وَحْدَهُ لَا يَكْفِي — «дорининг ўзи (ёлғиз) кифоя қилмайди».']],
 'NIDA': ['Нидо (мунодо)', [
   'يَا — нидо ҳарфи («эй»).',
   'Мунодо алам ёки аниқ шахсга қаратилган накра бўлса, танвинсиз заммага мабний, насб ўринда: يَا دُكْتُورُ، يَا مُحَمَّدُ.',
   'Мунодо мудоф бўлса, насб қилинади: يَا طَالِبَ الْعِلْمِ.']],
 'WIQ': ['Виқоя нуни', [
   'Мутакаллим ي си феълга уланганда, феъл охири касрадан сақланиши учун орага نِ қўшилади: قَابِلْنِي، يُقَابِلُنِي.',
   'Бу نِ — ҳарф, эъробдан ўрни йўқ; ي — мафъулун биҳ, насб ўринда.']],
})
qt.update({
 'FASL': ['Фасл замири', ['Мубтадо ва ال ли хабар орасида келган мунфасил замир (هُوَ، هِيَ، هُمْ …) хабарни сифатдан ажратади ва таъкидлайди: الْإِنْسَانُ السَّمِينُ هُوَ الصَّحِيحُ.', 'Эъробдан ўрни йўқ; таржимада «… саналади, айнан …» маъносини беради.']],
 'NAHY': ['Наҳий لَا си', ['لَا النَّاهِيَةُ — тақиқ ҳарфи, мудори феълни жазм қилади: لَا تَأْكُلْ «ема».', 'Нафий لَا сидан фарқи: لَا تَأْكُلُ (раф) — «емайсан»; لَا تَأْكُلْ (жазм) — «ема!».', 'Кейинги сўз ال билан бошланса, сукун касрага алмашади: لَا تَأْكُلِ الْخُبْزَ.', 'Афъоли хамсада жазм аломати — ن нинг тушиши: تُسْرِفُونَ → لَا تُسْرِفُوا.']],
 'ZAID': ['Зоида بِ', ['بِ баъзан таъкид учун ортиқча (зоида) келади: بِحَسْبِ ابْنِ آدَمَ = حَسْبُ ابْنِ آدَمَ.', 'Ундан кейинги сўз лафзан мажрур бўлади, лекин гапдаги ўрни бўйича (маҳаллан) марфуъ ёки мансуб.']],
 'JMSM': ['Жамъ музаккар солим', ['Рафда و: الْمُسْرِفُونَ؛ насб ва жарда ي: الْمُسْرِفِينَ، قَائِلِينَ.', 'Охиридаги ن фатҳали бўлиб, бирликдаги танвин ўрнига келади.']],
})
s = rep_json(s, 'QT', qt)

def topics(li, wi, w):
    t = []
    txt = w['ty'] + ' ' + w['r'] + ' ' + ' '.join(x[1] for x in w['k'])
    v = w['v']
    if 'ноқис' in txt or 'нинг исми' in w['r'] or w['s'] in ('исми', 'хабари'): t.append('SHURU' if 'бошлаш' in txt else 'KANA')
    if 'фасл' in txt: t.append('FASL')
    if 'наҳий' in txt: t.append('NAHY')
    if 'зоида' in txt: t.append('ZAID')
    if 'жамъ музаккар солим' in txt: t.append('JMSM')
    if 'афъоли хамса' in txt: t.append('AF5')
    if 'ғайри мунсариф' in txt: t.append('GHAYR')
    if 'зотни' in txt or (w['s'] == 'исми' and v == 'بُدَّ'): t.append('LANAFI')
    if 'أَنَّ' in v: t.append('ANNA')
    if '2 сукун' in txt and w['c'] == 'Z': t.append('JAZMK')
    if w['c'] == 'Z' or v == 'لَمْ': t.append('JAZM' if 'JAZM' in qt else 'JAZMK')
    if 'амр' in txt: t += ['AMR'] + (['JAZMK'] if '2 сукун' in txt else [])
    if 'виқоя' in txt: t.append('WIQ')
    if 'муқаддар замма' in txt: t.append('MUQ')
    if v == 'وَحْدَهُ': t += ['WAHD', 'HAL']
    if w['s'] == 'мунодо' or v == 'يَا': t.append('NIDA')
    if 'шарт' in txt and v in ('إِنْ', 'شَاءَ'): t.append('SHART')
    if 'дуо' in txt: t.append('DUA')
    if 'мавсул' in txt: t.append('MAWSUL')
    if 'мозий' in txt and ('تُ' in [x[0] for x in w['k']] or 'تَ' in [x[0] for x in w['k']]): t.append('MOZI')
    if 'истифҳом' in w['ty']: t.append('ISTIF')
    if 'ишора' in w['ty']: t.append('ISHARA')
    if 'мунфасил' in txt: t.append('DAMIR')
    if w['s'] == 'зарф': t.append('ZARF')
    if 'тамйиз' in txt: t += ['TAMYIZ']
    if 'мутлақ' in txt: t.append('MUTLAQ')
    if 'маътуф' in w['s']: t.append('ATF')
    if w['s'] in ('мубтадо', 'хабар', 'ҳарф + мубтадо'): t.append('MUBXAB')
    if w['s'] == 'фоил': t.append('FAIL')
    if w['s'] == 'маф.биҳ': t.append('MAFUL')
    if w['s'] in ('жар ҳарфи', 'мажрур'): t.append('JARR')
    if 'муз.илайҳ' in w['s'] or 'музофун илайҳ' in txt: t.append('IDAFA')
    if w['s'].endswith('муз.феъли') and w['j'] == 'R': t.append('MUDRAF')
    if w['s'] == 'ҳол': t.append('HAL')
    if 'муттасил замир' in txt and 'PRON' in qt: t.append('PRON')
    out = []
    for x in t:
        if x not in out and x in qt: out.append(x)
    return out[:3]

QMP = {}
for li, (sp, ws, tr) in enumerate(L):
    for wi, w in enumerate(ws):
        tp = topics(li, wi, w)
        if tp: QMP['%d-%d' % (li, wi)] = tp
s = rep_json(s, 'QMP', QMP)
s = rep_json(s, 'CK', [[] for _ in L])

i = s.find('var CATOV='); j = s.find(',CAT={}', i)
CM = {'мубтадо':'m','хабар':'x','муз.феъли':'f','моз.феъли':'f','амр феъли':'f','ҳарф + амр феъли':'f','ҳарф + муз.феъли':'f','ҳарф + моз.феъли':'f',
      'фоил':'o','маф.биҳ':'b','мажрур':'j','ҳарф + мажрур':'j','жар ҳарфи':'>','сифат':'^','муз.илайҳ':'^','ҳарф + маътуф':'^','зарф':'h','ҳол':'h',
      'исми':'m','маф.мутлақ':'-','ҳарф + исми':'m','ҳарф + мубтадо':'m'}
CATOV = {}
for li, (sp, ws, tr) in enumerate(L):
    for wi, w in enumerate(ws):
        if w['s'] in CM: CATOV['%d-%d' % (li, wi)] = CM[w['s']]
s = s[:i] + 'var CATOV=' + J(CATOV) + s[j:]

s = rep_json(s, 'VOC', VOC)
s = rep_json(s, 'HLS', {})

# ---- TM (ElevenLabs Scribe vaqtlari, kesishdan keyin) ----
WT = json.load(open(ALIGN, encoding='utf-8'))
NA_ = sum(len(ws) for _, ws, _ in L)
WT = WT[WSKIP:]
def norm(x):
    x = re.sub(r'[ً-ْٰ.,،؟!?]', '', x)
    return x.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ٱ', 'ا')
pos = [(li, wi) for li, (sp, ws, tr) in enumerate(L) if li not in SILENT for wi in range(len(ws))]
assert len(pos) == len(WT), (len(pos), len(WT))
TM = []
for k, ((li, wi), wd) in enumerate(zip(pos, WT)):
    tv = norm(L[li][1][wi]['v']); av = norm(wd['text'])
    if tv != av: print('farq:', li, wi, tv, av)
    a = wd['start'] - CUT; b = wd['end'] - CUT
    nxt = WT[k + 1]['start'] - CUT if k + 1 < len(WT) else None
    t3 = nxt if (nxt is not None and nxt - b < 0.45) else b
    TM.append([li, wi, round(max(0, a - 0.04), 2), round(t3, 2), round(b, 2)])
s = rep_json(s, 'TM', TM)

# ---- quiz ----
def shift(d, k):
    sh = lambda x: '%d-%s' % (int(x.split('-')[0]) + k, x.split('-')[1])
    return {sh(a): ([sh(v[0])] + v[1:] if isinstance(v, list) and isinstance(v[0], str) and '-' in v[0] and v[0][0].isdigit() else v) for a, v in d.items()}
exec(open(os.path.join(HERE, 'quiz06.py'), encoding='utf-8').read())
s = rep_json(s, 'TRK', TRK)

i = s.find('var QOV='); j = s.find('};', i) + 2
s = s[:i] + 'var QOV=' + J(QOV) + ';' + s[j:]

# ---- sarlavha, audio, kalit ----
assert s.count('71-дарс: Зайнаб ва Марям дугонадир') == 2
s = s.replace('71-дарс: Зайнаб ва Марям дугонадир', '6-дарс: Нада ва Ҳуда')
b64 = base64.b64encode(open(os.path.join(HERE, 'dlg06.mp3'), 'rb').read()).decode()
s, nsub = re.subn(r'src="data:audio/mpeg;base64,[A-Za-z0-9+/=]+"', 'src="data:audio/mpeg;base64,' + b64 + '"', s)
assert nsub == 1, nsub
s = s.replace('ًا', 'اً')
assert s.count('var K="dars71-holat"') == 1
s = s.replace('var K="dars71-holat"', 'var K="dars06-holat"')
open(os.path.join(OUTD, 'index.html'), 'w', encoding='utf-8').write(s)
print('ok', len(s), 'QMP', len(QMP), 'TRK', len(TRK), 'words', sum(len(ws) for _, ws, _ in L))
