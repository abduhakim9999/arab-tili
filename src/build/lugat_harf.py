# -*- coding: utf-8 -*-
"""Bog'lovchi harflar (وَ، فَـ، ثُمَّ، أَوْ، أَمْ، لَكِنَّ، لَكِنْ) — lug'atda asosiy ma'nolar, misolsiz (27.11.2026, foydalanuvchi:
«fa undan oldingi jumlaga bog'liq … bunaqa misollarni olib tashlasak, fa ni o'zini arablar biladigan ma'nosini bilsa»,
«matnda kelgan holati qolsinmi?» → asosiy ma'nolar + shu darsdagisi ajratib; «ha, qil»; docs/qoidalar/lugat.md 3a).

Har darsdagi shu harf yozuvi: ma'no — harf_manolar.json dagi ro'yxat, misol — yo'q, VOC[4].hm — shu darsdagi ma'no raqami
(eski ma'nodan topiladi; topilmasa — HM qo'lda), takrorda bitta karta — boshqa darsdagilar birinchisiga `ay` bilan.
Ruscha darsda (src/ru/dNN.json) — ruscha ro'yxat, misolsiz. Qayta ishlatilsa — hech narsa o'zgarmaydi (hm saqlanadi).
Ishlatish (repo ildizidan): python3 src/build/lugat_harf.py [--quruq]; keyin ajrat.py, tekshir_data.py, src/ru/build.py --hammasi --index --out ."""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
B = os.path.join(ROOT, 'src', 'build')
DARSLAR = list(range(1, 13)) + list(range(70, 75)) + list(range(90, 99))
M = {k: v for k, v in json.load(open(os.path.join(B, 'harf_manolar.json'), encoding='utf-8')).items() if not k.startswith('_')}
TAXALLUS = {'وَ ...': ('وَ..', 3)}                      # ҳол вови — alohida yozuv, umumiy kartaning 4-ma'nosi
HM = {(98, '34'): 1, (71, '1546'): 1, (91, '2113.71'): 4}                                   # (dars, kn): ma'no raqami — avtomat topilmasa yoki xato bo'lsa («демак (натижа)»)


# Har ma'no — takrorda alohida karta (27.11.2026, foydalanuvchi: «har bir ma'nosini bilish uchun alohida saqlab eslab qolish kerak
# emasmikin, hozir bitta bo'lib o'tib ketadi», → «qil»). Ma'noning kursda birinchi uchragan yozuvi — o'sha ma'no kartasi (`asl` bosh
# kartaga; bosh karta — o'z ma'nosi), keyingi uchrashlari — `ay` bilan o'shanga. Kartadagi gap (VOC[4].kg) — harf o'rni, oldingi bo'lagi
# bilan ({…} — harfning o'zi); ajrat.py: matnning bitta qatorida topilsa dars gapi (ruschasi ham), topilmasa [arabcha, tarjima].
KARTA = {
    (1, '7'): ['{وَ}عَلَيْكُمُ السَّلَامُ.', ''],
    (1, '23'): ['بِخَيْرٍ {وَ}الْحَمْدُ لِلَّهِ.', ''],
    (1, '26'): ['بِخَيْرٍ وَالْحَمْدُ لِلَّهِ. {وَ}كَيْفَ حَالُكَ أَنْتَ؟', ''],
    (7, '135'): ['وَهَذَا جَدِّي {وَ}هَذِهِ جَدَّتِي.', ''],
    (71, '1525'): ['زَيْنَبُ وَمَرْيَمُ صَدِيقَتَانِ تَتَشَابَهَانِ فِي أَشْيَاءَ كَثِيرَةٍ، {فَ}هُمَا تَسْكُنَانِ فِي حَيٍّ وَاحِدٍ',
                   'Зайнаб ва Марям 2 дугона бўлиб, улар кўп нарсаларда бир-бирига ўхшайди. Чунки иккови бир маҳаллада яшайди.'],
    (71, '1546'): ['أَخَذَتْ مَرْيَمُ تَأْكُلُ كَثِيراً {فَ}زَادَ وَزْنُهَا وَلَمْ يَنْقُصْ.', ''],
    (71, '1547'): ['أَخَذَتْ مَرْيَمُ تَأْكُلُ كَثِيراً فَزَادَ وَزْنُهَا {وَ}لَمْ يَنْقُصْ.', ''],
    (73, '1621'): ['فَإِنْ كَانَ لَا مَحَالَةَ، {فَ}ثُلُثٌ لِطَعَامِهِ، وَثُلُثٌ لِشَرَابِهِ، وَثُلُثٌ لِنَفَسِهِ.', ''],
    (73, '1621.44'): ['وَأَخَذَ النَّاسُ يَتَّبِعُونَ الْحِمْيَةَ، {فَ}يَتَنَاوَلُونَ طَعَاماً قَلِيلاً،', ''],
    (91, '2111'): ['كَالْعَمَلِ فِي الْمَجَالِ الطِّبِّيِّ؛ {فَ}تَعْمَلُ طَبِيبَةً، أَوْ مُمَرِّضَةً، أَوْ فِي الْمَجَالِ التَّعْلِيمِيِّ؛',
                   '…тиббиёт масканлари каби жойларда ишлайди. Бунда у врач ё фельшер бўлиб ишлаши мумкин. Ёки таълим масканларида ишлайди.'],
    (93, '51.32'): ['وَمَعَ ذَلِكَ {فَ}بَعْضُ النَّاسِ لَا يُحِبُّونَ الْعَمَلَ،', ''],
}


