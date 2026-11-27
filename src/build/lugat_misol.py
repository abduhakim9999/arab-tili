# -*- coding: utf-8 -*-
"""Lug'at: misol dars matnidan (27.11.2026, foydalanuvchi: «aynan matndagi ma'noni tushuntirib berish kerak lug'at»; docs/qoidalar/lugat.md 4).

Misollaridan hech biri dars matnida bo'lmagan yozuvga (kitob misoli) matndagi gap birinchi misol bo'lib qo'shiladi:
so'zning matndagi birinchi o'rni (VOC[4].w; jar harfli fe'lda — gapida o'sha harf bor o'rin), gap bo'lagi va tarjimasi
lugat_hamma.misol() bilan. Kitob misollari o'chirilmaydi (takror kartasi ishlatadi). Ruscha darsda (src/ru/dNN.json) —
shu gapning ruscha tarjimasi (dNN.json `tr`, belgisiz).
Qayerda: N.html va src/build/outputs/lessonN/index.html (VOC), src/ru/dNN.json. Keyin: ajrat.py, tekshir_data.py, ru build.
Ishlatish (repo ildizidan): python3 src/build/lugat_misol.py [--quruq]   (qayta ishlatilsa — hech narsa o'zgarmaydi)."""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lugat_hamma as LH

ROOT = LH.ROOT
DARSLAR = list(range(1, 13)) + list(range(70, 75)) + list(range(90, 99))
JAR = re.compile(r'\(((?!هُ)[^()]*?)\s*\.\.\)\s*$')
TASHLA = {(3, '56'), (7, '118'), (8, '163'), (71, '1534'), (74, '19'), (74, '20'), (93, '12')}   # qo'lda: matndagi gap mos emas
# 3 أَهْلٌ — «أَهْلاً وَسَهْلاً» ibora; 7 عَلِيٌّ (ism) — عَلَيْكُمْ topilardi; 8 أُمٌّ — «Умму Кулсум» ism; 71 أَخَذَ «олмоқ» — matnda «бошлади»;
# 74 لِ / مِنْ — «يَا لَهُ مِنْ» ibora bo'laklari; 93 نِعْمَةٌ — tarjima bo'lagi «биридир» ga tushardi
HARF = {k for k in json.load(open(os.path.join(ROOT, 'src', 'build', 'harf_manolar.json'), encoding='utf-8')) if not k.startswith('_')} | {'وَ ...'}   # bog'lovchi harf — misolsiz (lugat.md 3a)
UZUN = 14                                              # gap bundan uzun bo'lsa — so'z turgan bo'lak (vergul / nuqtali vergulgacha)
JARB = {                                               # yangi misolda jar harfi (lugat_jar.belgila uslubida)
    (71, '1520'): ('⟨فِي⟩ هَذِهِ', 'муаммо ⟨ҳақида⟩'),
    (71, '1530'): ('⟨إِلَى⟩ سَبْعِينَ', 'кг ⟨га⟩'),
    (73, '1593'): ('⟨مِنَ⟩ الطَّعَامِ', 'таом⟨дан⟩'),
    (91, '2102'): ('⟨إِلَى⟩ تَفَكُّكِ', 'парчаланиши⟨га⟩'),
    (91, '2109'): ('⟨عَنْ⟩ مُخَالَطَةِ', 'юриш⟨дан⟩'),
}


def yl(s):
    s = re.sub('[ً-ٰٟـ]', '', s)
    s = re.sub('[أإآٱ]', 'ا', s).replace('ة', 'ت').replace('ى', 'ي')
    return re.sub('[^ء-ي]', '', s)


def matnda(D, ar):
    t = [yl(x) for x in re.split(r'[\s–—-]+', re.sub(r'\{\^?|\}', '', ar))]
    t = [x for x in t if x]
    def bor(x, Q):                                     # so'z oldida qo'shilgan و / ف ham bo'lishi mumkin (وَشُكْراً)
        return x in Q or ('\u0648' + x) in Q or ('\u0641' + x) in Q
    return bool(t) and any(all(bor(x, Q) for x in t) for Q in ({yl(w.split('~')[0]) for w in r} for r in D))


def orin(p):
    q = p.split('-', 2)
    return int(q[0]), int(q[1]), (q[2] if len(q) > 2 else None)


OLDI = re.compile('^(?:[\u0648\u0641](?=..))?(?:\u0628\u0627\u0644|\u0644\u0644|\u0643\u0627\u0644|\u0627\u0644|[\u0628\u0644\u0643](?=...))?')


