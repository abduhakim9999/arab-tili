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
HM = {(98, '34'): 1}                                   # (dars, kn): ma'no raqami — avtomat topilmasa yoki xato bo'lsa («демак (натижа)»)


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


if __name__ == '__main__':
    main()