def bogla(quruq):
    """Ko'p ma'noli harf (وَ، فَـ): har ma'no — o'z kartasi. Qayta ishlatilsa — o'zgarmaydi."""
    L = json.load(open(os.path.join(ROOT, 'data', 'lugat.json'), encoding='utf-8'))['s']
    ID = {(r['d'], r['kn']): r['id'] for r in L}
    sah = {}
    for n in DARSLAR:
        s = open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read()
        m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
        sah[n] = (s, m, json.loads(m.group(1)))
    bosh, hmb, ilk, oz = {}, {}, {}, set()
    for n in DARSLAR:
        for q in sah[n][2]:
            kalit = TAXALLUS.get(q[1], (q[1],))[0]
            if kalit not in M or len(M[kalit]['uz']) < 2 or len(q) < 5:
                continue
            if (n, q[0]) in HM and q[4].get('hm') != HM[n, q[0]]:
                q[4]['hm'] = HM[n, q[0]]; oz.add(n)
            hm, i = q[4].get('hm'), ID.get((n, q[0]))
            if hm is None or i is None:
                continue
            if kalit not in bosh:                      # kursdagi birinchi yozuv — bosh karta (tk 1)
                bosh[kalit], hmb[kalit] = i, hm
            b = bosh[kalit]
            if i == b or (hm != hmb[kalit] and (kalit, hm) not in ilk):
                if i != b:
                    ilk[kalit, hm] = i
                yangi = {k: v for k, v in q[4].items() if k not in ('ay', 'asl', 'kg')}
                if i != b:
                    yangi['asl'] = b                   # yangi ma'no — o'z kartasi
                if (n, q[0]) in KARTA:
                    yangi['kg'] = KARTA[n, q[0]]
                else:
                    print('  DIQQAT: kartaga gap yo\'q — %d %s (hm %d)' % (n, q[0], hm))
            else:
                yangi = {k: v for k, v in q[4].items() if k not in ('ay', 'asl', 'kg')}
                yangi['ay'] = b if hm == hmb[kalit] else ilk[kalit, hm]
            if yangi != q[4]:
                q[4].clear(); q[4].update(yangi); oz.add(n)
    for n in sorted(oz):
        print('  bog\'landi: %d-dars' % n)
        if quruq:
            continue
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            Y = {q[0]: q for q in sah[n][2]}
            for q in V:
                if q[0] in Y and len(q) > 4:
                    q[4] = Y[q[0]][4]
            s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
            open(fp, 'w', encoding='utf-8').write(s)
    print('Ma\'no kartalari:', {k: v for k, v in ilk.items()})


