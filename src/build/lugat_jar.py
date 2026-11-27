# -*- coding: utf-8 -*-
"""Lug'at: jar harfi qoidasi (27.11.2026, foydalanuvchi: «jar harfini belgilab va tegida misolda jar harfi bergan ma'nosini ham
belgilab ko'rsatsa», «ba'zi fe'llar jar harfisiz ham … o'zi shundoq ma'no beradi — ularga ko'rsatish shart emas»,
«aynan matndagi ma'noni tushuntirib berish kerak lug'at»; qoida — docs/qoidalar/lugat.md).

Bir martalik o'tkazish (qayta ishlatilsa — hech narsa o'zgarmaydi):
  1. OLIB — matnda jar harfisiz kelgan fe'l/so'zdan «(X ..)» va o'zbekchadagi «(...га)» olib tashlanadi (id saqlanadi).
  2. BELGI — misolda jar harfi «{^…}» va o'zbekchadagi mos qo'shimcha «{^…}» (shell.js — to'q sariq).
     Yozuvda «⟨…⟩» — belgilanadigan qism; matnda «{X}» bo'lsa — «{^X}» ga almashadi.
Qayerda: N.html va src/build/outputs/lessonN/index.html (VOC), manba fayllar (src/build/scratchpad/**), idlar.json kaliti,
lugat-moziy.json (mz). Keyin: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py
Ishlatish (repo ildizidan): python3 src/build/lugat_jar.py [--quruq]"""
import glob, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
B = os.path.join(ROOT, 'src', 'build')
HK = re.compile('[ً-ْٰ]')

# OLIB — aslida «o'zgartirish»: boshqaruv olib tashlanadi yoki (2-bosqich) qo'shiladi.
# (dars, kn): (yangi yozuv yoki None, yangi ma'no ro'yxati yoki None, yangi mz yoki None, {misol: (eski uz, yangi uz)})
OLIB = {
    (70, '1501'): ('أَمَرَ – يَأْمُرُ – اُؤْمُرْ، مُرْ – أَمْرٌ', ['буюрмоқ, амр қилмоқ'], ['буюрди, амр қилди'], {}),
    (74, '23.12'): ('شُكْراً', ['раҳмат'], None, {}),
    (91, '2113.19'): ('سَاعَدَ – يُسَاعِدُ – سَاعِدْ – مُسَاعَدَةٌ', ['ёрдам бермоқ'], ['ёрдам берди'], {}),
    (98, '15'): ('سَاعَدَ – يُسَاعِدُ – سَاعِدْ – مُسَاعَدَةٌ', ['ёрдам бермоқ'], ['ёрдам берди'],
                 {0: ('Мен{га} {ёрдам беринглар}', 'Менга {ёрдам беринглар}')}),
    (94, '51'): ('نَطَقَ – يَنْطِقُ – اِنْطِقْ – نُطْقٌ', ['талаффуз қилмоқ'], ['талаффуз қилди'], {}),
    (96, '42'): ('وَجَبَ – يَجِبُ – وُجُوبٌ', ['шарт (керак) бўлмоқ'], ['шарт (керак) бўлди'], {}),
    # 27.11.2026, 2-bosqich: matnda jar harfi bilan kelgan, belgisi yo'q edi (qo'shildi)
    (71, '1524'): ('تَشَابَهَ – يَتَشَابَهُ – تَشَابَهْ – تَشَابُهٌ (فِي ..)', ['(...да) бир-бирига (ўзаро) ўхшамоқ'], ['(...да) бир-бирига (ўзаро) ўхшади'], {}),
    (93, '21'): ('غَدَا – يَغْدُو – اُغْدُ – غُدُوٌّ (إِلَى ..)', ['(...га) тонгда йўлга чиқмоқ'], ['(...га) тонгда йўлга чиқди'], {}),
    (93, '48'): ('رَجَعَ – يَرْجِعُ – اِرْجِعْ – رُجُوعٌ (إِلَى ..)', ['(...га) қайтмоқ'], ['(...га) қайтди'], {}),
    (93, '35'): ('اِشْتَرَى – يَشْتَرِي – اِشْتَرِ – اِشْتِرَاءٌ (بِـ..)', ['(...га) сотиб олмоқ'], ['(...га) сотиб олди'], {}),
}

