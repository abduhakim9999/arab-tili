#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dars «Машқ» savollari bo'yicha qarorlarni sahifalarga qo'llaydi (repo ildizidan):

    python3 src/build/savol_tuzat.py            # hamma darslar
    python3 src/build/savol_tuzat.py 5 70       # faqat shu darslar
    python3 src/build/savol_tuzat.py --tekshir  # yozmaydi, faqat nima o'zgarishini aytadi

Manba — src/build/savol-tuzatish.json (har qaror sababi bilan). NN.html dagi
`var QUR=` (savol «Машқ»dan chiqadi), `var TRK=` (izoh), `var QOV=` (variantlar), `var QTUR=` (yangi savol turlari) ga yozadi.
Darsda `tur` bo'lsa — `savol.js` ulanadi va «Машқ» kodiga ilgaklar qo'yiladi (KOD ro'yxati, aniq matn bo'yicha).
Boshqa joyi tegilmaydi. Qayta ishga tushirilsa — o'zgarish yo'q.
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


# Yangi savol turlari (savol.js) uchun sahifa kodidagi ilgaklar. «Машқ» kodi 26 darsda bir xil (26.11.2026 tekshirildi),
# shuning uchun aniq matn almashtiriladi; topilmasa — to'xtaydi (sahifa kodi o'zgargan: ilgakni qo'lda moslang).
KOD = [
    ('qstart', 'QZ.forEach(function(q){q.o=qends(q.l+"-"+q.w);q.ch=null;q.ok=false});qi=0;',
               'QZ.forEach(function(q){q.o=qends(q.l+"-"+q.w);q.ch=null;q.ok=false});if(window.QTX)QZ=QTX.plan(QZ);qi=0;'),
    ('qshow', 'function qshow(){\n  var q=QZ[qi]',
              'function qshow(){\n  if(window.QTX&&QZ[qi].t){QTX.show();return}\n  var q=QZ[qi]'),
    ('qans', 'function qans(b){\n  var q=QZ[qi];',
             'function qans(b){\n  if(window.QTX&&QZ[qi].t){QTX.ans(b);return}\n  var q=QZ[qi];'),
    ('qfb', 'function qfb(q){\n  var k=',
            'function qfb(q){\n  if(window.QTX&&q.t){QTX.fb(q);return}\n  var k='),
    ('qres', "'+(am?arw(am[1]):mainLine(k))+'",
             "'+(q.t&&window.QTX?arw(QTX.iz(q)):(am?arw(am[1]):mainLine(k)))+'"),
    ('saveQ', 'S.q={o:QZ.map(function(q){return [q.l,q.w]}),',
              'S.q={o:QZ.map(function(q){return q.t?[q.l,q.w,q.t]:[q.l,q.w]}),'),
    ('tiklash', 'var k=x[0]+"-"+x[1],o=TRK[k]&&!QUR[k]?qends(k):null;if(!o){okAll=false;return}var c=S.q.ch[i];Z.push({l:x[0],w:x[1],o:o,ch:(c==null?null:c),ok:c!=null&&o[c]&&o[c].w==get(k).v})});\n      if(okAll&&Z.length){',
                'var k=x[0]+"-"+x[1],t=x[2],o=t?(window.QTX?QTX.ops(k,t):null):(TRK[k]&&!QUR[k]&&!(window.QTUR&&QTUR[k])?qends(k):null);if(!o){okAll=false;return}var c=S.q.ch[i];Z.push({l:x[0],w:x[1],t:t,o:o,ch:(c==null?null:c),ok:c!=null&&!!o[c]&&(t?!!o[c].ok:o[c].w==get(k).v)})});\n      if(okAll&&window.QTX&&!QTX.mos(Z))okAll=false;\n      if(okAll&&Z.length){'),
]


def kod(s, ish):
    for nom, eski, yangi in KOD:
        if yangi in s:
            continue
        if s.count(eski) != 1:
            raise SystemExit('ilgak «%s»: sahifa kodida %d marta topildi (1 bo\'lishi kerak)' % (nom, s.count(eski)))
        s = s.replace(eski, yangi)
        ish.append('kod ' + nom)
    if '<script src="savol.js"></script>' not in s:
        i = s.index('var D=[')
        j = s.rindex('<script>', 0, i)
        s = s[:j] + '<script src="savol.js"></script>\n' + s[j:]
        ish.append('kod savol.js')
    return s


def qolla(n, t, tekshir):
    p = os.path.join(ROOT, '%s.html' % n)
    s = open(p, encoding='utf-8').read()
    asl = s
    ish = []
    if t.get('tur'):
        s = kod(s, ish)
        if not re.search(r'var\s+QTUR\s*=', s):
            a, b, _ = joy(s, 'QUR')
            e = s.index(';', b) + 1
            s = s[:e] + '\nvar QTUR={};' + s[e:]
        a, b, obj = joy(s, 'QTUR')
        yangi = {k: {x: v[x] for x in ('t', 's', 'o', 'j', 'iz') if x in v} for k, v in t['tur'].items()}
        if obj != yangi:
            s = s[:a] + json.dumps(yangi, ensure_ascii=False) + s[b:]
            ish.append('QTUR %d' % len(yangi))
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
                if name == 'TRK' and k not in obj and not v.get('yangi'):
                    raise SystemExit('%s: %s — TRK da yo\'q (yangi savol bo\'lsa — "yangi": true)' % (n, k))
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
