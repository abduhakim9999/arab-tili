# -*- coding: utf-8 -*-
import json, os, sys, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from morph import conj, SIGA
import data_b1 as D

LAZIM1 = set('جَلَسَ رَجَعَ نَزَلَ كَذَبَ صَبَرَ عَدَلَ عَجَزَ فَرَّ ضَلَّ تَمَّ صَحَّ قَلَّ خَفَّ وَثَبَ وَقَفَ وَجَبَ سَارَ عَاشَ طَارَ مَالَ غَابَ سَالَ مَشَى جَرَى بَكَى'.split())
KEYS = ['mm', 'mj', 'rm', 'rj', 'foil', 'maful', 'jahd', 'nafy', 'amr', 'ag', 'nahy', 'agj', 'nahyj', 'jahdj', 'nafyj']
from morph import U as _U, A as _A, I as _I
PH = ('1', '2', '3')     # o'zak harflari o'rnida belgi
def tables(r, t, uv):
    T = conj(PH, t, uv=uv); R = conj(tuple(r), t, uv=uv)
    for k in KEYS:   # belgili shakl o'zak qo'yilganda haqiqiy shaklga teng bo'lishi shart
        for x, y in zip(T[k], R[k]):
            assert x.replace('1', r[0]).replace('2', r[1]).replace('3', r[2]) == y, (r, k, x, y)
    return {k: T[k] for k in KEYS}
def plain(f, r): return f.replace('1', r[0]).replace('2', r[1]).replace('3', r[2])

def build_lesson(id, D, uv, lazim, meta):
    models, verbs = [], []
    for m in D.MODELS:
        T = tables(m['r'], m['t'], uv)
        for k in ('zm', 'ol', 'tf'):
            if m.get(k): T[k] = m[k]
        models.append(dict(t=m['t'], tn=D.TYPES[m['t']], r=m['r'], ms=m['ms'], mn=m['mn'], izoh=m['izoh'], T=T))
    oth = [x for x in (_I, _U, _A) if x != uv]
    for v, r, t, ms, mn in D.VERBS:
        T = tables(r, t, uv)
        assert unicodedata.normalize('NFC', plain(T['mm'][0], r)) == unicodedata.normalize('NFC', v), (v, T['mm'][0])
        e = dict(r=r, t=t, tn=D.TYPES[t], ms=ms, mn=mn, l=v in lazim, T=T)
        if t == 'salim':   # mashq uchun noto'g'ri variantlar: boshqa bob harakati
            e['alt'] = [conj(PH, 'salim', uv=x)['rm'][0] for x in oth]
            e['alta'] = [conj(PH, 'salim', uv=x)['amr'][0] for x in oth]
        verbs.append(e)
    return dict(id=id, rule=D.RULE, models=models, verbs=verbs, **meta)

import data_b2 as D2
LESSONS = [
 build_lesson('b1', D, _I, LAZIM1, dict(n='1-боб', ar='فَعَلَ – يَفْعِلُ', m='ضَرَبَ – يَضْرِبُ', uz='Сулосий мужаррад · мозийда фатҳа, музореъда касра',
      qmu='1-бобда музореънинг «айн»и касрали', qamr='Музореъда «айн» касрали бўлгани учун амрнинг ҳамзаси ҳам касрали')),
 build_lesson('b2', D2, _U, D2.LAZIM, dict(n='2-боб', ar='فَعَلَ – يَفْعُلُ', m='نَصَرَ – يَنْصُرُ', uz='Сулосий мужаррад · мозийда фатҳа, музореъда замма',
      qmu='2-бобда музореънинг «айн»и заммали', qamr='Музореъда «айн» заммали бўлгани учун амрнинг ҳамзаси ҳам заммали')),
]
PLAN = [  # keyingi darslar (hali yopiq)
 ['Сулосий мужаррад', [['3-боб', 'فَعَلَ – يَفْعَلُ', 'فَتَحَ – يَفْتَحُ'],
                       ['4-боб', 'فَعِلَ – يَفْعَلُ', 'سَمِعَ – يَسْمَعُ'], ['5-боб', 'فَعِلَ – يَفْعِلُ', 'حَسِبَ – يَحْسِبُ'],
                       ['6-боб', 'فَعُلَ – يَفْعُلُ', 'كَرُمَ – يَكْرُمُ']]],
 ['Сулосий мазийд', [['12 боб', 'أَفْعَلَ، فَعَّلَ، فَاعَلَ …', '']]],
 ['Рубоъий мужаррад ва мазийд', [['4 боб', 'فَعْلَلَ، تَفَعْلَلَ …', '']]],
]
AUD = json.load(open(os.path.join(HERE, 'audio.json'))) if os.path.exists(os.path.join(HERE, 'audio.json')) else {}
import shutil
_od = os.path.dirname(sys.argv[1]) if len(sys.argv) > 1 else '/home/claude/arab-tili'
for L in LESSONS:
  for kind, arr in (('m', L['models']), ('v', L['verbs'])):
    for i, x in enumerate(arr):
        a = AUD.get(L['id'] + '/' + kind + str(i))
        if a:
            x['au'] = a
            src = '/home/claude/arab-tili/align/out/' + a['f'][5:]
            if os.path.exists(src) and not os.path.exists(os.path.join(_od, a['f'])): shutil.copy(src, os.path.join(_od, a['f']))
DATA = dict(siga=[list(s) for s in SIGA], lessons=LESSONS, plan=PLAN)
# darslardan bog'lash uchun indeks: harakatsiz shakl -> sahifa manzili
import re
def bare(s): return re.sub('[\u064B-\u0652\u0670\u0640]', '', s).replace('أ','ا').replace('إ','ا').replace('آ','ا').replace('ى','ي').replace('ة','ه')
IDX = {}
for L in LESSONS:
    for kind, arr in (('m', L['models']), ('v', L['verbs'])):
        for i, x in enumerate(arr):
            for k in KEYS:
                for f in x['T'][k]:
                    if ' ' in f: continue
                    IDX.setdefault(bare(plain(f, x['r'])), L['id'] + '/' + kind + str(i))
json.dump(IDX, open(os.path.join(os.path.dirname(sys.argv[1]) if len(sys.argv) > 1 else '/home/claude/arab-tili', 'sarf-idx.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
tpl = open(os.path.join(HERE, 'sarf.tpl.html'), encoding='utf-8').read()
out = tpl.replace('__DATA__', unicodedata.normalize('NFC', json.dumps(DATA, ensure_ascii=False, separators=(',', ':'))))
dst = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/arab-tili/sarf.html'
open(dst, 'w', encoding='utf-8').write(out)
print('ok', dst, len(out), [len(L['verbs']) for L in LESSONS])