# (dars, kn, misol): (arabchada, o'zbekchada yoki None)
BELGI = {
    (8, '145', 0): ('⟨عَلَيْ⟩هِ', 'у⟨ни⟩ шарафли'),
    (8, '146', 0): ('⟨عَلَيْ⟩هِ', 'у⟨ни⟩ шарафли'),
    (8, '148', 0): ('⟨عَلَيْ⟩هِ', 'у⟨ни⟩ шарафлайдилар'),
    (70, '1492', 0): ('⟨مِنْ⟩ بَطْنِهِ', 'Қорни⟨дан⟩'),
    (70, '1514.8', 0): ('⟨بِ⟩آلَامٍ', 'оғриқлар⟨ни⟩'),
    (70, '1514.13', 0): ('⟨إِلَى⟩ الطَّبِيبِ', 'Врач⟨га⟩'),
    (71, '1520', 0): ('⟨فِي⟩مَ', 'Нима ⟨ҳақида⟩'),
    (71, '1530', 0): ('⟨إِلَى⟩ سَبْعِينَ', '70 кг ⟨га⟩'),
    (71, '1549.9', 0): ('⟨فِي⟩ حَيٍّ', 'маҳалла⟨да⟩'),
    (73, '1592', 0): ('⟨عَنِ⟩ السُّكَّرِيَّاتِ', 'нарсалар⟨дан⟩'),
    (73, '1593', 0): ('⟨مِنْ⟩هُ', 'ун⟨дан⟩'),
    (73, '1593', 1): ('⟨مِنْ⟩هُ', 'ун⟨дан⟩'),
    (73, '1601', 0): ('⟨إِلَى⟩ الْحِمْيَةِ', 'пархез⟨га⟩'),
    (73, '1601', 1): ('⟨إِلَيَّ⟩', 'Мен⟨га⟩'),
    (73, '1601', 2): ('⟨إِلَيَّ⟩', 'мен⟨га⟩'),
    (73, '1621.71', 0): ('اللَّهُ ⟨عَلَيْ⟩هِ', None),
    (73, '1621.74', 0): ('اللَّهُ ⟨عَلَيْ⟩هِ', None),
    (74, '23.3', 0): ('⟨إِلَى⟩ التَّرْوِيحِ', 'олиш⟨га⟩'),
    (74, '23.39', 0): ('⟨مِنِّ⟩ي', 'мен⟨дан⟩'),
    (74, '23.48', 0): ('وَ⟨بِ⟩مَ', None),
    (90, '3', 0): ('⟨عَنِ⟩ الْعَمَلِ', None),
    (90, '24', 0): ('⟨إِلَى⟩ عَشَرَةِ', 'муҳандис⟨га⟩'),
    (90, '52', 0): ('⟨فِي⟩ كُلِّيَّةِ', 'факультети⟨ни⟩'),
    (91, '2089', 0): ('⟨إِلَى⟩ ثَلَاثِ', 'гуруҳ⟨га⟩'),
    (91, '2102', 0): ('⟨إِلَيْ⟩هِ', 'шун⟨га⟩ олиб'),
    (91, '2113.5', 0): ('⟨فِي⟩ الْإِجَابَةِ', 'бериш ⟨ҳақида⟩'),
    (91, '2113.7', 0): ('⟨عَنِ⟩ الْأَسْئِلَةِ', 'саволлар⟨га⟩'),
    (91, '2113.67', 0): ('⟨مِنَ⟩ الْبَيْتِ', 'уйи⟨дан⟩'),
    (92, '22', 0): ('⟨مَعَ⟩كَ', None),
    (92, '25', 0): ('⟨إِلَيْ⟩', 'биз⟨га⟩'),
    (92, '53', 0): ('⟨فِي⟩ أَوْلَادِكَ', 'фарзандларинг ⟨ҳақида⟩'),
    (92, '62', 0): ('⟨عَلَى⟩', 'дини⟨ни⟩'),
    (92, '69', 0): ('⟨إِلَى⟩', 'юртлар⟨га⟩'),
    (92, '76', 0): ('⟨عَلَى⟩', '⟨учун⟩'),
    (92, '79', 0): ('⟨عَلَى⟩', 'кетишинг⟨га⟩'),
    (92, '91', 0): ('⟨إِلَيْ⟩', 'Биз⟨га⟩'),
    (92, '96', 0): ('⟨فِي⟩', 'сиз⟨га⟩'),
    (93, '5', 0): ('⟨فِي⟩ الْإِجَابَةِ', 'Жавоб ⟨ҳақида⟩'),
    (93, '32', 0): ('⟨بِ⟩هِمَا', 'Иккалови⟨ни⟩'),
    (93, '51.72', 0): ('⟨إِلَى⟩ أَهْلِكَ', 'оиланг⟨га⟩'),
    (94, '12', 0): ('⟨بِ⟩الْمَعْهَدِ', 'институт⟨га⟩'),
    (94, '39', 0): ('⟨بِ⟩اللُّغَةِ', 'тили⟨да⟩'),
    (95, '10', 0): ('⟨فِي⟩ الْإِجَابَةِ', 'бериш ⟨ҳақида⟩'),
    (95, '53', 0): ('⟨بِ⟩هَا', 'тил⟨да⟩'),
    (95, '86', 0): ('⟨فِي⟩ لُغَاتِ', 'тиллари⟨га⟩'),
    (96, '19', 0): ('⟨بِ⟩جَامِعَةِ', 'университети⟨га⟩'),
    (96, '26', 0): ('⟨فِي⟩ الدِّرَاسَاتِ', 'фанлар ⟨борасида⟩'),
    (97, '8', 0): ('⟨فِي⟩ الْإِجَابَةِ', 'бериш ⟨борасида⟩'),
    (97, '19', 0): ('⟨مِنَ⟩', 'тили⟨дан⟩'),
    (97, '38', 0): ('⟨إِلَيْ⟩', 'у⟨нга⟩'),
    (97, '53', 0): ('⟨إِلَى⟩', 'Европа⟨га⟩'),
    (97, '57', 0): ('⟨بِ⟩', 'араблар⟨нинг бошидан⟩'),
    (97, '61', 0): ('⟨عَنْ⟩ دِينِهِمْ', 'динлари⟨дан⟩'),
    (97, '82', 0): ('⟨إِلَى⟩ تَفَرُّقِ', 'тарқоқлашиши⟨га⟩'),
    (97, '93', 0): ('⟨بِ⟩', '⟨билан⟩'),
    (97, '95', 0): ('⟨بِ⟩', 'лаҳжалари⟨да⟩'),
    (97, '95', 1): ('⟨بِ⟩', 'тил⟨да⟩'),
    (97, '125', 0): ('⟨مِنْ⟩', 'млн.⟨дан⟩'),
    (98, '20', 0): ('⟨عَلَى⟩', 'мукофот⟨га⟩'),
    (98, '76', 0): ('⟨مِنْ⟩', 'Сизлар⟨дан⟩'),
    (98, '77', 0): ('⟨عَنْ⟩', 'се⟨ни⟩'),
    (98, '80', 0): ('⟨فِي⟩', 'ҳаётинг⟨да⟩'),
    (71, '1524', 0): ('⟨فِي⟩ أَشْيَاءَ', 'нарсалар⟨да⟩'),
}


