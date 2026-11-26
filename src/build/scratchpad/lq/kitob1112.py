# -*- coding: utf-8 -*-
"""11, 12-darslar: Claude qoralama lug'ati o'rniga kitob lug'ati (26.11.2026; foydalanuvchi: «11, 12-darslarni almashtirib
qo'yish kerak. Bu tuzatilgan va qo'shimcha qilingani», «qil»).
1) kNN.BOOK — sahifa VOC asosi (11.html va outputs/lessonNN/index.html); 2) idlar.json: eski qoralama kalitlari → yangi yozuv
(kNN.ESKI; raqam o'zgarmaydi — o'quvchi natijalari saqlanadi); 3) src/ru/dNN.json voc — kitob qatorlarining ruschasi (kNN.RU);
4) kitob_hamma.yoz(N) — matndagi o'rinlar (W) va kitobda yo'q so'zlar (YANGI), ruscha YANGI.
Ishlatish (repo ildizidan): python3 src/build/scratchpad/lq/kitob1112.py 11 → ajrat.py → … 12 → ajrat.py → kitob_hamma.py N --mz"""
import importlib.util, json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(H, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'src/build')); sys.path.insert(0, H)
from ajrat import plain
import kitob_hamma as KH


def mod(p, name):
    s = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
    return m


n = int(sys.argv[1])
K = mod(os.path.join(H, 'k%02d.py' % n), 'k%02d' % n)
OLD = mod(os.path.join(H, '..', 'd%02d' % n, 'voc%02d.py' % n), 'voc%02d' % n).V      # eski qoralama (tartib — kalit sanog'i)

# 1) VOC asosi
J = json.dumps(K.BOOK, ensure_ascii=False)
for p in (KH.html(n), os.path.join(ROOT, 'src/build/outputs/lesson%02d/index.html' % n)):
    s = open(p, encoding='utf-8').read()
    s2, c = re.subn(r'var VOC=\[.*?\];\n', lambda m: 'var VOC=' + J + ';\n', s, count=1, flags=re.S)
    assert c == 1, p
    open(p, 'w', encoding='utf-8').write(s2)

# 2) idlar.json kalitlari
new = [b[1] for b in K.BOOK] + [y[0] for y in K.YANGI]
def keys(lst):
    c, out = {}, []
    for a in lst:
        c[plain(a)] = c.get(plain(a), 0) + 1
        out.append('%d|%s|%d' % (n, plain(a), c[plain(a)]))
    return out
ko, kn_ = keys([v[0] for v in OLD]), keys(new)
ip = os.path.join(ROOT, 'src/build/idlar.json')
I = json.load(open(ip, encoding='utf-8'))
moved = 0
for v, k0 in zip(OLD, ko):
    b = K.ESKI.get(v[0])
    if not b:
        continue
    k1 = kn_[new.index(b)]
    if k0 in I['w'] and k0 != k1:
        assert k1 not in I['w'], k1
        I['w'][k1] = I['w'].pop(k0); moved += 1
open(ip, 'w', encoding='utf-8').write(json.dumps(I, ensure_ascii=False, indent=0, sort_keys=True) + '\n')
print('kalit ko\'chdi:', moved, '| qolib ketadi:', [k for k in ko if k in I['w'] and k not in kn_])

# 3) ruscha voc (kitob qatorlari)
rp = os.path.join(ROOT, 'src/ru/d%02d.json' % n)
t = open(rp, encoding='utf-8').read()
blk = ' "voc": {\n' + ',\n'.join('  %s: %s' % (json.dumps(k, ensure_ascii=False), json.dumps(v, ensure_ascii=False))
                                 for k, v in K.RU.items()) + '\n }'
t2, c = re.subn(r' "voc": \{\n.*?\n \}', lambda m: blk, t, count=1, flags=re.S)
assert c == 1 and json.loads(t2)['voc'] == K.RU, rp
open(rp, 'w', encoding='utf-8').write(t2)

# 4) matndagi o'rinlar va qolgan so'zlar
KH.yoz(n)
