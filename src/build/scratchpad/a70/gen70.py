import sys, json, re, base64, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import d70

SRC = '/mnt/user-data/outputs/lesson92/index.html'
OUT = '/mnt/user-data/outputs/lesson70/index.html'
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(SRC, encoding='utf-8').read()

def J(o):
    return json.dumps(o, ensure_ascii=False)

def rep_var(s, name, new, end_marker):
    """replace 'var NAME=...' up to (not incl.) end_marker"""
    i = s.find('var %s=' % name)
    assert i >= 0, name
    j = s.find(end_marker, i)
    assert j > i, (name, end_marker)
    return s[:i] + new + s[j:]

def one(s, a, b):
    assert s.count(a) == 1, (a[:60], s.count(a))
    return s.replace(a, b)

# ---------- title / header ----------
TITLE = '70-дарс: Асалда шифо'
s = s.replace('92-дарс: Ишлаш учун четга кетиш', TITLE)
s = one(s, '<span class="pm">● Мубтадо, إِنَّ исми</span>', '<span class="pm">● Мубтадо</span>')

# ---------- audio ----------
a = s.find('data:audio/mpeg;base64,') + len('data:audio/mpeg;base64,')
b = s.find('"', a)
mp3 = base64.b64encode(open(os.path.join(HERE, 'dars70.mp3'), 'rb').read()).decode()
s = s[:a] + mp3 + s[b:]

# ---------- D ----------
lines = []
for sp, ws in d70.L:
    parts = []
    for w in ws:
        v, c, ty, role, mn = w
        for f in w:
            assert not any(ch in f for ch in '/|`'), f
        parts.append('%s|%s|[[%s]]. %s|%s' % (v, c, ty, role, mn))
    lines.append('[%s,`%s`]' % (J(sp), '/'.join(parts)))
s = rep_var(s, 'D', 'var D=[\n' + ',\n'.join(lines) + '\n];', '\nvar TR=')
s = rep_var(s, 'TR', 'var TR=' + J(d70.TR) + ';', '\nvar T=')
s = rep_var(s, 'OVK', 'var OVK={};', '\n')
s = rep_var(s, 'IRB', 'var IRB=' + J(d70.N) + ';', '\nvar GT=')
s = rep_var(s, 'GT', 'var GT=' + J({str(k): v for k, v in d70.GT.items()}) + ';', '\nvar QT=')

# QT: 92 dagi umumiy qoidalar + 70 uchun yangilari
i = s.find('var QT=') + 7
j = s.find('\n', i)
QT = json.loads(s[i:j].rstrip(';'))
QT.update(d70.QT_NEW)
# الْآنَ — kitobda (65-dars) mu'rab: mabniylar ro'yxatidan olib tashlanadi
z = QT['ZARF'][1]
for n, t in enumerate(z):
    if 'هُنَا، هُنَاكَ، إِذَا، الْآنَ، حَيْثُ' in t:
        z[n] = t.replace('هُنَا، هُنَاكَ، إِذَا، الْآنَ، حَيْثُ', 'هُنَا، هُنَاكَ، إِذَا، حَيْثُ')
need = set(x for v in d70.QMP.values() for x in v)
assert need <= set(QT), need - set(QT)
QT = {k: QT[k] for k in QT if k in need}
s = s[:i - 7] + 'var QT=' + J(QT) + ';' + s[j:]
s = rep_var(s, 'QMP', 'var QMP=' + J(d70.QMP) + ';', '\n')
s = rep_var(s, 'CK', 'var CK=' + J([[] for _ in d70.L]) + ';', '\n')
s = rep_var(s, 'CATOV', 'var CATOV=' + J({"1-1": "x"}) + ',CAT={},bolak=false;', '\n')
# maf'ul mutlaq (va uning sifati) — rangsiz, keyingi so'zlar undan meros oladi
s = one(s, 'if(/[Фф]еъл/.test(ty))return "f";', 'if(/[Фф]еъл/.test(ty))return "f";\n  if(/[Мм]афъул мутлақ/.test(r))return "-";')
s = rep_var(s, 'VOC', 'var VOC=' + J(d70.VOC) + ';', '\n')
s = rep_var(s, 'HLS', 'var HLS={};', '\n')
s = rep_var(s, 'TRK', 'var TRK=' + J(d70.TRK) + ';', '\n')
s = rep_var(s, 'QUR', 'var QUR=' + J({k: 1 for k in d70.QUR}) + ';', '\n')
QOV = dict(d70.QOV)
def tri(a, b, c):
    return [{"w": a, "c": "R"}, {"w": b, "c": "N"}, {"w": c, "c": "J"}]