def izla(D, yozuv):
    """So'zning matndagi o'rni yozilmagan bo'lsa — matndan qidiriladi (shakllari: birlik, ko'plik, muannas, fe'l shakllari)."""
    if '..' in yozuv or '...' in yozuv:
        return []
    F = [yl(x) for x in re.split(r'\s+(?:–|ج|مؤ\.)\s+|،|\(|\)', re.sub(r'\((?:[^()]*\.\.|\u0647\u064F[^()]*)\)', ' ', yozuv))]
    F = [re.sub('^\u0627\u0644(?=..)', '', f) for f in F if len(f) > 1]
    out = []
    for l, r in enumerate(D):
        for i, t in enumerate(r):
            x = yl(t.split('~')[0])
            for c in {x, OLDI.sub('', x)}:
                if any(c == f or (len(f) > 2 and c.startswith(f) and len(c) - len(f) <= 3) for f in F):
                    out.append((l, i, None))
                    break
    return out


def tanla(D, q):
    W = [orin(p) for p in (q[4] if len(q) > 4 else {}).get('w', [])] or izla(D, q[1])
    if not W:
        return None
    m = JAR.search(q[1])
    if m:
        j = yl(m.group(1).replace('ـ', ''))
        for l, i, qs in W:
            a, b = LH.bolak(D, l, i)
            if any(yl(D[l][k].split('~')[0]).startswith(j) for k in range(a, b)):
                return l, i, qs
    return W[0]


def qisqa(D, TR, o):
    """LH.misol, lekin gap uzun bo'lsa — so'z turgan bo'lak (، ؛ gacha); tarjima — shu bo'lak so'zlariga tegishli qismlar."""
    l, i, qs = o
    a, b = LH.bolak(D, l, i)
    if b - a > UZUN:
        T = D[l]
        a2 = i
        while a2 > a and not re.search(r'~[،؛:]', T[a2 - 1]):
            a2 -= 1
        b2 = i
        while b2 < b - 1 and not re.search(r'~[،؛.؟!:]', T[b2]):
            b2 += 1
        a, b = a2, b2 + 1
    bol = LH.bolak
    LH.bolak = lambda D_, l_, i_: (a, b)
    try:
        e = LH.misol(D, TR, l, i, qs, None)
    finally:
        LH.bolak = bol
    e[0] = re.sub(r'\s+([?.!،])', r'\1', e[0]).rstrip('،؛: ')
    e[1] = re.sub(r'^\d+\)\s*', '', e[1]).rstrip(',;: ')
    return e


def main():
    quruq = '--quruq' in sys.argv
    jami = 0
    for n in DARSLAR:
        D, TR = LH.dars(n)
        rp = os.path.join(ROOT, 'src', 'ru', 'd%02d.json' % n)
        RU = json.load(open(rp, encoding='utf-8')) if os.path.exists(rp) and os.path.exists(os.path.join(ROOT, 'ru%d.html' % n)) else None
        YANGI = {}
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            for q in V:
                if q[1] in HARF or (n, q[0]) in TASHLA or any(matnda(D, e[0]) for e in q[3]):
                    continue
                if q[0] not in YANGI:
                    o = tanla(D, q)
                    if not o:
                        continue
                    try:
                        e = qisqa(D, TR, o)
                        if (n, q[0]) in JARB:
                            import lugat_jar
                            e = [lugat_jar.belgila(e[0], JARB[n, q[0]][0]), lugat_jar.belgila(e[1], JARB[n, q[0]][1])]
                    except AssertionError as x:
                        print('  o\'tkazildi %d %s: %s' % (n, q[0], x))
                        continue
                    ru = None
                    if RU and q[0] in RU['voc']:
                        try:
                            ru = re.sub(r'[{}^]', '', qisqa(D, RU['tr'], o)[1])
                        except AssertionError:
                            ru = ''
                    YANGI[q[0]] = (e, ru)
                    print('%d %s | %s\n    + %s\n      %s%s' % (n, q[0], q[1], e[0], e[1], ('\n      ru: ' + ru) if ru is not None else ''))
                q[3].insert(0, YANGI[q[0]][0])
            if not quruq:
                s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
                open(fp, 'w', encoding='utf-8').write(s)
        if RU and YANGI and not quruq:
            for k, (e, ru) in YANGI.items():
                if k in RU['voc'] and ru is not None:
                    RU['voc'][k].setdefault('x', []).insert(0, [ru])
            voc = RU['voc']                            # faqat «voc» bo'limi qayta yoziladi (kitob_hamma.py uslubi)
            t = open(rp, encoding='utf-8').read()
            blk = ' "voc": {\n' + ',\n'.join('  %s: %s' % (json.dumps(k, ensure_ascii=False), json.dumps(v, ensure_ascii=False)) for k, v in voc.items()) + '\n }'
            t2, c = re.subn(r' "voc": \{\n.*?\n \}', lambda m: blk, t, count=1, flags=re.S)
            assert c == 1 and json.loads(t2)['voc'] == voc, rp
            open(rp, 'w', encoding='utf-8').write(t2)
        jami += len(YANGI)
    print('Jami: %d yozuvga matndan misol. Endi: ajrat.py, tekshir_data.py, src/ru/build.py --hammasi --index --out .' % jami)


if __name__ == '__main__':
    main()
