# -*- coding: utf-8 -*-
import json, os, sys, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from morph import conj, SIGA
import data_b1 as D

LAZIM = set('جَلَسَ رَجَعَ نَزَلَ كَذَبَ صَبَرَ عَدَلَ عَجَزَ فَرَّ ضَلَّ تَمَّ صَحَّ قَلَّ خَفَّ وَثَبَ وَقَفَ وَجَبَ سَارَ عَاشَ طَارَ مَالَ غَابَ سَالَ مَشَى جَرَى بَكَى'.split())
KEYS = ['mm', 'mj', 'rm', 'rj', 'foil', 'maful', 'jahd', 'nafy', 'amr', 'ag', 'nahy', 'agj', 'nahyj']

def tables(r, t):
    T = conj(tuple(r), t)
    return {k: T[k] for k in KEYS}

models = []
for m in D.MODELS:
    T = tables(m['r'], m['t'])
    T.update(zm=m['zm'], ol=m['ol'], tf=m['tf'])
    models.append(dict(t=m['t'], tn=D.TYPES[m['t']], v=T['mm'][0], mu=T['rm'][0], ms=m['ms'], mn=m['mn'], izoh=m['izoh'], T=T))
verbs = []
for v, r, t, ms, mn in D.VERBS:
    T = tables(r, t)
    assert unicodedata.normalize('NFC', T['mm'][0]) == unicodedata.normalize('NFC', v), (v, T['mm'][0])
    e = dict(v=v, t=t, tn=D.TYPES[t], mu=T['rm'][0], ms=ms, mn=mn, l=v in LAZIM, T=T)
    if t == 'salim':   # mashq uchun noto'g'ri variantlar: boshqa bob harakati
        from morph import U as _U, A as _A
        e['alt'] = [conj(tuple(r), 'salim', uv=_U)['rm'][0], conj(tuple(r), 'salim', uv=_A)['rm'][0]]
        e['alta'] = [conj(tuple(r), 'salim', uv=_U)['amr'][0], conj(tuple(r), 'salim', uv=_A)['amr'][0]]
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
DATA = dict(siga=[list(s) for s in SIGA], lessons=LESSONS, plan=PLAN)
tpl = open(os.path.join(HERE, 'sarf.tpl.html'), encoding='utf-8').read()
out = tpl.replace('__DATA__', unicodedata.normalize('NFC', json.dumps(DATA, ensure_ascii=False, separators=(',', ':'))))
dst = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/arab-tili/sarf.html'
open(dst, 'w', encoding='utf-8').write(out)
print('ok', dst, len(out), 'verbs', len(verbs))