QOV["5-7"] = tri("أَيُّ", "أَيَّ", "أَيِّ")
QOV["15-4"] = tri("الصَّحَابِيُّ", "الصَّحَابِيَّ", "الصَّحَابِيِّ")
QOV["16-6"] = tri("الْمَرْكَزِيُّ", "الْمَرْكَزِيَّ", "الْمَرْكَزِيِّ")
QOV["10-3"] = [{"w": "يَسْقِيهِ", "c": "R", "lb": "ي — раф (тақдирий)"},
               {"w": "يَسْقِيَهُ", "c": "N", "lb": "يَ — насб"},
               {"w": "يَسْقِهِ", "c": "Z", "lb": "ي тушади — жазм"}]
s = rep_var(s, 'QOV', 'var QOV=' + J(QOV) + ';', '\n')

# ---------- TM ----------
W = json.load(open(os.path.join(HERE, 'scribe_words.json'), encoding='utf-8'))
# (line, word) -> scribe word index (faqat matn bilan bir xil o'qilgan so'zlar)
MAP = {}
def seq(line, words, sidx):
    for w, k in zip(words, sidx):
        MAP[(line, w)] = k
seq(2, [0, 1], [0, 1])
seq(3, range(6), range(2, 8))
seq(4, range(4), range(8, 12))
seq(5, range(9), range(12, 21))
seq(6, range(7), range(21, 28))
seq(7, range(4), range(37, 41))
seq(10, [0, 2, 3, 4], [42, 50, 51, 52])
seq(11, [1], [53])
seq(12, [0, 1, 2, 3, 5], [54, 55, 56, 57, 59])
seq(13, range(3), range(60, 63))
seq(14, range(7), range(63, 70))
seq(15, range(5), range(70, 75))
seq(16, range(7), [75, 76, 78, 79, 80, 81, 82])
seq(17, range(6), range(83, 89))
seq(18, range(2), range(89, 91))
EXT = {(6, 6): 31}  # الرَّسُولُ ﷺ — ﷺ o'qilishi ham shu so'zga
keys = sorted(MAP)
TM = []
for n, (l, w) in enumerate(keys):
    k = MAP[(l, w)]
    st = W[k]['start']
    en = W[EXT.get((l, w), k)]['end']
    stop = en
    if n + 1 < len(keys):
        l2, w2 = keys[n + 1]
        k2 = MAP[(l2, w2)]
        if l2 == l and k2 == EXT.get((l, w), k) + 1:
            en = W[k2]['start']
    TM.append([l, w, round(st, 2), round(en, 2), round(stop, 2)])
i = s.find('var TM=[')
j = s.find(']],au=', i) + 2
assert i > 0 and j > i
s = s[:i] + 'var TM=' + J(TM) + s[j:]

# ---------- shamsiy lom: لِلنَّاسِ -> لِ + النَّاسِ ----------
s = one(s, "if(/^لْ/.test(t)&&r.s>0)x='ا'+x;",
        "if((/^لْ/.test(t)||/^ل[\\u0621-\\u064A][\\u064B-\\u0650\\u0652]*\\u0651/.test(t))&&r.s>0)x='ا'+x;")

# quizda audiosi yo'q so'z uchun «Тинглаш» tugmasi chiqmaydi
s = one(s, "<button onclick=\"pw('+q.l+','+q.w+')\">🔊 Тинглаш</button>",
        "'+(hasTM(q.l,q.w)?'<button onclick=\"pw('+q.l+','+q.w+')\">🔊 Тинглаш</button>':'')+'")
s = one(s, "function pick(t){", "function hasTM(l,w){for(var k=0;k<TM.length;k++)if(TM[k][0]==l&&TM[k][1]==w)return true;return false}\nfunction pick(t){")

# ---------- localStorage ----------
s = one(s, 'var K="dars92-holat"', 'var K="dars70-holat"')

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(s)
print('ok', len(s), 'TM', len(TM))
