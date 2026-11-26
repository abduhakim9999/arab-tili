#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dars «Машқ» savollarini tartib bo'yicha tekshiradi (repo ildizidan, ajrat.py dan keyin):

    python3 src/build/savol_tekshir.py          # hamma darslar
    python3 src/build/savol_tekshir.py 93 94    # faqat shu darslar (darslararo takror — hammasiga qarab)

Manba — data/mashq.json. Bu faqat YORDAMCHI: topganini Claude har birini o'zi o'ylab hal qiladi
(qaror — src/build/savol-tuzatish.json ga, sababi bilan). Topilmagani «to'g'ri» degani emas —
har savol baribir o'qib chiqiladi (docs/texnik/23-savollar.md).

XATO — albatta tuzatiladi; DIQQAT — ko'rib, qaror qilinadi; BOSQICH3 — faqat yangi savol turlari bilan hal bo'ladi.
savol-tuzatish.json dagi `qoldi` (o'ylab qoldirilgan) kalitlar ko'rsatilmaydi; `_kutadi` darslari topilmalari
KUTADI deb chiqadi (hisobga kirmaydi, lekin ko'rinib turadi).
"""
import sys, os, re, json, collections

ROOT = os.getcwd()
HK = re.compile('[ً-ْٰـ]')
OXIR = {'ٌ': 'R', 'ُ': 'R', 'ً': 'N', 'َ': 'N', 'ٍ': 'J', 'ِ': 'J', 'ْ': 'Z'}
STD = {'замма', 'фатҳа', 'касра', 'сукун', 'танвинли замма', 'танвинли фатҳа', 'танвинли касра'}
OTISH = 80          # dars o'tish chegarasi, %
KAM = 5             # darsda bundan kam savol — DIQQAT
# Harakati amalda o'zgarmaydigan so'zlar (mabniy yoki qotib qolgan) — harakat savoli bo'lmaydi
QOTGAN = {'الآن', 'هنا', 'هناك', 'أمس', 'حيث', 'قط', 'أيضا', 'جدا', 'شكرا', 'عفوا', 'مع', 'سبحان'}
# Yodlangan iboralar: (so'z, qo'shni so'z)
IBORA = [('خيرا', 'جزا'), ('الحمد', 'لله'), ('الله', 'شاء'), ('السلام', 'عليكم'), ('أهلا', 'سهلا')]


def plain(s):
    return HK.sub('', s).replace('ٱ', 'ا')


def oxirgi(w):
    m = [OXIR[c] for c in w if c in OXIR]
    return m[-1] if m else '?'


def javob(q):
    """To'g'ri variantning harakat belgisi (c: R/N/J/Z/B) — olmoshli so'zda ham to'g'ri."""
    tw = q['gap'][q['w']][0]
    for x in q['var']:
        if x[0] == tw:
            return x[1]
    return oxirgi(tw)


def ozak(w):
    w = plain(w)
    w = re.sub('^[وف]', '', w)
    return re.sub('^(ال|لل|ل)', '', w)


def vazifa(q):
    s = q.get('sabab', '').split('—', 1)[-1]
    return re.sub(r'\s+', ' ', re.split(r'шунинг|[,;.]', s)[0]).strip()


def main():
    tanla = {int(x) for x in sys.argv[1:] if x.isdigit()}
    S = json.load(open(os.path.join(ROOT, 'data', 'mashq.json'), encoding='utf-8'))['s']
    tf = os.path.join(ROOT, 'src', 'build', 'savol-tuzatish.json')
    T = json.load(open(tf, encoding='utf-8')) if os.path.exists(tf) else {}
    kutadi = {int(k) for k in T.get('_kutadi', {})}
    qoldi = {(int(d), k) for d, t in T.items() if not d.startswith('_') for k in t.get('qoldi', {})}
    dars = collections.defaultdict(list)
    for q in S:
        dars[q['d']].append(q)
    natija = collections.defaultdict(list)

    def yoz(d, tur, matn):
        kk = re.findall(r'\b\d+-\d+\b', matn.split('-darsdagi')[0] if '-darsdagi' in matn else matn)
        if kk and all((d, k) in qoldi for k in kk):
            return
        if d in kutadi and tur != 'XATO':
            tur = 'KUTADI'
        natija[d].append((tur, matn))

    for d, L in sorted(dars.items()):
        if tanla and d not in tanla:
            continue
        if len(L) < KAM:
            yoz(d, 'DIQQAT', '%d ta savol (kamida %d bo\'lsin)' % (len(L), KAM))
        c = collections.Counter(javob(q) for q in L)
        top, n = c.most_common(1)[0]
        foiz = round(100 * n / len(L))
        if foiz >= OTISH:
            yoz(d, 'BOSQICH3', 'doim «%s» bosilsa %d%% — taxmin bilan o\'tadi' % ({'R': 'замма', 'N': 'фатҳа', 'J': 'касра', 'Z': 'сукун'}.get(top, top), foiz))
        bir = collections.defaultdict(list)
        for q in L:
            G, w = q['gap'], q['w']
            tw = G[w][0]
            v = [x[0] for x in q['var']]
            if tw not in v:
                yoz(d, 'XATO', '%s: to\'g\'ri javob variantlarda yo\'q' % q['k'])
            if len({x.strip() for x in v}) < len(v):
                yoz(d, 'XATO', '%s: ikki variant bir xil ko\'rinadi' % q['k'])
            for x in v:     # olmosh harakati: «…ُهِمْ», «…َهِ» kabi shakl arabchada yo'q (ه o'zak harfi bo'lsa — DIQQAT, o'zing qara)
                if re.search('[َُ]هِ|ِهُ', x):
                    yoz(d, 'DIQQAT', '%s: variant shakli shubhali (olmosh harakati?) — %s' % (q['k'], x))
            lb = {x[0]: x[2] for x in q['var']}
            ogri = [x for x in lb if lb[x] not in STD]
            # faqat to'g'ri variantda izoh bo'lsa yoki yorliqda qoida aytilsa — javob ochiladi;
            # hamma variantda holat yozilgani («و — раф», «ي — насб/жар») — ochmaydi
            if ogri and ((tw in ogri and len(ogri) < len(v)) or any(re.search('мунсариф|ўрнига|ўрнида|учун|оддий', lb[x]) for x in ogri)):
                yoz(d, 'XATO', '%s: yorliq javobni ochib qo\'yishi mumkin (%s)' % (q['k'], '; '.join(lb[x] for x in ogri)))
            oz = ozak(tw)
            if oz in QOTGAN:
                yoz(d, 'DIQQAT', '%s: harakati o\'zgarmaydigan so\'z — %s' % (q['k'], tw))
            qoshni = plain(' '.join(x[0] for x in G[max(0, w - 2):w + 3]))
            for a, b in IBORA:
                if oz == ozak(a) and b in qoshni:
                    yoz(d, 'DIQQAT', '%s: yodlangan ibora — %s' % (q['k'], tw))
            prev = plain(G[w - 1][0]) if w else ''
            bir[(prev, plain(tw), javob(q))].append(q['k'])
        for v in bir.values():
            if len(v) > 1:
                yoz(d, 'XATO', 'dars ichida bir xil savol: ' + ', '.join(v))

    # darslararo takror: bir xil o'zak + harakat + vazifa
    m = collections.defaultdict(list)
    for q in S:
        tw = q['gap'][q['w']][0]
        m[(ozak(tw), javob(q), vazifa(q))].append((q['d'], q['k']))
    for k, v in m.items():
        ds = sorted({d for d, _ in v})
        if len(ds) > 1:
            kech = [x for x in v if x[0] != ds[0]]
            for d, kk in kech:
                if not tanla or d in tanla:
                    yoz(d, 'DIQQAT', '%s: %s-darsdagi savol bilan bir xil (%s — %s)' % (kk, ds[0], k[0], k[2]))

    jami = collections.Counter()
    for d in sorted(natija):
        print('— %s-dars (%d savol)' % (d, len(dars[d])))
        for tur, matn in natija[d]:
            jami[tur] += 1
            print('  %-8s %s' % (tur, matn))
    print('Jami: %d savol, %d dars · XATO %d · DIQQAT %d · BOSQICH3 %d · KUTADI %d' % (
        sum(len(dars[d]) for d in dars if not tanla or d in tanla), len([d for d in dars if not tanla or d in tanla]),
        jami['XATO'], jami['DIQQAT'], jami['BOSQICH3'], jami['KUTADI']))
    sys.exit(1 if jami['XATO'] else 0)


if __name__ == '__main__':
    main()