def belgila(t, y):
    """y: «oldi⟨X⟩keyini». Matnda «oldi{X}keyini» bo'lsa — «{^X}», aks holda «oldiXkeyini» → «oldi{^X}keyini»."""
    if '{^' in t:
        return t
    a, r = y.split('⟨'); x, b = r.split('⟩')
    for e, n in ((a + '{' + x + '}' + b, a + '{^' + x + '}' + b), (a + x + b, a + '{^' + x + '}' + b)):
        i = t.find(e)
        if i >= 0:
            return t[:i] + n + t[i + len(e):]
    raise SystemExit('Topilmadi: %r ichida %r' % (t, y))


def main():
    quruq = '--quruq' in sys.argv
    ESKI = {}                                         # dars → {eski satr → yangi} (manba fayllar uchun — faqat o'sha darsning fayllari)
    YOZ = {}                                          # dars → {eski yozuv plain: yangi plain}
    darslar = sorted({k[0] for k in OLIB} | {k[0] for k in BELGI})
    ok_b = ok_o = 0
    for n in darslar:
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            for v in V:
                o = OLIB.get((n, v[0]))
                if o:
                    yz, uz, _, ex = o
                    if v[1] != yz:
                        ESKI.setdefault(n, {})[json.dumps(v[1], ensure_ascii=False)] = json.dumps(yz, ensure_ascii=False)
                        YOZ.setdefault(n, {})[HK.sub('', v[1])] = HK.sub('', yz)
                        v[1] = yz; ok_o += 1
                    if uz and v[2] != uz:
                        ESKI.setdefault(n, {})[json.dumps(v[2], ensure_ascii=False)] = json.dumps(uz, ensure_ascii=False)
                        v[2] = uz
                    for xi, (e0, e1) in ex.items():
                        if v[3][xi][1] == e0:
                            v[3][xi][1] = e1; ESKI.setdefault(n, {})[json.dumps(e0, ensure_ascii=False)] = json.dumps(e1, ensure_ascii=False)
                for xi, e in enumerate(v[3]):
                    b = BELGI.get((n, v[0], xi))
                    if not b:
                        continue
                    a0 = e[0]; e[0] = belgila(e[0], b[0])
                    if b[1] and len(e) > 1:
                        u0 = e[1]; e[1] = belgila(e[1], b[1])
                        if u0 != e[1]:
                            ESKI.setdefault(n, {})[json.dumps(u0, ensure_ascii=False)] = json.dumps(e[1], ensure_ascii=False)
                    if a0 != e[0]:
                        ESKI.setdefault(n, {})[json.dumps(a0, ensure_ascii=False)] = json.dumps(e[0], ensure_ascii=False); ok_b += 1
            if not quruq:
                s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
                open(fp, 'w', encoding='utf-8').write(s)
    print('Olib tashlandi: %d yozuv; belgilandi: %d misol (sahifa + outputs)' % (ok_o, ok_b))
    # manba fayllar — eski satr qo'shtirnoq ichida aynan bo'lsa almashtiriladi
    for fp in sorted(glob.glob(os.path.join(B, 'scratchpad', '**', '*.py'), recursive=True) +
                     glob.glob(os.path.join(B, 'scratchpad', '**', '*.txt'), recursive=True)):
        if '/lt/' in fp or (fp.endswith('.txt') and not re.search(r'/lq/b(%s)\.txt$' % '|'.join(map(str, darslar)), fp)):
            continue
        s = s0 = open(fp, encoding='utf-8').read()
        dn = re.findall(r'(?<![0-9])(\d{1,2})(?![0-9])', os.path.relpath(fp, os.path.join(B, 'scratchpad')))
        for e, y in {k: v for n_, d_ in ESKI.items() if str(n_) in dn for k, v in d_.items()}.items():
            s = s.replace(e, y)
            e2, y2 = e[1:-1], y[1:-1]                 # bNN.txt da qo'shtirnoqsiz
            if fp.endswith('.txt') and len(e2) > 6 and y2 not in s:
                s = s.replace(e2, y2)
        if s != s0:
            print('  manba', os.path.relpath(fp, ROOT))
            if not quruq:
                open(fp, 'w', encoding='utf-8').write(s)
    if quruq:
        return
    # idlar.json — kalit almashadi, raqam saqlanadi
    idl_p = os.path.join(B, 'idlar.json')
    I = json.load(open(idl_p, encoding='utf-8'))
    k_ozg = 0
    for k in list(I['w'].keys()):
        q = k.split('|')
        if len(q) == 3 and q[0].isdigit() and q[1] in YOZ.get(int(q[0]), {}):
            k1 = '%s|%s|%s' % (q[0], YOZ[int(q[0])][q[1]], q[2])
            if k1 in I['w'] and I['w'][k1] != I['w'][k]:
                sys.exit("To'qnashuv: %s → %s" % (k, k1))
            I['w'][k1] = I['w'].pop(k); k_ozg += 1
    open(idl_p, 'w', encoding='utf-8').write(json.dumps(I, ensure_ascii=False, indent=0, sort_keys=True) + '\n')
    # lugat-moziy.json — id bo'yicha (data/lugat.json dan: dars + kn)
    L = json.load(open(os.path.join(ROOT, 'data', 'lugat.json'), encoding='utf-8'))['s']
    ID = {(r['d'], r['kn']): r['id'] for r in L}
    mp = os.path.join(B, 'lugat-moziy.json')
    s = open(mp, encoding='utf-8').read()
    for (n, kn), (_, _, mz, _) in OLIB.items():
        i = ID.get((n, kn))
        if mz and i is not None:
            s2 = re.sub(r'("%d": \[\n)[^\]]*(\])' % i, lambda m: m.group(1) + ',\n'.join(json.dumps(x, ensure_ascii=False) for x in mz) + '\n' + m.group(2), s)
            if s2 == s and ('"%d": [' % i) not in s:
                print('  mz yo\'q: %d-dars %s (id %d)' % (n, kn, i))
            s = s2
    open(mp, 'w', encoding='utf-8').write(s)
    print('idlar.json kaliti: %d. Endi: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py' % k_ozg)


if __name__ == '__main__':
    main()
