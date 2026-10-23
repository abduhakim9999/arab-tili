# -*- coding: utf-8 -*-
import json, os, sys, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from morph import conj, SIGA
import data_b1 as D

LAZIM = set('جَلَسَ رَجَعَ نَزَلَ كَذَبَ صَبَرَ عَدَلَ عَجَزَ فَرَّ ضَلَّ تَمَّ صَحَّ قَلَّ خَفَّ وَثَبَ وَقَفَ وَجَبَ سَارَ عَاشَ طَارَ مَالَ غَابَ سَالَ مَشَى جَرَى بَكَى'.split())
KEYS = ['mm', 'mj', 'rm', 'rj', 'foil', 'maful', 'jahd', 'nafy', 'amr', 'ag', 'nahy', 'agj', 'nahyj']

PH = ('1', '2', '3')     # o'zak harflari o'rnida belgi (sahifada rang bilan ko'rsatiladi)
def tables(r, t):
    T = conj(PH, t); R = conj(tuple(r), t)
    for k in KEYS:   # belgili shakl o'zak qo'yilganda haqiqiy shaklga teng bo'lishi shart
        for x, y in zip(T[k], R[k]):
            assert x.replace('1', r[0]).replace('2', r[1]).replace('3', r[2]) == y, (r, k, x, y)
    return {k: T[k] for k in KEYS}
def plain(f, r): return f.replace('1', r[0]).replace('2', r[1]).replace('3', r[2])

models = []
for m in D.MODELS:
    T = tables(m['r'], m['t'])
    T.update(zm=m['zm'], ol=m['ol'], tf=m['tf'])
    models.append(dict(t=m['t'], tn=D.TYPES[m['t']], r=m['r'], ms=m['ms'], mn=m['mn'], izoh=m['izoh'], T=T))
verbs = []
for v, r, t, ms, mn in D.VERBS:
    T = tables(r, t)
    assert unicodedata.normalize('NFC', plain(T['mm'][0], r)) == unicodedata.normalize('NFC', v), (v, T['mm'][0])
    e = dict(r=r, t=t, tn=D.TYPES[t], ms=ms, mn=mn, l=v in LAZIM, T=T)
    if t == 'salim':   # mashq uchun noto'g'ri variantlar: boshqa bob harakati
        from morph import U as _U, A as _A
        e['alt'] = [conj(PH, 'salim', uv=_U)['rm'][0], conj(PH, 'salim', uv=_A)['rm'][0]]
        e['alta'] = [conj(PH, 'salim', uv=_U)['amr'][0], conj(PH, 'salim', uv=_A)['amr'][0]]
    verbs.append(e)

LESSONS = [
 dict(id='b1', n='1-боб', ar='فَعَلَ – يَفْعِلُ', m='ضَرَبَ – يَضْرِبُ', uz='Сулосий мужаррад · мозийда фатҳа, музореъда касра',
      rule=D.RULE, models=models, verbs=verbs),
]
PLAN = [  # keyingi darslar (hali yopiq)
 ['Сулосий мужаррад', [['2-боб', 'فَعَلَ – يَفْعُلُ', 'نَصَرَ – يَنْصُرُ'], ['3-боб', 'فَعَلَ – يَفْعَلُ', 'فَتَحَ – يَفْتَحُ'],
                       ['4-боб', 'فَعِلَ – يَفْعَلُ', 'سَمِعَ – يَسْمَعُ'], ['5-боб', 'فَعِلَ – يَفْعِلُ', 'حَسِبَ – يَحْسِبُ'],
                       ['6-боб', 'فَعُلَ – يَفْعُلُ', 'كَرُمَ – يَكْرُمُ']]],
 ['Сулосий мазийд', [['12 боб', 'أَفْعَلَ، فَعَّلَ، فَاعَلَ …', '']]],
 ['Рубоъий мужаррад ва мазийд', [['4 боб', 'فَعْلَلَ، تَفَعْلَلَ …', '']]],
]
AUD = json.load(open(os.path.join(HERE, 'audio.json'))) if os.path.exists(os.path.join(HERE, 'audio.json')) else {}
for x in models + verbs:
    a = AUD.get(x['r'] + ':' + x['t'])
    if a: x['au'] = a
DATA = dict(siga=[list(s) for s in SIGA], lessons=LESSONS, plan=PLAN, audio=AUD.get('_file'))
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
print('ok', dst, len(out), 'verbs', len(verbs))