def topish(kalit, eski):
    k = M[kalit].get('k')
    if not k:
        return None
    t = ' '.join(eski).lower()
    t = re.sub(r'^\s*1\.\s*', '', t)                    # bir nechta raqamli ma'no bo'lsa — birinchisi (matndagisi)
    eng, j = None, None
    for i, sozlar in enumerate(k):
        for s in sozlar:
            p = t.find(s)
            if p >= 0 and (eng is None or p < eng):
                eng, j = p, i
    return j


def main():
    quruq = '--quruq' in sys.argv
    L = json.load(open(os.path.join(ROOT, 'data', 'lugat.json'), encoding='utf-8'))['s']
    ID = {(r['d'], r['kn']): r for r in L}
    BOSH = {}                                          # kalit → takrordagi yagona karta id (tk 1)
    for r in L:
        k = TAXALLUS.get(r['yozuv'], (r['yozuv'],))[0] if r.get('yozuv') else None
        if k in M and r.get('tk') == 1:
            BOSH.setdefault(k, r['id'])
    jami = 0
    for n in DARSLAR:
        rp = os.path.join(ROOT, 'src', 'ru', 'd%02d.json' % n)
        RU = json.load(open(rp, encoding='utf-8')) if os.path.exists(rp) and os.path.exists(os.path.join(ROOT, 'ru%d.html' % n)) else None
        ruoz = False
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            oz = False
            for q in V:
                kalit, hm0 = TAXALLUS.get(q[1], (q[1], None))
                if kalit not in M:
                    continue
                while len(q) < 5:
                    q.append({})
                yangi = M[kalit]['uz']
                if q[2] == yangi and not q[3]:
                    continue                           # allaqachon o'tkazilgan
                hm = HM.get((n, q[0]), hm0 if hm0 is not None else topish(kalit, q[2]))
                if p.endswith('%d.html' % n):
                    print('%d %s %s | %s → %s' % (n, q[0], q[1], ' / '.join(q[2]), yangi[hm] if hm is not None else '—'))
                    jami += 1
                q[2] = list(yangi)
                q[3] = []
                if len(yangi) > 1 and hm is not None:
                    q[4]['hm'] = hm
                r = ID.get((n, q[0]))
                b = BOSH.get(kalit)
                if r and b and r['id'] != b and not q[4].get('ay'):
                    q[4]['ay'] = b                     # takrorda bitta karta
                    q[4].pop('asl', None)
                oz = True
                if RU and q[0] in RU['voc']:
                    RU['voc'][q[0]]['m'] = list(M[kalit]['ru'])
                    RU['voc'][q[0]].pop('x', None)
                    ruoz = True
            if oz and not quruq:
                s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
                open(fp, 'w', encoding='utf-8').write(s)
        if RU and ruoz and not quruq:
            voc = RU['voc']                            # faqat «voc» bo'limi qayta yoziladi (kitob_hamma.py uslubi)
            t = open(rp, encoding='utf-8').read()
            blk = ' "voc": {\n' + ',\n'.join('  %s: %s' % (json.dumps(k, ensure_ascii=False), json.dumps(v, ensure_ascii=False)) for k, v in voc.items()) + '\n }'
            t2, c = re.subn(r' "voc": \{\n.*?\n \}', lambda mm: blk, t, count=1, flags=re.S)
            assert c == 1 and json.loads(t2)['voc'] == voc, rp
            open(rp, 'w', encoding='utf-8').write(t2)
    print('Jami: %d yozuv. Bosh kartalar: %s' % (jami, BOSH))
    bogla(quruq)


if __name__ == '__main__':
    main()
