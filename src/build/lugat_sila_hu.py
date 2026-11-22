# -*- coding: utf-8 -*-
"""Lug'at yozuvidan «(هُ)» olib tashlanadi (22.11.2026, foydalanuvchi: «هُ ni olib tashla, kerak emas — faqat 2 ta maf'ulli fe'l
kelganda yozib ketiladi, 2 maf'ullik fe'lligini bildirib»).

Bir martalik o'tkazish (lugat_sila.py natijasidan):
  «… (هُ)»          → «…»            (bitta maf'ul — belgisiz)
  «… (هُ عَلَى ..)» → «… (عَلَى ..)»  (faqat jar harfi qoladi)
  «… (هُ هُ)»       — o'zgarmaydi     (ikki maf'ulli fe'l)
O'zbekcha ma'no («(...га) ёрдам бермоқ» …) va lugat-moziy.json o'zgarmaydi (id lar saqlanadi).

Qayerda: N.html va src/build/outputs/lessonN/index.html (VOC), manba vocNN.py, idlar.json kaliti.
Keyin: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py
Ishlatish (repo ildizidan): python3 src/build/lugat_sila_hu.py   (qayta ishlatilsa — hech narsa o'zgarmaydi)."""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
B = os.path.join(ROOT, 'src', 'build')
HK = re.compile('[ً-ْٰ]')
DARS = [92, 94, 95, 96, 97, 98]
MANBA = {92: ['a92/voc92.py', 'a92/voc92h.py'], 94: ['a94/voc94.py'], 95: ['a95/voc95.py'], 96: ['a96/voc96.py'],
         97: ['a97/voc97.py', 'a97/voc97h.py'], 98: ['d98/voc98.py']}
BIR = re.compile(r'\s*\(هُ\)$')              # «(هُ)» — yozuv oxirida
HARF = re.compile(r'\(هُ (?!هُ)([^()]*\.\.)\)$')  # «(هُ عَلَى ..)» → «(عَلَى ..)»


def yangi(y):
    if not isinstance(y, str):
        return y
    return HARF.sub(r'(\1)', BIR.sub('', y))


def plain(s):
    return HK.sub('', s)


def main():
    J = {}                                          # eski yozuv → yangi
    for n in DARS:
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            ok = 0
            for v in V:
                y = yangi(v[1])
                if y != v[1]:
                    J[v[1]] = y
                    v[1] = y
                    ok += 1
            s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
            open(fp, 'w', encoding='utf-8').write(s)
            print('%s: %d yozuv' % (p, ok))
    # manba fayllar
    for n in DARS:
        for f in MANBA.get(n, []):
            fp = os.path.join(B, 'scratchpad', f)
            if not os.path.exists(fp):
                continue
            s = s0 = open(fp, encoding='utf-8').read()
            for e, y in J.items():
                s = s.replace('"%s"' % e, '"%s"' % y)
            if s != s0:
                open(fp, 'w', encoding='utf-8').write(s)
                print('  manba %s' % f)
    # idlar.json — kalit almashadi, raqam saqlanadi
    idl_p = os.path.join(B, 'idlar.json')
    I = json.load(open(idl_p, encoding='utf-8'))
    P = {plain(e): plain(y) for e, y in J.items()}
    k_ozg = 0
    for k in list(I['w'].keys()):
        q = k.split('|')
        if len(q) == 3 and q[1] in P:
            k1 = '%s|%s|%s' % (q[0], P[q[1]], q[2])
            if k1 in I['w'] and I['w'][k1] != I['w'][k]:
                sys.exit('To\'qnashuv: %s → %s' % (k, k1))
            I['w'][k1] = I['w'].pop(k)
            k_ozg += 1
    open(idl_p, 'w', encoding='utf-8').write(json.dumps(I, ensure_ascii=False, indent=0, sort_keys=True) + '\n')
    print('Yozuv: %d xil, idlar.json kaliti: %d. Endi: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py' % (len(J), k_ozg))


if __name__ == '__main__':
    main()
