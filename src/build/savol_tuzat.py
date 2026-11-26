#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dars «Машқ» savollari bo'yicha qarorlarni sahifalarga qo'llaydi (repo ildizidan):

    python3 src/build/savol_tuzat.py            # hamma darslar
    python3 src/build/savol_tuzat.py 5 70       # faqat shu darslar
    python3 src/build/savol_tuzat.py --tekshir  # yozmaydi, faqat nima o'zgarishini aytadi

Manba — src/build/savol-tuzatish.json (har qaror sababi bilan). NN.html dagi
`var QUR=` (savol «Машқ»dan chiqadi), `var TRK=` (izoh), `var QOV=` (variantlar) ga yozadi.
Faqat shu uch JSON qiymati almashadi, sahifaning qolgani tegilmaydi. Qayta ishga tushirilsa — o'zgarish yo'q.
Dars sahifasi generator bilan qayta yasalsa — shu skript yana ishga tushiriladi.
Keyin: python3 src/build/ajrat.py --ochir (data/mashq.json) va python3 src/build/savol_tekshir.py.
Batafsil: docs/texnik/23-savollar.md.
"""
import sys, os, re, json

ROOT = os.getcwd()
FAYL = os.path.join(ROOT, 'src', 'build', 'savol-tuzatish.json')
dec = json.JSONDecoder()


def joy(s, name):
    """`var NAME = {...}` qiymatining (boshi, oxiri, obyekt)."""
    m = re.search(r'var\s+' + name + r'\s*=\s*', s)
    if not m:
        raise SystemExit('%s topilmadi' % name)
    try:
        obj, end = dec.raw_decode(s, m.end())
    except ValueError:
        # ba'zi sahifalarda JS ko'rinishi: {w:"…",c:"R",lb:"…"} — kalitlarni qo'shtirnoqqa olib o'qiladi
        end = yop(s, m.end())
        js = re.sub(r'([{,])\s*(w|c|lb)\s*:', r'\1"\2":', s[m.end():end])
        obj = json.loads(js)
    return m.end(), end, obj


def yop(s, i):
    """i dagi { ning juftini topadi (satr ichidagi qavslarga qaramaydi)."""
    chuq, q = 0, None
    for j in range(i, len(s)):
        ch = s[j]
        if q:
            if ch == '\\':
                continue
            if ch == q and s[j - 1] != '\\':
                q = None
        elif ch in '"\'':
            q = ch
        elif ch in '{[':
            chuq += 1
        elif ch in '}]':
            chuq -= 1
            if chuq == 0:
                return j + 1
    raise SystemExit('qavs yopilmadi')


def qolla(n, t, tekshir):
    p = os.path.join(ROOT, '%s.html' % n)
    s = open(p, encoding='utf-8').read()
    asl = s
    ish = []
    for name, kalit in (('QUR', 'qur'), ('TRK', 'trk'), ('QOV', 'qov')):
        if kalit not in t:
            continue
        a, b, obj = joy(s, name)
        trk = joy(s, 'TRK')[2]
        for k, v in t[kalit].items():
            if name == 'QUR':
                if k not in trk:
                    raise SystemExit('%s: %s — TRK da yo\'q (savol emas)' % (n, k))
                if not obj.get(k):
                    obj[k] = 1
                    ish.append('QUR +' + k)
            else:
                yangi = v['v']
                if name == 'TRK' and k not in obj:
                    raise SystemExit('%s: %s — TRK da yo\'q' % (n, k))
                if obj.get(k) != yangi:
                    obj[k] = yangi
                    ish.append(name + ' ' + k)
        s = s[:a] + json.dumps(obj, ensure_ascii=False) + s[b:]
    if s != asl and not tekshir:
        open(p, 'w', encoding='utf-8').write(s)
    return ish


def main():
    tekshir = '--tekshir' in sys.argv
    tanla = [x for x in sys.argv[1:] if x.isdigit()]
    T = json.load(open(FAYL, encoding='utf-8'))
    jami = 0
    for n, t in T.items():
        if n.startswith('_') or (tanla and n not in tanla):
            continue
        ish = qolla(n, t, tekshir)
        jami += len(ish)
        if ish:
            print('%s.html: %s' % (n, ', '.join(ish)))
    print(('O\'zgaradi' if tekshir else 'O\'zgardi') + ': %d' % jami)


if __name__ == '__main__':
    main()
